import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CampEvent } from './camp-event.entity';
import { EventItem } from '../../events/entities/event-item.entity';

@Entity()
export class CampEventItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CampEvent, (campEvent) => campEvent.items)
  campEvent: CampEvent;

  @ManyToOne(() => EventItem, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'eventItemTemplateId' })
  eventItemTemplate: EventItem;

  @Column({ nullable: true })
  customName: string; // Si null, usa el nombre de la plantilla

  @Column({ default: true })
  isActive: boolean;
}
