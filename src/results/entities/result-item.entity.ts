import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Result } from './result.entity';
import { CampEventItem } from '../../camp-events/entities/camp-event-item.entity';

@Entity()
export class ResultItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  score: number;

  @ManyToOne(() => Result, (result) => result.items)
  result: Result;

  @ManyToOne(() => CampEventItem)
  eventItem: CampEventItem;
}
