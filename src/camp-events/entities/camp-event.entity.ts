import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Camp } from '../../camps/entities/camp.entity';
import { Event } from '../../events/entities/event.entity';
import { Result } from '../../results/entities/result.entity';
import { CampEventItem } from './camp-event-item.entity';
import { CampEventMemberBasedItem } from './camp-event-member-based-item.entity';

@Entity()
export class CampEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Camp, (camp) => camp.campEvents)
  camp: Camp;

  @ManyToOne(() => Event)
  eventTemplate: Event;

  // Campos personalizables por campamento
  @Column({ nullable: true })
  customName: string; // Si null, usa el nombre de la plantilla

  @Column({ nullable: true })
  customDescription: string; // Si null, usa la descripción de la plantilla

  @Column({ type: 'integer', nullable: true })
  customMaxScore: number; // Si null, usa el maxScore de la plantilla

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => CampEventItem, (item) => item.campEvent, { cascade: true })
  items: CampEventItem[];

  @OneToMany(
    () => CampEventMemberBasedItem,
    (item) => item.campEvent,
    { cascade: true },
  )
  memberBasedItems: CampEventMemberBasedItem[];

  @OneToMany(() => Result, (result) => result.campEvent)
  results: Result[];
}
