import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';
import { Result } from './entities/result.entity';
import { ResultItem } from './entities/result-item.entity';
import { ResultMemberBasedItem } from './entities/result-member-based-item.entity';
import { CampRegistrationsModule } from '../camp-registrations/camp-registrations.module';
import { CampEventsModule } from '../camp-events/camp-events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Result, ResultItem, ResultMemberBasedItem]),
    CampRegistrationsModule,
    forwardRef(() => CampEventsModule),
  ],
  controllers: [ResultsController],
  providers: [ResultsService],
  exports: [ResultsService],
})
export class ResultsModule {}
