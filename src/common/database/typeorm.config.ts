import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

export const typeormConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'andyb',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'campamento',
  entities: [join(__dirname, '..', '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, '..', '..', 'migrations', '*.{ts,js}')],
  // Safer approach - only use synchronize in development and with caution
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV !== 'production',
  // Additional database security and performance settings
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  connectTimeoutMS: 10000,
  maxQueryExecutionTime: 1000, // Log slow queries (over 1s)
};

export default new DataSource(typeormConfig);
