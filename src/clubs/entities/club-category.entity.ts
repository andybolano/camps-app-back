import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Club } from './club.entity';
import { Category } from '../../categories/entities/category.entity';
import { CampRegistration } from '../../camp-registrations/entities/camp-registration.entity';

@Entity()
export class ClubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Club, (club) => club.clubCategories, { onDelete: 'CASCADE' })
  club: Club;

  @ManyToOne(() => Category, (category) => category.clubCategories)
  category: Category;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(
    () => CampRegistration,
    (registration) => registration.clubCategory,
  )
  campRegistrations: CampRegistration[];
}
