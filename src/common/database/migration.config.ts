import { DataSource } from 'typeorm';
import { typeormConfig } from './typeorm.config';

export default new DataSource({
  ...typeormConfig,
  migrations: ['src/migrations/*.ts'],
});
