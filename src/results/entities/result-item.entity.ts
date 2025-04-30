import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Result } from './result.entity';
import { EventItem } from '../../events/entities/event-item.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ResultItem {
  @ApiProperty({ description: 'The unique identifier of the result item' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The score for this result item' })
  @Column({ type: 'float' })
  score: number;

  @ApiProperty({
    description: 'The event item this result item belongs to',
    type: () => EventItem,
  })
  @ManyToOne(() => EventItem)
  eventItem: EventItem;

  @ApiProperty({
    description: 'The result this item belongs to',
    type: () => Result,
  })
  @ManyToOne(() => Result, (result) => result.items)
  result: Result;
}
