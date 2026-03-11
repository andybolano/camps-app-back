import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampEventsService } from './camp-events.service';
import { CampEventsController } from './camp-events.controller';
import { CampEvent } from './entities/camp-event.entity';
import { CampEventItem } from './entities/camp-event-item.entity';
import { CampEventMemberBasedItem } from './entities/camp-event-member-based-item.entity';
import { CampsModule } from '../camps/camps.module';
import { EventsModule } from '../events/events.module';
import { ResultsModule } from '../results/results.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CampEvent,
      CampEventItem,
      CampEventMemberBasedItem,
    ]),
    CampsModule,
    EventsModule,
    forwardRef(() => ResultsModule),
  ],
  controllers: [CampEventsController],
  providers: [CampEventsService],
  exports: [CampEventsService],
})
export class CampEventsModule {}
