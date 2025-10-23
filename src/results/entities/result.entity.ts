import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CampRegistration } from '../../camp-registrations/entities/camp-registration.entity';
import { CampEvent } from '../../camp-events/entities/camp-event.entity';
import { ResultItem } from './result-item.entity';
import { ResultMemberBasedItem } from './result-member-based-item.entity';

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float', default: 0 })
  totalScore: number;

  @ManyToOne(
    () => CampRegistration,
    (registration) => registration.results,
  )
  campRegistration: CampRegistration;

  @ManyToOne(() => CampEvent, (campEvent) => campEvent.results)
  campEvent: CampEvent;

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
