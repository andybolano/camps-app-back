import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { EventItem } from './entities/event-item.entity';
import { MemberBasedEventItem } from './entities/member-based-event-item.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CampsService } from '../camps/camps.service';
import { ResultsService } from '../results/results.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(EventItem)
    private eventItemsRepository: Repository<EventItem>,
    @InjectRepository(MemberBasedEventItem)
    private memberBasedEventItemsRepository: Repository<MemberBasedEventItem>,
    private campsService: CampsService,
    @Inject(forwardRef(() => ResultsService))
    private resultsService: ResultsService,
  ) {}

  // Método para verificar si un evento tiene calificaciones
  async eventHasScores(eventId: number): Promise<boolean> {
    const results = await this.resultsService.findByEvent(eventId);
    return results.length > 0;
  }

  // Método para verificar si un ítem de evento tiene calificaciones
  async eventItemHasScores(itemId: number): Promise<boolean> {
    try {
      // Usar el servicio de resultados para verificar si hay calificaciones para este ítem
      return await this.resultsService.hasScoresForEventItem(itemId);
    } catch (error) {
      console.error(`Error al verificar scores para el item ${itemId}:`, error);
      return false; // En caso de error, asumimos que no hay calificaciones
    }
  }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const { campId, items, memberBasedItems, ...eventData } = createEventDto;

    // Find the referenced camp
    const camp = await this.campsService.findOne(campId);

    // Create the event
    const event = this.eventsRepository.create({
      ...eventData,
      camp,
    });

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

    return event;
  }

  async findAll(): Promise<Event[]> {
    return this.eventsRepository.find({
      relations: ['camp', 'items', 'memberBasedItems'],
    });
  }

  async findByCamp(campId: number): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { camp: { id: campId } },
      relations: ['camp', 'items', 'memberBasedItems'],
    });
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['camp', 'items', 'memberBasedItems', 'results'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

    // Verificar si el evento tiene calificaciones
    const hasScores = await this.eventHasScores(id);

    // Updated general event properties
    if (updateEventDto.name !== undefined) {
      event.name = updateEventDto.name;
    }
    if (updateEventDto.description !== undefined) {
      event.description = updateEventDto.description;
    }
    if (updateEventDto.type !== undefined) {
      event.type = updateEventDto.type;
    }

    // Handle regular items update if provided
    if (updateEventDto.items) {
      // Instead of deleting all items, find which ones we need to keep
      // Get existing event items with their IDs and verify they're properly loaded
      const existingItems = await this.eventItemsRepository.find({
        where: { event: { id } },
        relations: ['event'],
      });

      // Log found items for debugging
      console.log(
        `Found ${existingItems.length} existing items for event ${id}`,
      );

      // Create a map of items from the DTO with their IDs (if they have one)
      const updatedItemsMap = new Map();
      updateEventDto.items.forEach((item) => {
        if (item.id) {
          updatedItemsMap.set(item.id, item);
        }
      });

      // Items to delete (existing items not in the update)
      const itemsToDelete = existingItems.filter(
        (item) => !updatedItemsMap.has(item.id),
      );

      // Items to update (existing items also in the update)
      const itemsToUpdate = existingItems.filter((item) =>
        updatedItemsMap.has(item.id),
      );

      // Items to create (items in update without IDs or with IDs not in existing items)
      const itemsToCreate = updateEventDto.items.filter(
        (item) =>
          !item.id ||
          !existingItems.some((existing) => existing.id === item.id),
      );

      try {
        // Si el evento tiene calificaciones, verificar cada ítem
        if (hasScores) {
          // No se pueden eliminar ítems si el evento ya tiene calificaciones
          if (itemsToDelete.length > 0) {
            throw new BadRequestException(
              'No se pueden actualizar los ítems de calificación porque este evento ya tiene calificaciones registradas.',
            );
          }

          // Verificar si se intentan modificar ítems
          for (const item of itemsToUpdate) {
            const updateData = updatedItemsMap.get(item.id);
            const itemHasScores = await this.eventItemHasScores(item.id);

            if (itemHasScores) {
              // Verificar si se está intentando cambiar el porcentaje o nombre
              if (
                (updateData.name && updateData.name !== item.name) ||
                (updateData.percentage !== undefined &&
                  updateData.percentage !== item.percentage)
              ) {
                throw new BadRequestException(
                  `No se puede modificar el ítem "${item.name}" porque ya tiene calificaciones asociadas.`,
                );
              }
            }
          }

          // Se pueden agregar nuevos ítems aunque haya calificaciones
        } else {
          // Si no hay calificaciones, proceder normalmente con eliminaciones
          if (itemsToDelete.length > 0) {
            console.log(
              `Attempting to delete ${itemsToDelete.length} items that are no longer needed`,
            );

            // Obtener los IDs de los items a eliminar
            const idsToDelete = itemsToDelete.map((item) => item.id);
            console.log(`Items to delete: ${idsToDelete.join(', ')}`);

            // Primero eliminamos todas las calificaciones (ResultItems) asociadas a estos EventItems
            for (const item of itemsToDelete) {
              try {
                // Eliminar ResultItems asociados a este EventItem
                await this.resultsService.deleteResultItemsByEventItem(item.id);
                console.log(
                  `ResultItems del item ${item.id} eliminados correctamente`,
                );
              } catch (error) {
                console.error(
                  `Error al eliminar ResultItems del item ${item.id}: ${error.message}`,
                );
              }
            }

            // Ahora podemos eliminar los EventItems sin problemas de restricciones foreign key
            try {
              const deleteResult =
                await this.eventItemsRepository.delete(idsToDelete);
              console.log(
                `Successfully deleted ${deleteResult.affected} event items`,
              );
            } catch (error) {
              console.error(`Error al eliminar EventItems: ${error.message}`);
            }
          }
        }

        // Update existing items
        for (const item of itemsToUpdate) {
          const updateData = updatedItemsMap.get(item.id);
          if (updateData) {
            // Para evitar duplicados durante la actualización, solo copiamos propiedades específicas
            if (updateData.name) item.name = updateData.name;
            if (updateData.percentage !== undefined)
              item.percentage = updateData.percentage;
            // Añade aquí otras propiedades que puedan necesitar actualizarse
          }
        }

        if (itemsToUpdate.length > 0) {
          await this.eventItemsRepository.save(itemsToUpdate);
        }

        // Create new items
        if (itemsToCreate.length > 0) {
          const newItems = itemsToCreate.map((item) =>
            this.eventItemsRepository.create({
              ...item,
              event,
            }),
          );

          const savedNewItems = await this.eventItemsRepository.save(newItems);

          // Update the event's items array - ensure no duplicates by combining unique items
          const allEventItems = [...itemsToUpdate, ...savedNewItems];

          // We'll use a Map to deduplicate items by ID
          const uniqueItemsMap = new Map();
          for (const item of allEventItems) {
            uniqueItemsMap.set(item.id, item);
          }

          // Convert the map values back to an array
          event.items = Array.from(uniqueItemsMap.values());
        } else {
          event.items = [...itemsToUpdate];
        }
      } catch (error) {
        if (error instanceof BadRequestException) {
          throw error; // Re-lanzar errores de validación
        }
        throw new Error(`Failed to update event items: ${error.message}`);
      }
    }

    // Handle member-based items update if provided
    if (updateEventDto.memberBasedItems) {
      // Get existing member-based event items
      const existingMemberBasedItems =
        await this.memberBasedEventItemsRepository.find({
          where: { event: { id } },
          relations: ['event'],
        });

      // Create a map of items from the DTO with their IDs (if they have one)
      const updatedMemberBasedItemsMap = new Map();
      updateEventDto.memberBasedItems.forEach((item) => {
        if (item.id) {
          updatedMemberBasedItemsMap.set(item.id, item);
        }
      });

      // Items to delete (existing items not in the update)
      const memberBasedItemsToDelete = existingMemberBasedItems.filter(
        (item) => !updatedMemberBasedItemsMap.has(item.id),
      );

      // Items to update (existing items also in the update)
      const memberBasedItemsToUpdate = existingMemberBasedItems.filter((item) =>
        updatedMemberBasedItemsMap.has(item.id),
      );

      // Items to create (items in update without IDs or with IDs not in existing items)
      const memberBasedItemsToCreate = updateEventDto.memberBasedItems.filter(
        (item) =>
          !item.id ||
          !existingMemberBasedItems.some((existing) => existing.id === item.id),
      );

      try {
        // Check similar validation as with regular items
        if (hasScores) {
          // Don't delete items if event has scores
          if (memberBasedItemsToDelete.length > 0) {
            throw new BadRequestException(
              'No se pueden actualizar los ítems de calificación porque este evento ya tiene calificaciones registradas.',
            );
          }

          // Check if we're trying to modify items with scores
          for (const item of memberBasedItemsToUpdate) {
            const updateData = updatedMemberBasedItemsMap.get(item.id);
            const itemHasScores = await this.eventItemHasScores(item.id);

            if (itemHasScores) {
              // Check if name or percentage is changing
              if (
                (updateData.name && updateData.name !== item.name) ||
                (updateData.percentage !== undefined &&
                  updateData.percentage !== item.percentage)
              ) {
                throw new BadRequestException(
                  `No se puede modificar el ítem "${item.name}" porque ya tiene calificaciones asociadas.`,
                );
              }
            }
          }
        } else {
          // If no scores, proceed with deletions
          if (memberBasedItemsToDelete.length > 0) {
            const idsToDelete = memberBasedItemsToDelete.map((item) => item.id);
            // Delete ResultItems if needed
            for (const item of memberBasedItemsToDelete) {
              await this.resultsService.deleteResultItemsByEventItem(item.id);
            }

            // Delete the items
            await this.memberBasedEventItemsRepository.delete(idsToDelete);
          }
        }

        // Update existing items
        for (const item of memberBasedItemsToUpdate) {
          const updateData = updatedMemberBasedItemsMap.get(item.id);
          if (updateData) {
            // Copy specific properties to avoid duplication issues
            if (updateData.name) item.name = updateData.name;
            if (updateData.percentage !== undefined)
              item.percentage = updateData.percentage;
            if (updateData.applicableCharacteristics)
              item.applicableCharacteristics =
                updateData.applicableCharacteristics;
            if (updateData.calculationType)
              item.calculationType = updateData.calculationType;
            if (updateData.isRequired !== undefined)
              item.isRequired = updateData.isRequired;
          }
        }

        if (memberBasedItemsToUpdate.length > 0) {
          await this.memberBasedEventItemsRepository.save(
            memberBasedItemsToUpdate,
          );
        }

        // Create new items
        if (memberBasedItemsToCreate.length > 0) {
          try {
            const newItems = memberBasedItemsToCreate.map((item) => {
              return this.memberBasedEventItemsRepository.create({
                name: item.name,
                percentage: item.percentage,
                applicableCharacteristics: item.applicableCharacteristics,
                calculationType: item.calculationType || 'PROPORTION',
                isRequired: item.isRequired || false,
                event: event,
              });
            });

            const savedNewItems =
              await this.memberBasedEventItemsRepository.save(newItems);

            // Update the event's memberBasedItems array - ensure no duplicates by combining unique items
            const allMemberBasedItems = [
              ...memberBasedItemsToUpdate,
              ...savedNewItems,
            ];

            // Use a Map to deduplicate items by ID
            const uniqueMemberBasedItemsMap = new Map();
            for (const item of allMemberBasedItems) {
              uniqueMemberBasedItemsMap.set(item.id, item);
            }

            // Convert the map values back to an array
            event.memberBasedItems = Array.from(
              uniqueMemberBasedItemsMap.values(),
            );
          } catch (error) {
            console.error('Error creating new member-based items:', error);
            throw new Error('Failed to create new member-based event items');
          }
        } else if (memberBasedItemsToUpdate.length > 0) {
          // If we only updated items but didn't create new ones, update the array
          event.memberBasedItems = [...memberBasedItemsToUpdate];
        }
      } catch (error) {
        if (error instanceof BadRequestException) {
          throw error;
        } else {
          console.error('Error updating event member-based items:', error);
          throw new Error('Error al actualizar los ítems del evento');
        }
      }
    }

    // Save the updated event
    await this.eventsRepository.save(event);

    // Return the updated event with all relations
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    // Verificar si el evento tiene calificaciones
    const hasScores = await this.eventHasScores(id);
    if (hasScores) {
      throw new BadRequestException(
        'No se puede eliminar el evento porque ya tiene calificaciones registradas.',
      );
    }

    const result = await this.eventsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  }
}
