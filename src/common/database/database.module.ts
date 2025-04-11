import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from '../../../typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(dataSource.options)],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
