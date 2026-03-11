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
  BadRequestException,
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
    summary: 'Crear evento en campamento',
    description:
      'Crea un evento independiente en un campamento con sus items de evaluación. Puedes enviar items regulares y/o items basados en miembros en el mismo payload. Los items son opcionales.',
  })
  @ApiResponse({
    status: 201,
    description: 'Evento creado exitosamente con sus items',
    schema: {
      examples: {
        withItems: {
          summary: 'Evento con items',
          value: {
            id: 1,
            isActive: true,
            name: 'Nudos y Amarres - Campamento Nacional 2025',
            description:
              'Competencia de habilidades en nudos y técnicas de amarre',
            maxScore: 100,
            type: 'REGULAR',
            createdAt: '2025-01-23T09:00:00.000Z',
            updatedAt: '2025-01-23T09:00:00.000Z',
            camp: {
              id: 1,
              name: 'Campamento Nacional 2025',
              location: 'Parque Nacional Tayrona',
              startDate: '2025-03-15T00:00:00.000Z',
              endDate: '2025-03-18T00:00:00.000Z',
            },
            items: [
              {
                id: 1,
                name: 'Nudo de Ocho',
                isActive: true,
              },
              {
                id: 2,
                name: 'Nudo Ballestrinque',
                isActive: true,
              },
              {
                id: 3,
                name: 'Amarre Cuadrado',
                isActive: true,
              },
            ],
            memberBasedItems: [
              {
                id: 1,
                name: 'Cantidad de Menores',
                applicableCharacteristics: ['MENOR'],
                calculationType: 'COUNT',
                isRequired: false,
                isActive: true,
              },
              {
                id: 2,
                name: 'Cantidad de Adultos',
                applicableCharacteristics: ['ADULTO'],
                calculationType: 'COUNT',
                isRequired: false,
                isActive: true,
              },
            ],
          },
        },
        withoutItems: {
          summary: 'Evento sin items',
          value: {
            id: 2,
            isActive: true,
            name: 'Carrera de Relevos',
            description: 'Competencia deportiva',
            maxScore: 50,
            type: 'REGULAR',
            createdAt: '2025-01-23T10:00:00.000Z',
            updatedAt: '2025-01-23T10:00:00.000Z',
            camp: {
              id: 1,
              name: 'Campamento Nacional 2025',
            },
            items: [],
            memberBasedItems: [],
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['name should not be empty', 'maxScore must be a number'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Campamento no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Camp with ID 10 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    schema: {
      example: {
        statusCode: 401,
        message: 'No autorizado',
        error: 'Unauthorized',
      },
    },
  })
  create(@Body() createCampEventDto: CreateCampEventDto) {
    return this.campEventsService.create(createCampEventDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los eventos de campamentos',
    description:
      'Obtiene todos los eventos creados en campamentos con sus items de evaluación. Se puede filtrar por campamento usando el parámetro campId. Cada evento es una instancia independiente con sus propios items.',
  })
  @ApiQuery({
    name: 'campId',
    required: false,
    description: 'ID del campamento para filtrar eventos',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de eventos obtenida exitosamente',
    schema: {
      example: [
        {
          id: 1,
          isActive: true,
          name: 'Nudos y Amarres - Campamento Nacional 2025',
          description:
            'Competencia de habilidades en nudos y técnicas de amarre',
          maxScore: 100,
          type: 'REGULAR',
          createdAt: '2025-01-23T09:00:00.000Z',
          updatedAt: '2025-01-23T09:00:00.000Z',
          camp: {
            id: 1,
            name: 'Campamento Nacional 2025',
            location: 'Parque Nacional Tayrona',
            startDate: '2025-03-15T00:00:00.000Z',
            endDate: '2025-03-18T00:00:00.000Z',
          },
          items: [
            {
              id: 1,
              name: 'Nudo de Ocho',
              isActive: true,
            },
            {
              id: 2,
              name: 'Nudo Ballestrinque',
              isActive: true,
            },
          ],
          memberBasedItems: [
            {
              id: 1,
              name: 'Cantidad de Menores',
              applicableCharacteristics: ['MENOR'],
              calculationType: 'COUNT',
              isRequired: false,
              isActive: true,
            },
          ],
        },
        {
          id: 2,
          isActive: true,
          name: 'Carrera de Relevos',
          description: 'Competencia deportiva especial',
          maxScore: 50,
          type: 'REGULAR',
          createdAt: '2025-01-23T10:30:00.000Z',
          updatedAt: '2025-01-23T10:30:00.000Z',
          camp: {
            id: 1,
            name: 'Campamento Nacional 2025',
            location: 'Parque Nacional Tayrona',
          },
          items: [],
          memberBasedItems: [],
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    schema: {
      example: {
        statusCode: 401,
        message: 'No autorizado',
        error: 'Unauthorized',
      },
    },
  })
  findAll(@Query('campId') campId?: string) {
    if (campId) {
      return this.campEventsService.findByCamp(+campId);
    }
    return this.campEventsService.findAll();
  }

  @Get('results')
  @ApiOperation({
    summary: 'Obtener resultados de un evento de campamento',
    description:
      'Obtiene todos los resultados (scores) de un evento específico de campamento, ordenados por puntaje total descendente. Incluye información del club, evento, e items evaluados.',
  })
  @ApiQuery({
    name: 'eventId',
    required: true,
    description: 'ID del evento de campamento',
    type: Number,
    example: 13,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de resultados obtenida exitosamente',
    schema: {
      example: [
        {
          id: 1,
          eventId: 13,
          clubId: 5,
          totalScore: 85.5,
          rank: 1,
          event: {
            id: 13,
            name: 'Nudos y Amarres',
            date: '2025-03-15T00:00:00.000Z',
            description: 'Competencia de habilidades en nudos',
            type: 'REGULAR',
            maxScore: 100,
          },
          club: {
            id: 5,
            name: 'Club Aventureros del Norte',
            city: 'Bogotá',
            shieldUrl: 'https://example.com/shield.png',
          },
          items: [
            {
              id: 101,
              score: 8.5,
              eventItem: {
                id: 201,
                name: 'Nudo de Ocho',
              },
            },
            {
              id: 102,
              score: 12.0,
              eventItem: {
                id: 202,
                name: 'Nudo Ballestrinque',
              },
            },
          ],
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'eventId inválido',
    schema: {
      example: {
        statusCode: 400,
        message: 'eventId must be a valid number',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Evento no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'CampEvent with ID 13 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    schema: {
      example: {
        statusCode: 401,
        message: 'No autorizado',
        error: 'Unauthorized',
      },
    },
  })
  getResultsByEvent(@Query('eventId') eventId: string) {
    const parsedEventId = parseInt(eventId, 10);
    if (isNaN(parsedEventId)) {
      throw new BadRequestException('eventId must be a valid number');
    }
    return this.campEventsService.getResultsByEvent(parsedEventId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener evento de campamento por ID',
    description:
      'Obtiene un evento específico de un campamento por su ID, incluyendo todos sus items de evaluación (items regulares y items basados en miembros)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del evento',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Evento obtenido exitosamente',
    schema: {
      example: {
        id: 1,
        isActive: true,
        name: 'Nudos y Amarres - Campamento Nacional 2025',
        description:
          'Competencia de habilidades en nudos y técnicas de amarre',
        maxScore: 100,
        type: 'REGULAR',
        createdAt: '2025-01-23T09:00:00.000Z',
        updatedAt: '2025-01-23T09:00:00.000Z',
        camp: {
          id: 1,
          name: 'Campamento Nacional 2025',
          startDate: '2025-03-15T00:00:00.000Z',
          endDate: '2025-03-18T00:00:00.000Z',
          location: 'Parque Nacional Tayrona',
        },
        items: [
          {
            id: 1,
            name: 'Nudo de Ocho',
            isActive: true,
          },
          {
            id: 2,
            name: 'Nudo Ballestrinque',
            isActive: true,
          },
          {
            id: 3,
            name: 'Amarre Cuadrado',
            isActive: true,
          },
        ],
        memberBasedItems: [
          {
            id: 1,
            name: 'Cantidad de Menores',
            applicableCharacteristics: ['MENOR'],
            calculationType: 'COUNT',
            isRequired: false,
            isActive: true,
          },
          {
            id: 2,
            name: 'Cantidad de Adultos',
            applicableCharacteristics: ['ADULTO'],
            calculationType: 'COUNT',
            isRequired: false,
            isActive: true,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Evento no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'CampEvent with ID 10 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    schema: {
      example: {
        statusCode: 401,
        message: 'No autorizado',
        error: 'Unauthorized',
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.campEventsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar evento de campamento',
    description: 'Actualiza un evento existente de un campamento. Permite modificar nombre, descripción, puntaje máximo y estado activo.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del evento a actualizar',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Evento actualizado exitosamente',
    schema: {
      example: {
        id: 1,
        isActive: true,
        name: 'Nudos y Amarres - Edición Especial',
        description: 'Competencia especial de nudos actualizada para el Campamento Nacional 2025',
        maxScore: 120,
        type: 'REGULAR',
        createdAt: '2025-01-23T09:00:00.000Z',
        updatedAt: '2025-01-24T11:20:00.000Z',
        camp: {
          id: 1,
          name: 'Campamento Nacional 2025',
          startDate: '2025-03-15T00:00:00.000Z',
          endDate: '2025-03-18T00:00:00.000Z',
          location: 'Parque Nacional Tayrona'
        },
        items: [
          {
            id: 1,
            name: 'Nudo de Ocho',
            isActive: true,
          }
        ],
        memberBasedItems: []
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Evento no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'CampEvent with ID 10 not found',
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
        message: ['maxScore must be a number'],
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
    summary: 'Eliminar evento de campamento',
    description: 'Elimina un evento de un campamento. Los items asociados se eliminan en cascada.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del evento a eliminar',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Evento eliminado exitosamente',
    schema: {
      example: {
        message: 'Evento eliminado exitosamente'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Evento no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'CampEvent with ID 10 not found',
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
