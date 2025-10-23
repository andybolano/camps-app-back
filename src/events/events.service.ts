import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { EventItem } from './entities/event-item.entity';
import { MemberBasedEventItem } from './entities/member-based-event-item.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(EventItem)
    private eventItemsRepository: Repository<EventItem>,
    @InjectRepository(MemberBasedEventItem)
    private memberBasedEventItemsRepository: Repository<MemberBasedEventItem>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const { categoryId, items, memberBasedItems, ...eventData } = createEventDto;

    const event = this.eventsRepository.create(eventData);

    // Asignar categoría si se proporciona
    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
      if (category) {
        event.category = category;
      }
    }

    // Save the event first to get an ID
    await this.eventsRepository.save(event);

    // Create and save event items if they exist
    if (items && items.length > 0) {
      const eventItems = items.map((item) =>
        this.eventItemsRepository.create({
          ...item,
          event,
        }),
      );
      event.items = await this.eventItemsRepository.save(eventItems);
    }

    // Create and save member-based event items if they exist
    if (memberBasedItems && memberBasedItems.length > 0) {
      const memberBasedEventItems = memberBasedItems.map((item) =>
        this.memberBasedEventItemsRepository.create({
          ...item,
          event,
        }),
      );
      event.memberBasedItems = await this.memberBasedEventItemsRepository.save(
        memberBasedEventItems,
      );
    }

    return this.findOne(event.id);
  }

  async findAll(): Promise<Event[]> {
    return this.eventsRepository.find({
      relations: ['category', 'items', 'memberBasedItems'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCategory(categoryId: number): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { category: { id: categoryId } },
      relations: ['category', 'items', 'memberBasedItems'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['category', 'items', 'memberBasedItems'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

    const { categoryId, items, memberBasedItems, ...eventData } = updateEventDto;

    Object.assign(event, eventData);

    // Actualizar categoría si se proporciona
    if (categoryId !== undefined) {
      if (categoryId === null) {
        event.category = null;
      } else {
        const category = await this.categoryRepository.findOne({
          where: { id: categoryId },
        });
        if (category) {
          event.category = category;
        }
      }
    }

    // Update items if provided
    if (items) {
      // Delete existing items
      await this.eventItemsRepository.delete({ event: { id } });

      // Create new items
      if (items.length > 0) {
        const eventItems = items.map((item) =>
          this.eventItemsRepository.create({
            ...item,
            event,
          }),
        );
        event.items = await this.eventItemsRepository.save(eventItems);
      }
    }

    // Update member-based items if provided
    if (memberBasedItems) {
      // Delete existing member-based items
      await this.memberBasedEventItemsRepository.delete({ event: { id } });

      // Create new member-based items
      if (memberBasedItems.length > 0) {
        const memberBasedEventItems = memberBasedItems.map((item) =>
          this.memberBasedEventItemsRepository.create({
            ...item,
            event,
          }),
        );
        event.memberBasedItems = await this.memberBasedEventItemsRepository.save(
          memberBasedEventItems,
        );
      }
    }

    return this.eventsRepository.save(event);
  }

  async remove(id: number): Promise<void> {
    const event = await this.findOne(id);

    // Los items se eliminan en cascada
    const result = await this.eventsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  }
}
