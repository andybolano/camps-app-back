import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';
import { Result } from './entities/result.entity';
import { ResultItem } from './entities/result-item.entity';
import { ResultMemberBasedItem } from './entities/result-member-based-item.entity';
import { ClubsModule } from '../clubs/clubs.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Result, ResultItem, ResultMemberBasedItem]),
    ClubsModule,
    forwardRef(() => EventsModule),
  ],
  controllers: [ResultsController],
  providers: [ResultsService],
  exports: [ResultsService],
})
export class ResultsModule {}
