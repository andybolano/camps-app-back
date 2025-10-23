import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm.config';
import { User } from '../../users/entities/user.entity';
import { Camp } from '../../camps/entities/camp.entity';
import { Club } from '../../clubs/entities/club.entity';
import { ClubCategory } from '../../clubs/entities/club-category.entity';
import { Category } from '../../categories/entities/category.entity';
import { CampRegistration } from '../../camp-registrations/entities/camp-registration.entity';
import { Event } from '../../events/entities/event.entity';
import { EventItem } from '../../events/entities/event-item.entity';
import { MemberBasedEventItem } from '../../events/entities/member-based-event-item.entity';
import { Result } from '../../results/entities/result.entity';
import { ResultItem } from '../../results/entities/result-item.entity';
import { ResultMemberBasedItem } from '../../results/entities/result-member-based-item.entity';
import { CampEvent } from '../../camp-events/entities/camp-event.entity';
import { CampEventItem } from '../../camp-events/entities/camp-event-item.entity';
import { CampEventMemberBasedItem } from '../../camp-events/entities/camp-event-member-based-item.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([
      User,
      Camp,
      Club,
      ClubCategory,
      Category,
      CampRegistration,
      Event,
      EventItem,
      MemberBasedEventItem,
      CampEvent,
      CampEventItem,
      CampEventMemberBasedItem,
      Result,
      ResultItem,
      ResultMemberBasedItem,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
