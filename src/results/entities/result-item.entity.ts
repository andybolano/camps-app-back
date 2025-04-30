import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { EventItem } from '../../events/entities/event-item.entity';
import { Club } from '../../clubs/entities/club.entity';
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
  @ManyToOne(() => EventItem, (eventItem) => eventItem.resultItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventItemId' })
  eventItem: EventItem;

  @ApiProperty({
    description: 'The club that obtained this score',
    type: () => Club,
  })
  @ManyToOne(() => Club, (club) => club.resultItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clubId' })
  club: Club;
}
