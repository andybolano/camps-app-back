import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Club } from '../../clubs/entities/club.entity';
import { ResultItem } from './result-item.entity';
import { ResultMemberBasedItem } from './result-member-based-item.entity';

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float', default: 0 })
  totalScore: number;

  @ManyToOne(() => Club, (club) => club.results)
  club: Club;

  @ManyToOne('Event', 'results')
  event: any;

  @OneToMany(() => ResultItem, (resultItem) => resultItem.result, {
    cascade: true,
  })
  items: ResultItem[];

  @OneToMany(
    () => ResultMemberBasedItem,
    (resultMemberBasedItem) => resultMemberBasedItem.result,
    {
      cascade: true,
    },
  )
  memberBasedItems: ResultMemberBasedItem[];
}
