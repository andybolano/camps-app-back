import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CampEvent } from './camp-event.entity';
import { MemberBasedEventItem } from '../../events/entities/member-based-event-item.entity';

@Entity()
export class CampEventMemberBasedItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CampEvent, (campEvent) => campEvent.memberBasedItems)
  campEvent: CampEvent;

  @ManyToOne(() => MemberBasedEventItem, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'memberBasedEventItemTemplateId' })
  eventItemTemplate: MemberBasedEventItem;

  @Column({ nullable: true })
  customName: string; // Si null, usa el nombre de la plantilla

  @Column('simple-array', { nullable: true })
  applicableCharacteristics: string[];

  @Column({ nullable: true })
  calculationType: string; // PROPORTION, COUNT, TOTAL, etc.

  @Column({ default: false })
  isRequired: boolean;

  @Column({ default: true })
  isActive: boolean;
}
