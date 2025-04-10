import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './entities/event.entity';
import { EventItem } from './entities/event-item.entity';
import { MemberBasedEventItem } from './entities/member-based-event-item.entity';
import { CampsModule } from '../camps/camps.module';
import { ResultsModule } from '../results/results.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventItem, MemberBasedEventItem]),
    CampsModule,
    forwardRef(() => ResultsModule), // Usamos forwardRef para evitar dependencias circulares
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
