import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.development.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

export default defineConfig({
  out: './drizzle',
  schema: './src/drizzle/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
