import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClubCategory } from './club-category.entity';

@Entity()
export class Club {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  motto: string;

  @Column({ nullable: true })
  shieldUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ClubCategory, (clubCategory) => clubCategory.club, {
    cascade: true,
  })
  clubCategories: ClubCategory[];
}
