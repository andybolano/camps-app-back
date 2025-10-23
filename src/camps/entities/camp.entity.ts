import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CampRegistration } from '../../camp-registrations/entities/camp-registration.entity';
import { Category } from '../../categories/entities/category.entity';
import { CampEvent } from '../../camp-events/entities/camp-event.entity';

@Entity()
export class Camp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  logoUrl: string;

  @ManyToOne(() => Category, { nullable: false })
  @JoinColumn({ name: 'targetCategoryId' })
  targetCategory: Category;

  @OneToMany(() => CampRegistration, (registration) => registration.camp)
  registrations: CampRegistration[];

  @OneToMany(() => CampEvent, (campEvent) => campEvent.camp)
  campEvents: CampEvent[];
}
