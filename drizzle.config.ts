import { type Config } from 'drizzle-kit';

export default {
  schema: './src/server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://user:password@localhost:5432/database',
  },
  tablesFilter: ['t3_*'],
} satisfies Config;
