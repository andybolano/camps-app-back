import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CampEvent } from './camp-event.entity';
import { MemberBasedEventItem } from '../../events/entities/member-based-event-item.entity';

@Entity()
export class CampEventMemberBasedItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CampEvent, (campEvent) => campEvent.memberBasedItems)
  campEvent: CampEvent;

  @ManyToOne(() => MemberBasedEventItem)
  eventItemTemplate: MemberBasedEventItem;

  @Column({ nullable: true })
  customName: string; // Si null, usa el nombre de la plantilla

  @Column({ type: 'integer', nullable: true })
  customScorePerMember: number; // Puntaje personalizado por miembro

  @Column({ default: true })
  isActive: boolean;
}
