import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampsService } from './camps.service';
import { CampsController } from './camps.controller';
import { Camp } from './entities/camp.entity';
import { Category } from '../categories/entities/category.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Camp, Category]), CommonModule],
  controllers: [CampsController],
  providers: [CampsService],
  exports: [CampsService],
})
export class CampsModule {}
