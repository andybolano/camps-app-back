import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Event } from './event.entity';

@Entity()
export class MemberBasedEventItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'float' })
  percentage: number;

  @Column('simple-array')
  applicableCharacteristics: string[];

  @Column({ default: 'PROPORTION' })
  calculationType: string; // PROPORTION, TOTAL, etc.

  @Column({ default: false })
  isRequired: boolean;

  @ManyToOne(() => Event, (event) => event.memberBasedItems)
  event: Event;
}
