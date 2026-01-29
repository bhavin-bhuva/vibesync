import { Pool } from 'pg';
import { env } from '../config/env';

async function resetDb() {
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  });

  try {
    console.log('🗑️  Dropping all tables...');

    // Check if we are in production to prevent accidents (basic check)
    if (env.NODE_ENV === 'production') {
      console.error('❌ Cannot reset database in production!');
      process.exit(1);
    }

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
