import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from './entities/result.entity';
import { ResultItem } from './entities/result-item.entity';
import { ResultMemberBasedItem } from './entities/result-member-based-item.entity';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { ClubsService } from '../clubs/clubs.service';
import { EventsService } from '../events/events.service';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Result)
    private resultsRepository: Repository<Result>,
    @InjectRepository(ResultItem)
    private resultItemsRepository: Repository<ResultItem>,
    @InjectRepository(ResultMemberBasedItem)
    private resultMemberBasedItemsRepository: Repository<ResultMemberBasedItem>,
    private clubsService: ClubsService,
    @Inject(forwardRef(() => EventsService))
    private eventsService: EventsService,
  ) {}

  async create(createResultDto: CreateResultDto): Promise<Result> {
    const { clubId, eventId } = createResultDto;
    // Manejar tanto 'items' (del DTO) como 'scores' (del cliente)
    const items = createResultDto.items || (createResultDto as any).scores;
    const memberBasedItems =
      createResultDto.memberBasedItems ||
      (createResultDto as any).memberBasedScores;

    // Verificar que al menos uno de los arrays (items o memberBasedItems) esté presente y no vacío
    const hasItems = items && Array.isArray(items) && items.length > 0;
    const hasMemberBasedItems =
      memberBasedItems &&
      Array.isArray(memberBasedItems) &&
      memberBasedItems.length > 0;

    if (!hasItems && !hasMemberBasedItems) {
      throw new BadRequestException(
        'Either items/scores array or memberBasedItems/memberBasedScores array is required and must not be empty',
      );
    }

    // Find the referenced club and event
    const club = await this.clubsService.findOne(clubId);
    const event = await this.eventsService.findOne(eventId);

    // Check if result already exists for this club and event
    const existingResult = await this.resultsRepository.findOne({
      where: {
        club: { id: clubId },
        event: { id: eventId },
      },
    });

    if (existingResult) {
      throw new BadRequestException(
        'A result already exists for this club and event',
      );
    }

    // Create the result
    const result = this.resultsRepository.create({
      club,
      event,
    });

    // Save the result first to get an ID
    await this.resultsRepository.save(result);

    // Map event items and calculate total score
    let totalScore = 0;

    // Process regular items if they exist
    if (items && items.length > 0) {
      const resultItems = [];

      for (const item of items) {
        // Find the event item
        const eventItem =
          event.items.find((ei) => ei.id === item.eventItemId) ||
          event.items.find((ei) => String(ei.id) === String(item.eventItemId));

        if (!eventItem) {
          throw new NotFoundException(
            `Event item with ID ${item.eventItemId} not found in event ${event.id} (${event.name})`,
          );
        }

        // Create result item
        const resultItem = this.resultItemsRepository.create({
          score: item.score,
          eventItem,
          result,
        });

        resultItems.push(resultItem);

        // Calculate weighted score
        totalScore += (item.score * eventItem.percentage) / 100;
      }

      // Save result items
      result.items = await this.resultItemsRepository.save(resultItems);
    }

    // Process member-based items if they exist
    if (memberBasedItems && memberBasedItems.length > 0) {
      const resultMemberBasedItems = [];

      for (const item of memberBasedItems) {
        // Find the member-based event item
        const eventItem =
          event.memberBasedItems.find((ei) => ei.id === item.eventItemId) ||
          event.memberBasedItems.find(
            (ei) => String(ei.id) === String(item.eventItemId),
          );

        if (!eventItem) {
          throw new NotFoundException(
            `Member-based event item with ID ${item.eventItemId} not found in event ${event.id} (${event.name})`,
          );
        }

        // Calculate score based on match count and total with characteristic
        const proportion =
          item.totalWithCharacteristic > 0
            ? item.matchCount / item.totalWithCharacteristic
            : 0;
        const score = proportion * 10; // Scale to 0-10

        // Create result item
        const resultMemberBasedItem =
          this.resultMemberBasedItemsRepository.create({
            score,
            matchCount: item.matchCount,
            totalWithCharacteristic: item.totalWithCharacteristic,
            eventItem,
            result,
          });

        resultMemberBasedItems.push(resultMemberBasedItem);

        // Calculate weighted score
        totalScore += (score * eventItem.percentage) / 100;
      }

      // Save result member-based items
      result.memberBasedItems =
        await this.resultMemberBasedItemsRepository.save(
          resultMemberBasedItems,
        );
    }

    // Update total score
    if (createResultDto.totalScore !== undefined) {
      // Usar el totalScore proporcionado por el frontend
      result.totalScore = parseFloat(createResultDto.totalScore.toFixed(2));
    } else {
      // Calcularlo si no se proporciona
      result.totalScore = parseFloat(totalScore.toFixed(2));
    }
    await this.resultsRepository.save(result);

    return result;
  }

  async findAll(): Promise<Result[]> {
    return this.resultsRepository.find({
      relations: [
        'club',
        'event',
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
        'club',
        'event',
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

  async findByClub(clubId: number): Promise<Result[]> {
    return this.resultsRepository.find({
      where: { club: { id: clubId } },
      relations: [
        'club',
        'event',
        'items',
        'items.eventItem',
        'memberBasedItems',
        'memberBasedItems.eventItem',
      ],
    });
  }

  async findByEvent(eventId: number): Promise<Result[]> {
    return this.resultsRepository.find({
      where: { event: { id: eventId } },
      relations: [
        'club',
        'event',
        'items',
        'items.eventItem',
        'memberBasedItems',
        'memberBasedItems.eventItem',
      ],
      order: { totalScore: 'DESC' },
    });
  }

  async findByEventAndClub(eventId: number, clubId: number): Promise<Result[]> {
    console.log(
      `[DEBUG] Buscando resultados para evento=${eventId} y club=${clubId}`,
    );

    return this.resultsRepository.find({
      where: {
        event: { id: eventId },
        club: { id: clubId },
      },
      relations: [
        'club',
        'event',
        'items',
        'items.eventItem',
        'memberBasedItems',
        'memberBasedItems.eventItem',
      ],
    });
  }

  async findByCamp(campId: number): Promise<Result[]> {
    return this.resultsRepository.find({
      where: { event: { camp: { id: campId } } },
      relations: [
        'club',
        'event',
        'items',
        'items.eventItem',
        'memberBasedItems',
        'memberBasedItems.eventItem',
      ],
    });
  }

  async getClubRankingByCamp(campId: number): Promise<any[]> {
    // Get all results for the camp
    const results = await this.findByCamp(campId);

    // Group results by club
    const clubResults = {};

    results.forEach((result) => {
      const clubId = result.club.id;

      if (!clubResults[clubId]) {
        clubResults[clubId] = {
          club: result.club,
          totalScore: 0,
          eventResults: [],
        };
      }

      clubResults[clubId].totalScore += result.totalScore;
      clubResults[clubId].eventResults.push({
        event: result.event,
        score: result.totalScore,
      });
    });

    // Convert to array and sort by total score
    return Object.values(clubResults)
      .sort((a: any, b: any) => b.totalScore - a.totalScore)
      .map((item: any, index: number) => ({
        rank: index + 1,
        ...item,
        totalScore: parseFloat(item.totalScore.toFixed(2)),
      }));
  }

  async update(id: number, updateResultDto: UpdateResultDto): Promise<Result> {
    const result = await this.findOne(id);

    // Obtener IDs para validación
    const existingEventId = result.event.id;
    const requestedEventId = updateResultDto.eventId || existingEventId;

    console.log(
      `[DEBUG] Actualizando resultado ID=${id}, existingEventId=${existingEventId}, requestedEventId=${requestedEventId}`,
    );

    // Validar si se está intentando actualizar un resultado para un evento diferente
    if (
      updateResultDto.eventId &&
      updateResultDto.eventId !== existingEventId
    ) {
      console.log(
        `[WARNING] Se está intentando cambiar el evento del resultado de ${existingEventId} a ${updateResultDto.eventId}`,
      );
    }

    // Handle items update if provided
    const items = updateResultDto.items || (updateResultDto as any).scores;
    if (items && Array.isArray(items) && items.length > 0) {
      // Delete existing result items
      await this.resultItemsRepository.delete({ result: { id } });

      // Get the event for calculating scores - use the requested or existing event ID
      const event = await this.eventsService.findOne(requestedEventId);

      console.log(
        `[DEBUG] Evento para cálculo de puntuaciones: ID=${event.id}, Nombre=${event.name}`,
      );
      console.log(
        `[DEBUG] Items del evento:`,
        event.items.map((i) => ({ id: i.id, name: i.name })),
      );
      console.log(
        `[DEBUG] Items enviados para actualizar:`,
        items.map((i) => ({ eventItemId: i.eventItemId, score: i.score })),
      );

      // Create new result items and calculate total score
      let totalScore = 0;
      const resultItems = [];

      for (const item of items) {
        // Find the event item
        console.log(
          `[DEBUG] Buscando item con ID ${item.eventItemId} en evento ${event.id} (${event.name})`,
        );
        console.log(
          `[DEBUG] Items disponibles en el evento:`,
          event.items.map((i) => ({ id: i.id, name: i.name })),
        );

        const eventItem = event.items.find((ei) => ei.id === item.eventItemId);
        if (!eventItem) {
          // Intento alternativo: si los IDs son string vs number
          const eventItemAlt = event.items.find(
            (ei) => String(ei.id) === String(item.eventItemId),
          );
          if (eventItemAlt) {
            console.log(
              `[DEBUG] Item encontrado usando comparación de strings: ${eventItemAlt.id} vs ${item.eventItemId}`,
            );
            // Crear result item con el item alternativo encontrado
            const resultItem = this.resultItemsRepository.create({
              score: item.score,
              eventItem: eventItemAlt,
              result,
            });

            resultItems.push(resultItem);
            // Calculate weighted score
            totalScore += (item.score * eventItemAlt.percentage) / 100;
            continue; // Continuar con el siguiente item
          }

          throw new NotFoundException(
            `Event item with ID ${item.eventItemId} not found in event ${event.id} (${event.name})`,
          );
        }

        // Create result item
        const resultItem = this.resultItemsRepository.create({
          score: item.score,
          eventItem,
          result,
        });

        resultItems.push(resultItem);

        // Calculate weighted score
        totalScore += (item.score * eventItem.percentage) / 100;
      }

      // Save result items
      result.items = await this.resultItemsRepository.save(resultItems);

      // Update total score
      if (updateResultDto.totalScore !== undefined) {
        // Usar el totalScore proporcionado por el frontend
        result.totalScore = parseFloat(updateResultDto.totalScore.toFixed(2));
      } else {
        // Calcularlo si no se proporciona
        result.totalScore = parseFloat(totalScore.toFixed(2));
      }
    }

    // Handle club update if clubId is provided
    if (updateResultDto.clubId) {
      const club = await this.clubsService.findOne(updateResultDto.clubId);
      result.club = club;
    }

    // Handle event update if eventId is provided
    if (updateResultDto.eventId) {
      const event = await this.eventsService.findOne(updateResultDto.eventId);
      result.event = event;
    }

    return this.resultsRepository.save(result);
  }

  async remove(id: number): Promise<void> {
    const result = await this.resultsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Result with ID ${id} not found`);
    }
  }

  /**
   * Elimina todos los ResultItems asociados a un EventItem específico
   * @param eventItemId ID del EventItem cuyos ResultItems se eliminarán
   */
  async deleteResultItemsByEventItem(eventItemId: number): Promise<void> {
    console.log(
      `Eliminando ResultItems asociados al EventItem con ID ${eventItemId}`,
    );

    // Buscar primero los ResultItems que tienen referencia al EventItem
    const resultItems = await this.resultItemsRepository.find({
      where: { eventItem: { id: eventItemId } },
      relations: ['result'],
    });

    console.log(
      `Se encontraron ${resultItems.length} ResultItems asociados al EventItem ${eventItemId}`,
    );

    if (resultItems.length === 0) {
      return;
    }

    // Agrupar los ResultItems por Result para actualizar los totales
    const resultIds = new Set<number>();
    resultItems.forEach((item) => {
      if (item.result && item.result.id) {
        resultIds.add(item.result.id);
      }
    });

    // Eliminar los ResultItems
    await this.resultItemsRepository.delete({ eventItem: { id: eventItemId } });

    // Actualizar los totales de cada Result afectado
    for (const resultId of resultIds) {
      try {
        const result = await this.findOne(resultId);

        // Recalcular el total
        let totalScore = 0;
        for (const item of result.items) {
          // Asegurarse de que este cálculo corresponde con tu lógica de negocio
          if (item.eventItem && item.eventItem.percentage) {
            totalScore += (item.score * item.eventItem.percentage) / 100;
          }
        }

        // Actualizar el total
        result.totalScore = parseFloat(totalScore.toFixed(2));
        await this.resultsRepository.save(result);

        console.log(
          `Actualizado el total para Result ${resultId}: ${result.totalScore}`,
        );
      } catch (error) {
        console.error(
          `Error al actualizar Result ${resultId}: ${error.message}`,
        );
      }
    }
  }

  // Nuevo método para verificar si un ítem de evento tiene calificaciones
  async hasScoresForEventItem(eventItemId: number): Promise<boolean> {
    // First try to find a regular result item with this event item
    const resultItem = await this.resultItemsRepository.findOne({
      where: { eventItem: { id: eventItemId } },
    });

    if (resultItem) {
      return true;
    }

    // If not found, check for member-based result items
    const memberBasedResultItem =
      await this.resultMemberBasedItemsRepository.findOne({
        where: { eventItem: { id: eventItemId } },
      });

    return !!memberBasedResultItem;
  }
}
