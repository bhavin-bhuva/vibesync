import { db } from '../config/database';
import { users } from '../db/schema/users';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateFriendCode } from '../utils/friend-code.util';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.util';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';

export class AuthService {
  async register(name: string, email: string, password: string) {
    // Check if email exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate unique friend code
    let friendCode: string;
    let isUnique = false;

    while (!isUnique) {
      friendCode = generateFriendCode();
      const existing = await db.query.users.findFirst({
        where: eq(users.friendCode, friendCode),
      });
      if (!existing) isUnique = true;
    }

    // Create user
    const [newUser] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      friendCode: friendCode!,
    }).returning();

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: newUser.id,
      email: newUser.email,
    });

    const refreshToken = generateRefreshToken({
      userId: newUser.id,
      email: newUser.email,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return {
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 3600,
      },
    };
  }

  async login(email: string, password: string) {
    // Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 3600,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.userId),
    });

    if (!user) {
      throw new Error('User not found');
    }

    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    return {
      accessToken: newAccessToken,
      expiresIn: 3600,
    };
  }

  async handleSocialLogin(name: string, email: string, avatar?: string) {
    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return existingUser;
    }

    // Create new user with random password
    const password = randomBytes(16).toString('hex');
    const hashedPassword = await hashPassword(password);

    // Generate unique friend code
    let friendCode: string;
    let isUnique = false;

    while (!isUnique) {
      friendCode = generateFriendCode();
      const existing = await db.query.users.findFirst({
        where: eq(users.friendCode, friendCode),
      });
      if (!existing) isUnique = true;
    }

    // Create user
    const [newUser] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      friendCode: friendCode!,
      avatar: avatar || null,
      online: true, // Set online initially
    }).returning();

    return newUser;
  }

  async googleSignIn(token: string) {
    try {
      let email: string;
      let name: string;
      let avatar: string | undefined;

      // Check if token is a JWT (ID token) or an access token
      // JWTs have 3 parts separated by dots
      const isJWT = token.split('.').length === 3;

      if (isJWT) {
        // Handle ID token (JWT format)
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            Buffer.from(base64, 'base64')
              .toString()
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );

          const payload = JSON.parse(jsonPayload);
          email = payload.email;
          name = payload.name || email.split('@')[0];
          avatar = payload.picture;
        } catch (error) {
          throw new Error('Invalid Google ID token');
        }
      } else {
        // Handle access token - verify with Google's tokeninfo endpoint
        try {
          const response = await fetch(
            `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
          );

          if (!response.ok) {
            throw new Error('Invalid access token');
          }

          const tokenInfo = await response.json() as any;

          // Verify the token is valid
          if (!tokenInfo.email || !tokenInfo.email_verified) {
            throw new Error('Email not verified or not found');
          }

          // Get user profile information using the access token
          const profileResponse = await fetch(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!profileResponse.ok) {
            throw new Error('Failed to fetch user profile');
          }

          const profile = await profileResponse.json() as any;
          email = profile.email;
          name = profile.name || email.split('@')[0];
          avatar = profile.picture;
        } catch (error) {
          console.error('Access token verification error:', error);
          throw new Error('Invalid Google access token');
        }
      }

      if (!email) {
        throw new Error('Email not found in Google token');
      }

      // Handle social login (create or find user)
      const user = await this.handleSocialLogin(name, email, avatar);

      // Generate tokens
      const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
      });

      const refreshToken = generateRefreshToken({
        userId: user.id,
        email: user.email,
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 3600,
        },
      };
    } catch (error) {
      console.error('Google Sign-In error:', error);
      throw error;
    }
  }
}
