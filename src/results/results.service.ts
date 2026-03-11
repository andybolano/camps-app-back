import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from './entities/result.entity';
import { ResultItem } from './entities/result-item.entity';
import { ResultMemberBasedItem } from './entities/result-member-based-item.entity';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { CreateBulkResultDto } from './dto/create-bulk-result.dto';
import { CampEventsService } from '../camp-events/camp-events.service';
import { CampRegistrationsService } from '../camp-registrations/camp-registrations.service';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Result)
    private resultsRepository: Repository<Result>,
    @InjectRepository(ResultItem)
    private resultItemsRepository: Repository<ResultItem>,
    @InjectRepository(ResultMemberBasedItem)
    private resultMemberBasedItemsRepository: Repository<ResultMemberBasedItem>,
    private campEventsService: CampEventsService,
    private campRegistrationsService: CampRegistrationsService,
  ) {}

  async create(createResultDto: CreateResultDto): Promise<Result> {
    const { campRegistrationId, campEventId, items, memberBasedItems, totalScore } = createResultDto;

    // Verify registration and camp event exist
    const campRegistration = await this.campRegistrationsService.findOne(campRegistrationId);
    const campEvent = await this.campEventsService.findOne(campEventId);

    // Check if result already exists for this registration and camp event
    const existingResult = await this.resultsRepository.findOne({
      where: {
        campRegistration: { id: campRegistrationId },
        campEvent: { id: campEventId },
      },
    });

    if (existingResult) {
      throw new BadRequestException(
        'A result already exists for this camp registration and camp event',
      );
    }

    // Create result
    const result = this.resultsRepository.create({
      campRegistration,
      campEvent,
      totalScore: totalScore || 0,
    });

    const savedResult = await this.resultsRepository.save(result);

    // Create items if provided
    if (items && items.length > 0) {
      const resultItems = items.map((itemDto) =>
        this.resultItemsRepository.create({
          result: savedResult,
          eventItem: { id: itemDto.eventItemId } as any,
          score: itemDto.score,
        }),
      );
      await this.resultItemsRepository.save(resultItems);
    }

    return savedResult;
  }

  async findAll(): Promise<Result[]> {
    return this.resultsRepository.find({
      relations: [
        'campRegistration',
        'campRegistration.clubCategory',
        'campRegistration.clubCategory.club',
        'campRegistration.clubCategory.category',
        'campEvent',
        'campEvent.eventTemplate',
        'items',
        'memberBasedItems',
      ],
    });
  }

  async findByCampEvent(campEventId: number): Promise<Result[]> {
    return this.resultsRepository.find({
      where: { campEvent: { id: campEventId } },
      relations: [
        'campRegistration',
        'campRegistration.clubCategory',
        'campRegistration.clubCategory.club',
        'campRegistration.clubCategory.category',
        'campEvent',
        'campEvent.eventTemplate',
        'items',
        'items.eventItem',
      ],
      order: {
        totalScore: 'DESC',
      },
    });
  }

  async findByCampRegistration(campRegistrationId: number): Promise<Result[]> {
    return this.resultsRepository.find({
      where: { campRegistration: { id: campRegistrationId } },
      relations: [
        'campRegistration',
        'campEvent',
        'campEvent.eventTemplate',
        'items',
        'items.eventItem',
        'memberBasedItems',
        'memberBasedItems.eventItem',
      ],
    });
  }

  async findOne(id: number): Promise<Result> {
    const result = await this.resultsRepository.findOne({
      where: { id },
      relations: [
        'campRegistration',
        'campRegistration.clubCategory',
        'campRegistration.clubCategory.club',
        'campRegistration.clubCategory.category',
        'campEvent',
        'campEvent.eventTemplate',
        'items',
        'items.eventItem',
        'memberBasedItems',
        'memberBasedItems.eventItem',
      ],
    });

    if (!result) {
      throw new NotFoundException(`Result with ID ${id} not found`);
    }

    return result;
  }

  async update(id: number, updateResultDto: UpdateResultDto): Promise<Result> {
    const result = await this.findOne(id);

    if (updateResultDto.totalScore !== undefined) {
      result.totalScore = updateResultDto.totalScore;
    }

    if (updateResultDto.items) {
      // Remove old items
      await this.resultItemsRepository.delete({ result: { id } });

      // Create new items
      result.items = updateResultDto.items.map(item =>
        this.resultItemsRepository.create({
          ...item,
          result,
        }),
      );
    }

    if (updateResultDto.memberBasedItems) {
      // Remove old member-based items
      await this.resultMemberBasedItemsRepository.delete({ result: { id } });

      // Create new member-based items
      result.memberBasedItems = updateResultDto.memberBasedItems.map(item =>
        this.resultMemberBasedItemsRepository.create({
          ...item,
          result,
        }),
      );
    }

    return this.resultsRepository.save(result);
  }

  async remove(id: number): Promise<void> {
    const result = await this.resultsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Result with ID ${id} not found`);
    }
  }

  async createBulk(createBulkResultDto: CreateBulkResultDto): Promise<Result[]> {
    const { campEventId, results } = createBulkResultDto;

    // Verify camp event exists
    const campEvent = await this.campEventsService.findOne(campEventId);

    const createdResults: Result[] = [];

    for (const resultDto of results) {
      // Verify camp registration exists
      const campRegistration = await this.campRegistrationsService.findOne(
        resultDto.campRegistrationId,
      );

      // Check if result already exists
      let existingResult = await this.resultsRepository.findOne({
        where: {
          campRegistration: { id: resultDto.campRegistrationId },
          campEvent: { id: campEventId },
        },
      });

      let savedResult: Result;

      if (existingResult) {
        // Update existing result
        existingResult.totalScore = resultDto.totalScore || 0;
        savedResult = await this.resultsRepository.save(existingResult);

        // Delete old items
        await this.resultItemsRepository.delete({ result: { id: savedResult.id } });
      } else {
        // Create new result
        const result = this.resultsRepository.create({
          campRegistration,
          campEvent,
          totalScore: resultDto.totalScore || 0,
        });
        savedResult = await this.resultsRepository.save(result);
      }

      // Create items if provided
      if (resultDto.items && resultDto.items.length > 0) {
        const items = resultDto.items.map((itemDto) =>
          this.resultItemsRepository.create({
            result: savedResult,
            eventItem: { id: itemDto.eventItemId } as any,
            score: itemDto.score,
          }),
        );
        await this.resultItemsRepository.save(items);
      }

      createdResults.push(savedResult);
    }

    return createdResults;
  }

  async hasScoresForEventItem(itemId: number): Promise<boolean> {
    const count = await this.resultItemsRepository.count({
      where: { eventItem: { id: itemId } },
    });
    return count > 0;
  }

  async deleteResultItemsByEventItem(eventItemId: number): Promise<void> {
    await this.resultItemsRepository.delete({
      eventItem: { id: eventItemId },
    });
  }

  async findByCamp(campId: number): Promise<Result[]> {
    return this.resultsRepository.find({
      where: { campRegistration: { camp: { id: campId } } },
      relations: [
        'campRegistration',
        'campRegistration.clubCategory',
        'campRegistration.clubCategory.club',
        'campRegistration.clubCategory.category',
        'campEvent',
        'campEvent.eventTemplate',
      ],
    });
  }

  async getClubRankingByCamp(campId: number): Promise<any> {
    // Get all camp events
    const campEvents = await this.campEventsService.findByCamp(campId);

    // Get all results for this camp
    const results = await this.resultsRepository
      .createQueryBuilder('result')
      .leftJoinAndSelect('result.campRegistration', 'campRegistration')
      .leftJoinAndSelect('campRegistration.clubCategory', 'clubCategory')
      .leftJoinAndSelect('clubCategory.club', 'club')
      .leftJoinAndSelect('clubCategory.category', 'category')
      .leftJoinAndSelect('result.campEvent', 'campEvent')
      .leftJoinAndSelect('campEvent.eventTemplate', 'eventTemplate')
      .where('campRegistration.campId = :campId', { campId })
      .getMany();

    // Group by club and collect event results
    const clubScores = new Map<number, {
      club: any;
      totalScore: number;
      category: any;
      eventScores: Map<number, number>;
    }>();

    for (const result of results) {
      const clubId = result.campRegistration.clubCategory.club.id;
      const club = result.campRegistration.clubCategory.club;
      const category = result.campRegistration.clubCategory.category;

      if (!clubScores.has(clubId)) {
        clubScores.set(clubId, {
          club,
          totalScore: 0,
          category,
          eventScores: new Map()
        });
      }

      const clubScore = clubScores.get(clubId);
      clubScore.totalScore += result.totalScore;

      // Store score by event ID
      clubScore.eventScores.set(result.campEvent.id, result.totalScore);
    }

    // Convert to array and sort by total score
    const ranking = Array.from(clubScores.values())
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((item, index) => ({
        rank: index + 1,
        club: item.club,
        category: item.category,
        totalScore: item.totalScore,
        eventResults: campEvents.map((campEvent) => ({
          event: {
            id: campEvent.id,
            name: campEvent.name,
            description: campEvent.description,
            type: campEvent.type,
            maxScore: campEvent.maxScore,
          },
          score: item.eventScores.get(campEvent.id) || 0,
        })),
      }));

    return ranking;
  }
}
