import 'dotenv/config';
import { defineConfig } from 'prisma/config';

interface CustomConfig {
  schema: string;
  datasource: {
    url: string | undefined;
    directUrl?: string | undefined;
  };
}

const config: CustomConfig = {
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
  },
};

export default defineConfig(config as unknown as CustomConfig);
