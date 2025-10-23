import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CampEventsService } from './camp-events.service';
import { CreateCampEventDto } from './dto/create-camp-event.dto';
import { UpdateCampEventDto } from './dto/update-camp-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Camp Events')
@ApiBearerAuth()
@Controller('camp-events')
@UseGuards(JwtAuthGuard)
export class CampEventsController {
  constructor(private readonly campEventsService: CampEventsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear instancia de evento en campamento',
    description: 'Crea una instancia de un evento (plantilla) en un campamento específico. Permite personalizar nombre, descripción y puntaje máximo'
  })
  @ApiResponse({
    status: 201,
    description: 'Instancia de evento creada exitosamente',
    schema: {
      example: {
        id: 1,
        campId: 1,
        eventId: 1,
        customName: 'Nudos y Amarres - Nivel Avanzado',
        customDescription: 'Competencia especial de nudos para el Campamento Nacional 2025',
        customMaxScore: 100,
        createdAt: '2025-01-23T09:00:00.000Z',
        updatedAt: '2025-01-23T09:00:00.000Z',
        camp: {
          id: 1,
          name: 'Campamento Nacional 2025',
          startDate: '2025-03-15T00:00:00.000Z',
          endDate: '2025-03-18T00:00:00.000Z',
          location: 'Parque Nacional Tayrona'
        },
        event: {
          id: 1,
          name: 'Nudos y Amarres',
          description: 'Competencia de habilidades en nudos y técnicas de amarre',
          categoryId: 1,
          category: {
            id: 1,
            name: 'Guías Mayores',
            code: 'GM'
          },
          eventItems: [
            {
              id: 1,
              name: 'Nudo de Ocho',
              description: 'Realizar correctamente un nudo de ocho',
              maxScore: 10,
              order: 1
            },
            {
              id: 2,
              name: 'Nudo Ballestrinque',
              description: 'Realizar correctamente un nudo ballestrinque',
              maxScore: 10,
              order: 2
            }
          ]
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['campId debe ser un número', 'eventId no debe estar vacío'],
        error: 'Bad Request'
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    schema: {
      example: {
        statusCode: 401,
        message: 'No autorizado',
        error: 'Unauthorized'
      }
    }
  })
  create(@Body() createCampEventDto: CreateCampEventDto) {
    return this.campEventsService.create(createCampEventDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las instancias de eventos',
    description: 'Obtiene todas las instancias de eventos en campamentos. Se puede filtrar por campamento usando el parámetro campId'
  })
  @ApiQuery({
    name: 'campId',
    required: false,
    description: 'ID del campamento para filtrar instancias de eventos',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de instancias de eventos obtenida exitosamente',
    schema: {
      example: [
        {
          id: 1,
          campId: 1,
          eventId: 1,
          customName: 'Nudos y Amarres - Nivel Avanzado',
          customDescription: 'Competencia especial de nudos para el Campamento Nacional 2025',
          customMaxScore: 100,
          createdAt: '2025-01-23T09:00:00.000Z',
          updatedAt: '2025-01-23T09:00:00.000Z',
          camp: {
            id: 1,
            name: 'Campamento Nacional 2025',
            startDate: '2025-03-15T00:00:00.000Z',
            endDate: '2025-03-18T00:00:00.000Z',
            location: 'Parque Nacional Tayrona'
          },
          event: {
            id: 1,
            name: 'Nudos y Amarres',
            description: 'Competencia de habilidades en nudos y técnicas de amarre',
            categoryId: 1,
            category: {
              id: 1,
              name: 'Guías Mayores',
              code: 'GM'
            }
          }
        },
        {
          id: 2,
          campId: 1,
          eventId: 2,
          customName: null,
          customDescription: null,
          customMaxScore: null,
          createdAt: '2025-01-23T10:30:00.000Z',
          updatedAt: '2025-01-23T10:30:00.000Z',
          camp: {
            id: 1,
            name: 'Campamento Nacional 2025',
            startDate: '2025-03-15T00:00:00.000Z',
            endDate: '2025-03-18T00:00:00.000Z',
            location: 'Parque Nacional Tayrona'
          },
          event: {
            id: 2,
            name: 'Primeros Auxilios',
            description: 'Evaluación de conocimientos y práctica de primeros auxilios',
            categoryId: 2,
            category: {
              id: 2,
              name: 'Conquistadores',
              code: 'CONQ'
            }
          }
        }
      ]
    }
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    schema: {
      example: {
        statusCode: 401,
        message: 'No autorizado',
        error: 'Unauthorized'
      }
    }
  })
  findAll(@Query('campId') campId?: string) {
    if (campId) {
      return this.campEventsService.findByCamp(+campId);
    }
    return this.campEventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener instancia de evento por ID',
    description: 'Obtiene una instancia de evento específica por su ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la instancia de evento',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Instancia de evento obtenida exitosamente',
    schema: {
      example: {
        id: 1,
        campId: 1,
        eventId: 1,
        customName: 'Nudos y Amarres - Nivel Avanzado',
        customDescription: 'Competencia especial de nudos para el Campamento Nacional 2025',
        customMaxScore: 100,
        createdAt: '2025-01-23T09:00:00.000Z',
        updatedAt: '2025-01-23T09:00:00.000Z',
        camp: {
          id: 1,
          name: 'Campamento Nacional 2025',
          startDate: '2025-03-15T00:00:00.000Z',
          endDate: '2025-03-18T00:00:00.000Z',
          location: 'Parque Nacional Tayrona'
        },
        event: {
          id: 1,
          name: 'Nudos y Amarres',
          description: 'Competencia de habilidades en nudos y técnicas de amarre',
          categoryId: 1,
          category: {
            id: 1,
            name: 'Guías Mayores',
            code: 'GM'
          },
          eventItems: [
            {
              id: 1,
              name: 'Nudo de Ocho',
              description: 'Realizar correctamente un nudo de ocho',
              maxScore: 10,
              order: 1
            },
            {
              id: 2,
              name: 'Nudo Ballestrinque',
              description: 'Realizar correctamente un nudo ballestrinque',
              maxScore: 10,
              order: 2
            }
          ]
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Instancia de evento no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Instancia de evento con ID 10 no encontrada',
        error: 'Not Found'
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    schema: {
      example: {
        statusCode: 401,
        message: 'No autorizado',
        error: 'Unauthorized'
      }
    }
  })
  findOne(@Param('id') id: string) {
    return this.campEventsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar instancia de evento',
    description: 'Actualiza una instancia de evento existente. Permite modificar personalizaciones como nombre, descripción y puntaje máximo'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la instancia de evento a actualizar',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Instancia de evento actualizada exitosamente',
    schema: {
      example: {
        id: 1,
        campId: 1,
        eventId: 1,
        customName: 'Nudos y Amarres - Edición Especial',
        customDescription: 'Competencia especial de nudos actualizada para el Campamento Nacional 2025',
        customMaxScore: 120,
        createdAt: '2025-01-23T09:00:00.000Z',
        updatedAt: '2025-01-24T11:20:00.000Z',
        camp: {
          id: 1,
          name: 'Campamento Nacional 2025',
          startDate: '2025-03-15T00:00:00.000Z',
          endDate: '2025-03-18T00:00:00.000Z',
          location: 'Parque Nacional Tayrona'
        },
        event: {
          id: 1,
          name: 'Nudos y Amarres',
          description: 'Competencia de habilidades en nudos y técnicas de amarre',
          categoryId: 1,
          category: {
            id: 1,
            name: 'Guías Mayores',
            code: 'GM'
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Instancia de evento no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Instancia de evento con ID 10 no encontrada',
        error: 'Not Found'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['customMaxScore debe ser un número positivo'],
        error: 'Bad Request'
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    schema: {
      example: {
        statusCode: 401,
        message: 'No autorizado',
        error: 'Unauthorized'
      }
    }
  })
  update(
    @Param('id') id: string,
    @Body() updateCampEventDto: UpdateCampEventDto,
  ) {
    return this.campEventsService.update(+id, updateCampEventDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar instancia de evento',
    description: 'Elimina una instancia de evento de un campamento'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la instancia de evento a eliminar',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Instancia de evento eliminada exitosamente',
    schema: {
      example: {
        message: 'Instancia de evento eliminada exitosamente'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Instancia de evento no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Instancia de evento con ID 10 no encontrada',
        error: 'Not Found'
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    schema: {
      example: {
        statusCode: 401,
        message: 'No autorizado',
        error: 'Unauthorized'
      }
    }
  })
  remove(@Param('id') id: string) {
    return this.campEventsService.remove(+id);
  }
}
