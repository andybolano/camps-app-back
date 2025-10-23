import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { EventItem } from './event-item.entity';
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

  @Column({ type: 'integer' })
  maxScore: number;

  @ManyToOne(() => Category, { nullable: true })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => EventItem, (item) => item.event, { cascade: true })
  items: EventItem[];

  @OneToMany(() => MemberBasedEventItem, (item) => item.event, {
    cascade: true,
  })
  memberBasedItems: MemberBasedEventItem[];
}
