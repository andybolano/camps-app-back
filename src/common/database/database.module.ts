import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.NODE_ENV === 'production'
        ? {
            url: process.env.DATABASE_URL,
            ssl:
              process.env.DATABASE_SSL === 'true'
                ? {
                    rejectUnauthorized: false,
                  }
                : false,
          }
        : {
            database:
              process.env.DATABASE_PATH || join(process.cwd(), 'db.sqlite'),
            type: 'sqlite',
          }),
      entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
      synchronize: process.env.NODE_ENV !== 'production', // Solo true en desarrollo
    } as TypeOrmModuleOptions),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
