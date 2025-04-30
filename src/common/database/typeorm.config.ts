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
  synchronize: process.env.NODE_ENV !== 'production',
  logging: true,
};

export default new DataSource(typeormConfig);
