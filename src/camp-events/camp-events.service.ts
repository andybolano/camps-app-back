import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CampEvent } from './entities/camp-event.entity';
import { CampEventItem } from './entities/camp-event-item.entity';
import { CampEventMemberBasedItem } from './entities/camp-event-member-based-item.entity';
import { CreateCampEventDto } from './dto/create-camp-event.dto';
import { UpdateCampEventDto } from './dto/update-camp-event.dto';
import { CampsService } from '../camps/camps.service';
import { EventsService } from '../events/events.service';
import { ResultsService } from '../results/results.service';

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
    @Inject(forwardRef(() => ResultsService))
    private resultsService: ResultsService,
  ) {}

  async create(createCampEventDto: CreateCampEventDto): Promise<any> {
    const {
      campId,
      name,
      description,
      maxScore,
      isActive,
      items,
      memberBasedItems,
    } = createCampEventDto;

    // Verificar que exista el campamento
    const camp = await this.campsService.findOne(campId);

    // Crear el CampEvent
    const campEvent = this.campEventsRepository.create({
      customName: name,
      customDescription: description,
      customMaxScore: maxScore,
      camp,
      eventTemplate: null, // Ya no usamos plantillas en la relación
      isActive: isActive !== undefined ? isActive : true,
    });

    await this.campEventsRepository.save(campEvent);

    // Crear items si fueron enviados
    if (items && items.length > 0) {
      const eventItems = items.map((item) =>
        this.campEventItemsRepository.create({
          campEvent,
          customName: item.name,
          eventItemTemplate: null,
          isActive: true,
        }),
      );
      await this.campEventItemsRepository.save(eventItems);
    }

    // Crear member-based items si fueron enviados
    if (memberBasedItems && memberBasedItems.length > 0) {
      const eventMemberBasedItems = memberBasedItems.map((item) =>
        this.campEventMemberBasedItemsRepository.create({
          campEvent,
          customName: item.name,
          applicableCharacteristics: item.applicableCharacteristics,
          calculationType: item.calculationType,
          isRequired: item.isRequired ?? false,
          eventItemTemplate: null,
          isActive: true,
        }),
      );
      await this.campEventMemberBasedItemsRepository.save(eventMemberBasedItems);
    }

    const saved = await this.findOneInternal(campEvent.id);
    return this.transformResponse(saved);
  }

  async findAll(): Promise<any[]> {
    const events = await this.campEventsRepository.find({
      relations: [
        'camp',
        'items',
        'items.eventItemTemplate',
        'memberBasedItems',
        'memberBasedItems.eventItemTemplate',
      ],
    });
    return this.transformResponseArray(events);
  }

  async findByCamp(campId: number): Promise<any[]> {
    const events = await this.campEventsRepository.find({
      where: { camp: { id: campId }, isActive: true },
      relations: [
        'items',
        'items.eventItemTemplate',
        'memberBasedItems',
        'memberBasedItems.eventItemTemplate',
      ],
      order: { createdAt: 'ASC' },
    });
    return this.transformResponseArray(events);
  }

  private async findOneInternal(id: number): Promise<CampEvent> {
    const campEvent = await this.campEventsRepository.findOne({
      where: { id },
      relations: [
        'camp',
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

  async findOne(id: number): Promise<any> {
    const campEvent = await this.findOneInternal(id);
    return this.transformResponse(campEvent);
  }

  async update(
    id: number,
    updateCampEventDto: UpdateCampEventDto,
  ): Promise<any> {
    const campEvent = await this.findOneInternal(id);

    // Actualizar los campos básicos
    if (updateCampEventDto.name !== undefined) {
      campEvent.customName = updateCampEventDto.name;
    }
    if (updateCampEventDto.description !== undefined) {
      campEvent.customDescription = updateCampEventDto.description;
    }
    if (updateCampEventDto.maxScore !== undefined) {
      campEvent.customMaxScore = updateCampEventDto.maxScore;
    }
    if (updateCampEventDto.isActive !== undefined) {
      campEvent.isActive = updateCampEventDto.isActive;
    }

    await this.campEventsRepository.save(campEvent);

    // Actualizar items si se proporcionan
    if (updateCampEventDto.items !== undefined) {
      // Eliminar items existentes
      await this.campEventItemsRepository.delete({ campEvent: { id } });

      // Crear nuevos items
      if (updateCampEventDto.items.length > 0) {
        const eventItems = updateCampEventDto.items.map((item) =>
          this.campEventItemsRepository.create({
            campEvent,
            customName: item.name,
            eventItemTemplate: null,
            isActive: true,
          }),
        );
        await this.campEventItemsRepository.save(eventItems);
      }
    }

    // Actualizar member-based items si se proporcionan
    if (updateCampEventDto.memberBasedItems !== undefined) {
      // Eliminar member-based items existentes
      await this.campEventMemberBasedItemsRepository.delete({
        campEvent: { id },
      });

      // Crear nuevos member-based items
      if (updateCampEventDto.memberBasedItems.length > 0) {
        const eventMemberBasedItems = updateCampEventDto.memberBasedItems.map(
          (item) =>
            this.campEventMemberBasedItemsRepository.create({
              campEvent,
              customName: item.name,
              applicableCharacteristics: item.applicableCharacteristics,
              calculationType: item.calculationType,
              isRequired: item.isRequired ?? false,
              eventItemTemplate: null,
              isActive: true,
            }),
        );
        await this.campEventMemberBasedItemsRepository.save(
          eventMemberBasedItems,
        );
      }
    }

    const updated = await this.findOneInternal(id);
    return this.transformResponse(updated);
  }

  async remove(id: number): Promise<void> {
    await this.findOneInternal(id); // Validar que existe

    // Los items se eliminan en cascada
    const result = await this.campEventsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`CampEvent with ID ${id} not found`);
    }
  }

  // Método helper para transformar la respuesta y eliminar eventTemplate
  private transformResponse(campEvent: CampEvent): any {
    const { eventTemplate, customName, customDescription, customMaxScore, items, memberBasedItems, ...rest } = campEvent as any;

    // Transform items
    const transformedItems = items?.map((item: any) => {
      const { eventItemTemplate, customName: itemName, ...itemRest } = item;
      return {
        ...itemRest,
        name: itemName,
      };
    });

    // Transform memberBasedItems
    const transformedMemberBasedItems = memberBasedItems?.map((item: any) => {
      const { eventItemTemplate, customName: itemName, ...itemRest } = item;
      return {
        ...itemRest,
        name: itemName,
      };
    });

    return {
      ...rest,
      name: customName,
      description: customDescription,
      maxScore: customMaxScore,
      type: eventTemplate?.type || 'REGULAR',
      items: transformedItems,
      memberBasedItems: transformedMemberBasedItems,
    };
  }

  // Transformar array de eventos
  private transformResponseArray(campEvents: CampEvent[]): any[] {
    return campEvents.map((event) => this.transformResponse(event));
  }

  async getResultsByEvent(eventId: number): Promise<any[]> {
    // Verificar que el evento existe
    await this.findOneInternal(eventId);

    // Obtener resultados usando el servicio de results
    const results = await this.resultsService.findByCampEvent(eventId);

    // Transformar la respuesta al formato esperado
    return results.map((result, index) => ({
      id: result.id,
      eventId: result.campEvent.id,
      clubId: result.campRegistration.clubCategory.club.id,
      totalScore: result.totalScore,
      rank: index + 1, // El índice + 1 es el ranking (ya vienen ordenados por score DESC)
      event: {
        id: result.campEvent.id,
        name: result.campEvent.customName,
        description: result.campEvent.customDescription,
        type: result.campEvent.eventTemplate?.type || 'REGULAR',
        maxScore: result.campEvent.customMaxScore,
      },
      club: {
        id: result.campRegistration.clubCategory.club.id,
        name: result.campRegistration.clubCategory.club.name,
        city: result.campRegistration.clubCategory.club.city,
        shieldUrl: result.campRegistration.clubCategory.club.shieldUrl,
      },
      items: result.items.map((item) => ({
        id: item.id,
        score: item.score,
        eventItem: {
          id: item.eventItem.id,
          name: item.eventItem.customName,
        },
      })),
    }));
  }
}
