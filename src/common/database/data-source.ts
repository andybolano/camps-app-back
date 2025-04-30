import { DataSource } from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { EventItem } from '../../events/entities/event-item.entity';
import { Result } from '../../results/entities/result.entity';
import { ResultItem } from '../../results/entities/result-item.entity';
import { User } from '../../users/entities/user.entity';
import { Club } from '../../clubs/entities/club.entity';
import { Member } from '../../clubs/entities/member.entity';
import { Camp } from '../../camps/entities/camp.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'andyb',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'campamento',
  entities: [Event, EventItem, Result, ResultItem, User, Club, Member, Camp],
  synchronize: process.env.NODE_ENV !== 'production',
});
