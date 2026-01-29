import { db } from '../config/database';
import { users } from '../db/schema/users';
import { eq } from 'drizzle-orm';

export class UserService {
  async getUserById(userId: number) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: number, data: { name?: string; status?: string; avatar?: string }) {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      throw new Error('User not found');
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}
