import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { ResultItem } from './entities/result-item.entity';
import { EventItem } from '../events/entities/event-item.entity';
import { Club } from '../clubs/entities/club.entity';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(ResultItem)
    private readonly resultItemRepository: Repository<ResultItem>,
    @InjectRepository(EventItem)
    private readonly eventItemRepository: Repository<EventItem>,
    @InjectRepository(Club)
    private readonly clubRepository: Repository<Club>,
  ) {}

  async create(createResultDto: CreateResultDto) {
    const resultItems: ResultItem[] = [];

    for (const item of createResultDto.items) {
      const eventItem = await this.eventItemRepository.findOne({
        where: { id: item.eventItemId.toString() },
      });

      if (!eventItem) {
        throw new NotFoundException(`EventItem with ID ${item.eventItemId} not found`);
      }

      const club = await this.clubRepository.findOne({
        where: { id: createResultDto.clubId },
      });

      if (!club) {
        throw new NotFoundException(`Club with ID ${createResultDto.clubId} not found`);
      }

      // Validate score is within maxScore
      if (item.score > eventItem.maxScore) {
        throw new Error(`Score ${item.score} exceeds maximum score ${eventItem.maxScore} for event item ${eventItem.name}`);
      }

      const resultItem = this.resultItemRepository.create({
        score: item.score,
        eventItem,
        club,
      });

      resultItems.push(await this.resultItemRepository.save(resultItem));
    }

    return resultItems;
  }

  async findAll() {
    return this.resultItemRepository.find({
      relations: ['eventItem', 'club', 'eventItem.event'],
    });
  }

  async findOne(id: string) {
    const resultItem = await this.resultItemRepository.findOne({
      where: { id },
      relations: ['eventItem', 'club', 'eventItem.event'],
    });

    if (!resultItem) {
      throw new NotFoundException(`ResultItem with ID ${id} not found`);
    }

    return resultItem;
  }

  async update(id: string, updateResultDto: UpdateResultDto) {
    const resultItem = await this.findOne(id);

    if (updateResultDto.items && updateResultDto.items.length > 0) {
      const item = updateResultDto.items[0]; // Only use first item for direct updates
      
      if (item.score !== undefined) {
        // Validate max score
        const eventItem = await this.eventItemRepository.findOne({
          where: { id: resultItem.eventItem.id },
        });
        
        if (item.score > eventItem.maxScore) {
          throw new Error(`Score ${item.score} exceeds maximum score ${eventItem.maxScore}`);
        }
        
        resultItem.score = item.score;
      }
    }

    return this.resultItemRepository.save(resultItem);
  }

  async remove(id: string) {
    const resultItem = await this.findOne(id);
    return this.resultItemRepository.remove(resultItem);
  }

  async deleteResultItemsByEventItem(eventItemId: string): Promise<void> {
    await this.resultItemRepository.delete({ eventItem: { id: eventItemId } });
  }

  async hasScoresForEventItem(eventItemId: string): Promise<boolean> {
    const count = await this.resultItemRepository.count({
      where: { eventItem: { id: eventItemId } },
    });
    return count > 0;
  }
}