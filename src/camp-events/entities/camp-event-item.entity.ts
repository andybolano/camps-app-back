import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CampEvent } from './camp-event.entity';
import { EventItem } from '../../events/entities/event-item.entity';

@Entity()
export class CampEventItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CampEvent, (campEvent) => campEvent.items)
  campEvent: CampEvent;

  @ManyToOne(() => EventItem)
  eventItemTemplate: EventItem;

  @Column({ nullable: true })
  customName: string; // Si null, usa el nombre de la plantilla

  @Column({ type: 'integer', nullable: true })
  customMaxScore: number; // Puntaje personalizado para este campamento

  @Column({ default: true })
  isActive: boolean;
}
