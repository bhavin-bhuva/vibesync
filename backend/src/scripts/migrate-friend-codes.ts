import { db } from '../config/database';
import { users } from '../db/schema/users';
import { generateFriendCode } from '../utils/friend-code.util';
import { eq } from 'drizzle-orm';

/**
 * Migration script to update old 14-character friend codes to new 17-character format
 * Run this once to migrate existing users
 */
async function migrateFriendCodes() {
  console.log('Starting friend code migration...');

  try {
    // Get all users
    const allUsers = await db.select().from(users);
    console.log(`Found ${allUsers.length} users to check`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const user of allUsers) {
      // Check if friend code is old format (14 characters: XXXX-XXXX-XXXX)
      if (user.friendCode && user.friendCode.length === 14) {
        console.log(`Updating user ${user.id} (${user.email}) - old code: ${user.friendCode}`);

        // Generate new 17-character friend code
        let newFriendCode = '';
        let isUnique = false;

        // Keep generating until we get a unique code
        while (!isUnique) {
          newFriendCode = generateFriendCode();

          // Check if this code already exists
          const existing = await db
            .select()
            .from(users)
            .where(eq(users.friendCode, newFriendCode))
            .limit(1);

          if (existing.length === 0) {
            isUnique = true;
          }
        }

        // Update the user's friend code
        await db
          .update(users)
          .set({
            friendCode: newFriendCode,
            updatedAt: new Date()
          })
          .where(eq(users.id, user.id));

        console.log(`✓ Updated to: ${newFriendCode}`);
        updatedCount++;
      } else if (user.friendCode && user.friendCode.length === 17) {
        console.log(`Skipping user ${user.id} - already has 17-char code: ${user.friendCode}`);
        skippedCount++;
      } else {
        console.log(`Warning: User ${user.id} has unexpected friend code format: ${user.friendCode}`);
      }
    }

    console.log('\n=== Migration Complete ===');
    console.log(`Updated: ${updatedCount} users`);
    console.log(`Skipped: ${skippedCount} users (already migrated)`);
    console.log(`Total: ${allUsers.length} users`);

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run the migration
migrateFriendCodes()
  .then(() => {
    console.log('\nMigration successful!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nMigration failed:', error);
    process.exit(1);
  });
