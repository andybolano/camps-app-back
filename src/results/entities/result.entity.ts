import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { ResultItem } from './result-item.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Result {
  @ApiProperty({ description: 'The unique identifier of the result' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The event this result belongs to',
    type: () => Event,
  })
  @ManyToOne(() => Event, (event) => event.results)
  event: Event;

  @ApiProperty({
    description: 'List of regular result items',
    type: () => [ResultItem],
  })
  @OneToMany(() => ResultItem, (item) => item.result, { cascade: true })
  items: ResultItem[];

  @ApiProperty({ description: 'The total score of the result' })
  @Column({ type: 'float', default: 0 })
  totalScore: number;
}
