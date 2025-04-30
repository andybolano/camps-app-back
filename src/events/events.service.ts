import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { EventItem } from './entities/event-item.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventItemDto } from './dto/create-event-item.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventItem)
    private readonly eventItemRepository: Repository<EventItem>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const event = this.eventRepository.create({
      ...createEventDto,
      items: createEventDto.items?.map((item) =>
        this.eventItemRepository.create(item),
      ),
    });

    return this.eventRepository.save(event);
  }

  findAll() {
    return this.eventRepository.find({
      relations: ['items'],
    });
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.findOne(id);

    if (updateEventDto.items) {
      // Delete existing items
      await this.eventItemRepository.delete({ event: { id } });

      // Create new items
      event.items = updateEventDto.items.map((item) =>
        this.eventItemRepository.create(item),
      );
    }

    Object.assign(event, updateEventDto);

    return this.eventRepository.save(event);
  }

  async remove(id: string) {
    const event = await this.findOne(id);
    return this.eventRepository.remove(event);
  }

  async addItem(eventId: string, createEventItemDto: CreateEventItemDto) {
    const event = await this.findOne(eventId);

    const item = this.eventItemRepository.create({
      ...createEventItemDto,
      event,
    });

    await this.eventItemRepository.save(item);

    return this.findOne(eventId);
  }

  async removeItem(eventId: string, itemId: string) {
    const event = await this.findOne(eventId);
    const item = event.items.find((i) => i.id === itemId);

    if (!item) {
      throw new Error('Item not found');
    }

    await this.eventItemRepository.remove(item);

    return this.findOne(eventId);
  }
}
