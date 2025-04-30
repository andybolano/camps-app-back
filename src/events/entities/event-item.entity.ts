import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Event } from './event.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class EventItem {
  @ApiProperty({ description: 'The unique identifier of the event item' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The name of the event item' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The description of the event item' })
  @Column()
  description: string;

  @ApiProperty({
    description: 'The maximum score possible for this event item',
  })
  @Column({ type: 'float' })
  maxScore: number;

  @ApiProperty({
    description: 'The event this item belongs to',
    type: () => Event,
  })
  @ManyToOne(() => Event, (event) => event.items)
  event: Event;
}
