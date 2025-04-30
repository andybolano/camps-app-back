import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from './entities/result.entity';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { ResultItem } from './entities/result-item.entity';
import { Event } from '../events/entities/event.entity';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
    @InjectRepository(ResultItem)
    private readonly resultItemRepository: Repository<ResultItem>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(createResultDto: CreateResultDto) {
    const event = await this.eventRepository.findOne({
      where: { id: createResultDto.eventId },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const result = this.resultRepository.create({
      event,
      items: createResultDto.items.map((item) =>
        this.resultItemRepository.create(item),
      ),
    });

    result.totalScore = this.calculateTotalScore(result);

    return this.resultRepository.save(result);
  }

  findAll() {
    return this.resultRepository.find({
      relations: ['event', 'items'],
    });
  }

  async findOne(id: string) {
    const result = await this.resultRepository.findOne({
      where: { id },
      relations: ['event', 'items'],
    });

    if (!result) {
      throw new Error('Result not found');
    }

    return result;
  }

  async update(id: string, updateResultDto: UpdateResultDto) {
    const result = await this.findOne(id);

    if (updateResultDto.items) {
      result.items = updateResultDto.items.map((item) =>
        this.resultItemRepository.create(item),
      );
    }

    result.totalScore = this.calculateTotalScore(result);

    return this.resultRepository.save(result);
  }

  async remove(id: string) {
    const result = await this.findOne(id);
    return this.resultRepository.remove(result);
  }

  private calculateTotalScore(result: Result): number {
    return result.items.reduce((total, item) => total + item.score, 0);
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
