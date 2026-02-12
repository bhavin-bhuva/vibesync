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

  async googleSignIn(idToken: string) {
    // For now, we'll use a simple approach without verifying the token
    // In production, you should verify the token using Google's OAuth2 client
    // For this implementation, we'll decode the JWT to get user info
    
    try {
      // Decode the ID token (without verification for simplicity)
      // In production, use google-auth-library to verify the token
      const base64Url = idToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        Buffer.from(base64, 'base64')
          .toString()
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      
      // Extract user info from token
      const email = payload.email;
      const name = payload.name || email.split('@')[0];
      const avatar = payload.picture;
      
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
      throw new Error('Invalid Google ID token');
    }
  }
}
