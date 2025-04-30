import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Camp } from '../../camps/entities/camp.entity';
import { EventItem } from './event-item.entity';
import { Result } from '../../results/entities/result.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Event {
  @ApiProperty({ description: 'The unique identifier of the event' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The name of the event' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The description of the event', required: false })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'The type of the event',
    enum: ['REGULAR'],
    default: 'REGULAR',
  })
  @Column({ default: 'REGULAR' })
  type: string; // 'REGULAR'

  @ApiProperty({
    description: 'The camp this event belongs to',
    type: () => Camp,
  })
  @ManyToOne(() => Camp, (camp) => camp.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'campId' })
  camp: Camp;

  @ApiProperty({
    description: 'List of regular event items',
    type: () => [EventItem],
  })
  @OneToMany(() => EventItem, (item) => item.event, { cascade: true })
  items: EventItem[];

  @ApiProperty({
    description: 'List of results for this event',
    type: () => [Result],
  })
  @OneToMany(() => Result, (result) => result.event)
  results: Result[];
}
