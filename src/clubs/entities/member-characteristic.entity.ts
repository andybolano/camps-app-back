import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Club } from './club.entity';

@Entity()
export class MemberCharacteristic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  value: number;

  @Column({ default: 0 })
  matchCount: number;

  @ManyToOne(() => Club, (club) => club.memberCharacteristics)
  club: Club;
}
