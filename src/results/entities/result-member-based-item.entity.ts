import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Result } from './result.entity';
import { MemberBasedEventItem } from '../../events/entities/member-based-event-item.entity';

@Entity()
export class ResultMemberBasedItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  score: number;

  @Column({ default: 0 })
  totalWithCharacteristic: number;

  @Column({ default: 0 })
  matchCount: number;

  @ManyToOne(() => Result, (result) => result.memberBasedItems)
  result: Result;

  @ManyToOne(() => MemberBasedEventItem)
  eventItem: MemberBasedEventItem;
}
