import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config();

const isProduction = process.env.NODE_ENV === 'production';

const baseConfig = {
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: !isProduction,
};

const configOptions = isProduction
  ? {
      ...baseConfig,
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl:
        process.env.DATABASE_SSL === 'true'
          ? { rejectUnauthorized: false }
          : false,
    }
  : {
      ...baseConfig,
      type: 'sqlite',
      database: join(__dirname, 'db.sqlite'),
    };

export default new DataSource(configOptions as any);
