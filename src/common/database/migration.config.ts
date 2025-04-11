import { DataSource } from 'typeorm';
import { join } from 'path';
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

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  database: process.env.DATABASE_NAME || 'campamento_app',
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
  migrations: [join(__dirname, '../../migrations/*{.ts,.js}')],
  synchronize: false,
  migrationsRun: false,
  logging: !isProduction,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  extra: {
    max: isProduction ? 20 : 10,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  },
});
