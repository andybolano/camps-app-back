import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Camp } from '../../camps/entities/camp.entity';
import { ClubCategory } from '../../clubs/entities/club-category.entity';
import { Result } from '../../results/entities/result.entity';

@Entity()
export class CampRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Camp, (camp) => camp.registrations)
  camp: Camp;

  @ManyToOne(() => ClubCategory, (clubCategory) => clubCategory.campRegistrations)
  clubCategory: ClubCategory;

  @Column({ default: 0 })
  participantsCount: number;

  @Column({ default: 0 })
  guestsCount: number;

  @Column({ default: 0 })
  minorsCount: number;

  @Column({ default: 0 })
  economsCount: number;

  @Column({ default: 0 })
  companionsCount: number;

  @Column({ default: 0 })
  directorCount: number;

  @Column({ default: 0 })
  pastorCount: number;

  @Column({ type: 'float' })
  registrationFee: number;

  @Column({ type: 'boolean', default: false })
  isPaid: boolean;

  @CreateDateColumn()
  registrationDate: Date;

  @OneToMany(() => Result, (result) => result.campRegistration)
  results: Result[];
}
