import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Camp } from '../../camps/entities/camp.entity';
import { EventItem } from './event-item.entity';
import { Result } from '../../results/entities/result.entity';
import { MemberBasedEventItem } from './member-based-event-item.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'REGULAR' })
  type: string; // 'REGULAR' or 'MEMBER_BASED'

  @ManyToOne(() => Camp, (camp) => camp.events)
  camp: Camp;

  @OneToMany(() => EventItem, (item) => item.event, { cascade: true })
  items: EventItem[];

  @OneToMany(() => MemberBasedEventItem, (item) => item.event, {
    cascade: true,
  })
  memberBasedItems: MemberBasedEventItem[];

  @OneToMany(() => Result, (result) => result.event)
  results: Result[];
}
