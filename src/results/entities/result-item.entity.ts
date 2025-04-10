import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Result } from './result.entity';
import { EventItem } from '../../events/entities/event-item.entity';

@Entity()
export class ResultItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  score: number;

  @ManyToOne(() => Result, (result) => result.items)
  result: Result;

  @ManyToOne(() => EventItem)
  eventItem: EventItem;
}
