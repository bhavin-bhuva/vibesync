import { Pool } from 'pg';
import { env } from '../config/env';

async function resetDb() {
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  });

  try {
    // Check if we are in production to prevent accidents (basic check)
    if (env.NODE_ENV === 'production') {
      console.error('❌ Cannot reset database in production!');
      process.exit(1);
    }

    // Require explicit opt-in
    if (env.ALLOW_DB_RESET !== 'true' && env.ALLOW_DB_RESET !== '1') {
      console.error('❌ ALLOW_DB_RESET must be set to "true" or "1" to perform this action.');
      console.error('   Please check your .env file or environment variables.');
      process.exit(1);
    }

    console.log('🗑️  Dropping all tables...');

    // Drop schema public and recreate it
    await pool.query('DROP SCHEMA public CASCADE;');
    await pool.query('CREATE SCHEMA public;');
    await pool.query('GRANT ALL ON SCHEMA public TO public;');

    console.log('✅ Database reset successfully');
  } catch (error) {
    console.error('❌ Failed to reset database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetDb();
