import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { User } from './src/users/entities/user.entity';
import { Camp } from './src/camps/entities/camp.entity';
import { Club } from './src/clubs/entities/club.entity';
import { Event } from './src/events/entities/event.entity';
import { EventItem } from './src/events/entities/event-item.entity';
import { MemberBasedEventItem } from './src/events/entities/member-based-event-item.entity';
import { MemberCharacteristic } from './src/clubs/entities/member-characteristic.entity';
import { Result } from './src/results/entities/result.entity';
import { ResultItem } from './src/results/entities/result-item.entity';
import { ResultMemberBasedItem } from './src/results/entities/result-member-based-item.entity';

config();

const baseConfig = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
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
  ],
  migrations: [join(__dirname, 'src/migrations/*{.ts,.js}')],
  synchronize: false,
  migrationsRun: false,
  logging: true,
  ssl:
    process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

export default new DataSource(baseConfig as any);
