// Prisma v7 Configuration
// DATABASE_URL should be set in environment variables
// For SQLite: DATABASE_URL="file:./dev.db"
// For PostgreSQL: DATABASE_URL="postgresql://user:password@localhost:5432/logistics"

import 'dotenv/config'

export default {
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    // seed: `tsx prisma/seed.ts`,
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
};