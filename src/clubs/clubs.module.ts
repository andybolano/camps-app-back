import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubsService } from './clubs.service';
import { ClubsController } from './clubs.controller';
import { Club } from './entities/club.entity';
import { CampsModule } from '../camps/camps.module';
import { CommonModule } from '../common/common.module';
import { Result } from '../results/entities/result.entity';
import { ResultItem } from '../results/entities/result-item.entity';
import { ResultMemberBasedItem } from '../results/entities/result-member-based-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Club, Result, ResultItem, ResultMemberBasedItem]), CampsModule, CommonModule],
  controllers: [ClubsController],
  providers: [ClubsService],
  exports: [ClubsService],
})
export class ClubsModule {}
