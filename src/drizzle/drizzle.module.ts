import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { config } from 'dotenv';

config({ path: '.env.development.local' });

export const DB_CONNECTION = 'DB_CONNECTION';

@Module({
  providers: [
    {
      provide: DB_CONNECTION,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        if (!databaseUrl) {
          throw new Error(
            'DATABASE_URL is not defined in environment variables',
          );
        }

        console.log('Connecting to database...');

        const pool = new Pool({
          connectionString: databaseUrl,
          ssl: databaseUrl.includes('localhost')
            ? false
            : { rejectUnauthorized: false },
        });

        // Test the connection
        try {
          await pool.query('SELECT NOW()');
          console.log('Database connected successfully');
        } catch (error) {
          console.error('Database connection failed:', error);
          throw error;
        }

        return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
      },
    },
  ],
  exports: [DB_CONNECTION],
})
export class DrizzleModule {}
