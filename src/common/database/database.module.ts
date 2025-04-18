import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm.config';
import { User } from '../../users/entities/user.entity';
import { Camp } from '../../camps/entities/camp.entity';
import { Club } from '../../clubs/entities/club.entity';
import { Event } from '../../events/entities/event.entity';
import { EventItem } from '../../events/entities/event-item.entity';
import { MemberBasedEventItem } from '../../events/entities/member-based-event-item.entity';
import { MemberCharacteristic } from '../../clubs/entities/member-characteristic.entity';
import { Result } from '../../results/entities/result.entity';
import { ResultItem } from '../../results/entities/result-item.entity';
import { ResultMemberBasedItem } from '../../results/entities/result-member-based-item.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([
      User,
      Camp,
      Club,
      Event,
      EventItem,
      MemberBasedEventItem,
      MemberCharacteristic,
      Result,
      ResultItem,
      ResultMemberBasedItem,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
