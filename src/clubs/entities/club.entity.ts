import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Camp } from '../../camps/entities/camp.entity';
import { Result } from '../../results/entities/result.entity';
import { MemberCharacteristic } from './member-characteristic.entity';

@Entity()
export class Club {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  participantsCount: number;

  @Column()
  guestsCount: number;

  @Column({ default: 0 })
  minorsCount: number;

  @Column()
  economsCount: number;

  @Column({ default: 0 })
  companionsCount: number;

  @Column({ type: 'float' })
  registrationFee: number;

  @Column({ type: 'boolean', default: true })
  isPaid: boolean;

  @Column({ nullable: true })
  shieldUrl: string;

  @ManyToOne(() => Camp, (camp) => camp.clubs)
  camp: Camp;

  @OneToMany(() => Result, (result) => result.club)
  results: Result[];

  @OneToMany(
    () => MemberCharacteristic,
    (characteristic) => characteristic.club,
    {
      cascade: true,
    },
  )
  memberCharacteristics: MemberCharacteristic[];
}
