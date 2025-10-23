import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ClubCategory } from '../../clubs/entities/club-category.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ unique: true })
  code: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => ClubCategory, (clubCategory) => clubCategory.category)
  clubCategories: ClubCategory[];
}
