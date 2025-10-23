import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CampEvent } from './entities/camp-event.entity';
import { CampEventItem } from './entities/camp-event-item.entity';
import { CampEventMemberBasedItem } from './entities/camp-event-member-based-item.entity';
import { CreateCampEventDto } from './dto/create-camp-event.dto';
import { UpdateCampEventDto } from './dto/update-camp-event.dto';
import { CampsService } from '../camps/camps.service';
import { EventsService } from '../events/events.service';

@Injectable()
export class CampEventsService {
  constructor(
    @InjectRepository(CampEvent)
    private campEventsRepository: Repository<CampEvent>,
    @InjectRepository(CampEventItem)
    private campEventItemsRepository: Repository<CampEventItem>,
    @InjectRepository(CampEventMemberBasedItem)
    private campEventMemberBasedItemsRepository: Repository<CampEventMemberBasedItem>,
    private campsService: CampsService,
    private eventsService: EventsService,
  ) {}

  async create(createCampEventDto: CreateCampEventDto): Promise<CampEvent> {
    const { campId, eventTemplateId, ...campEventData } = createCampEventDto;

    // Verificar que existan el campamento y el evento plantilla
    const camp = await this.campsService.findOne(campId);
    const eventTemplate = await this.eventsService.findOne(eventTemplateId);

    // Crear el CampEvent
    const campEvent = this.campEventsRepository.create({
      ...campEventData,
      camp,
      eventTemplate,
      isActive: campEventData.isActive !== undefined ? campEventData.isActive : true,
    });

    await this.campEventsRepository.save(campEvent);

    // Copiar los items de la plantilla al CampEvent
    if (eventTemplate.items && eventTemplate.items.length > 0) {
      const campEventItems = eventTemplate.items.map((item) =>
        this.campEventItemsRepository.create({
          campEvent,
          eventItemTemplate: item,
          isActive: true,
        }),
      );
      await this.campEventItemsRepository.save(campEventItems);
    }

    // Copiar los member-based items de la plantilla
    if (eventTemplate.memberBasedItems && eventTemplate.memberBasedItems.length > 0) {
      const campEventMemberBasedItems = eventTemplate.memberBasedItems.map((item) =>
        this.campEventMemberBasedItemsRepository.create({
          campEvent,
          eventItemTemplate: item,
          isActive: true,
        }),
      );
      await this.campEventMemberBasedItemsRepository.save(campEventMemberBasedItems);
    }

    return this.findOne(campEvent.id);
  }

  async findAll(): Promise<CampEvent[]> {
    return this.campEventsRepository.find({
      relations: [
        'camp',
        'eventTemplate',
        'eventTemplate.category',
        'items',
        'items.eventItemTemplate',
        'memberBasedItems',
        'memberBasedItems.eventItemTemplate',
      ],
    });
  }

  async findByCamp(campId: number): Promise<CampEvent[]> {
    return this.campEventsRepository.find({
      where: { camp: { id: campId }, isActive: true },
      relations: [
        'eventTemplate',
        'eventTemplate.category',
        'items',
        'items.eventItemTemplate',
        'memberBasedItems',
        'memberBasedItems.eventItemTemplate',
      ],
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: number): Promise<CampEvent> {
    const campEvent = await this.campEventsRepository.findOne({
      where: { id },
      relations: [
        'camp',
        'eventTemplate',
        'eventTemplate.category',
        'eventTemplate.items',
        'eventTemplate.memberBasedItems',
        'items',
        'items.eventItemTemplate',
        'memberBasedItems',
        'memberBasedItems.eventItemTemplate',
      ],
    });

    if (!campEvent) {
      throw new NotFoundException(`CampEvent with ID ${id} not found`);
    }

    return campEvent;
  }

  async update(
    id: number,
    updateCampEventDto: UpdateCampEventDto,
  ): Promise<CampEvent> {
    const campEvent = await this.findOne(id);

    // Solo actualizar las personalizaciones
    Object.assign(campEvent, updateCampEventDto);

    return this.campEventsRepository.save(campEvent);
  }

  async remove(id: number): Promise<void> {
    const campEvent = await this.findOne(id);

    // Los items se eliminan en cascada
    const result = await this.campEventsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`CampEvent with ID ${id} not found`);
    }
  }

  // Método helper para obtener el nombre efectivo del evento
  getEffectiveName(campEvent: CampEvent): string {
    return campEvent.customName || campEvent.eventTemplate.name;
  }

  // Método helper para obtener la descripción efectiva
  getEffectiveDescription(campEvent: CampEvent): string {
    return campEvent.customDescription || campEvent.eventTemplate.description;
  }

  // Método helper para obtener el puntaje máximo efectivo
  getEffectiveMaxScore(campEvent: CampEvent): number {
    return campEvent.customMaxScore || campEvent.eventTemplate.maxScore;
  }
}
