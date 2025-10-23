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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Events')
@ApiBearerAuth()
@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear plantilla de evento',
    description: 'Crea una nueva plantilla de evento que puede ser reutilizada en múltiples campamentos'
  })
  @ApiResponse({
    status: 201,
    description: 'Plantilla de evento creada exitosamente',
    schema: {
      example: {
        id: 1,
        name: 'Nudos y Amarres',
        description: 'Competencia de habilidades en nudos y técnicas de amarre',
        categoryId: 1,
        createdAt: '2025-01-20T10:00:00.000Z',
        updatedAt: '2025-01-20T10:00:00.000Z',
        category: {
          id: 1,
          name: 'Guías Mayores',
          description: 'Categoría para jóvenes de 16 años en adelante',
          code: 'GM'
        },
        eventItems: [
          {
            id: 1,
            name: 'Nudo de Ocho',
            description: 'Realizar correctamente un nudo de ocho',
            maxScore: 10,
            order: 1,
            createdAt: '2025-01-20T10:00:00.000Z'
          },
          {
            id: 2,
            name: 'Nudo Ballestrinque',
            description: 'Realizar correctamente un nudo ballestrinque',
            maxScore: 10,
            order: 2,
            createdAt: '2025-01-20T10:00:00.000Z'
          }
        ]
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['name no debe estar vacío', 'categoryId debe ser un número'],
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
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las plantillas de eventos',
    description: 'Obtiene todas las plantillas de eventos. Se puede filtrar por categoría usando el parámetro categoryId'
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'ID de la categoría para filtrar plantillas de eventos',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de plantillas de eventos obtenida exitosamente',
    schema: {
      example: [
        {
          id: 1,
          name: 'Nudos y Amarres',
          description: 'Competencia de habilidades en nudos y técnicas de amarre',
          categoryId: 1,
          createdAt: '2025-01-20T10:00:00.000Z',
          updatedAt: '2025-01-20T10:00:00.000Z',
          category: {
            id: 1,
            name: 'Guías Mayores',
            description: 'Categoría para jóvenes de 16 años en adelante',
            code: 'GM'
          },
          eventItems: [
            {
              id: 1,
              name: 'Nudo de Ocho',
              description: 'Realizar correctamente un nudo de ocho',
              maxScore: 10,
              order: 1,
              createdAt: '2025-01-20T10:00:00.000Z'
            },
            {
              id: 2,
              name: 'Nudo Ballestrinque',
              description: 'Realizar correctamente un nudo ballestrinque',
              maxScore: 10,
              order: 2,
              createdAt: '2025-01-20T10:00:00.000Z'
            }
          ]
        },
        {
          id: 2,
          name: 'Primeros Auxilios',
          description: 'Evaluación de conocimientos y práctica de primeros auxilios',
          categoryId: 2,
          createdAt: '2025-01-21T11:30:00.000Z',
          updatedAt: '2025-01-21T11:30:00.000Z',
          category: {
            id: 2,
            name: 'Conquistadores',
            description: 'Categoría para jóvenes de 10 a 15 años',
            code: 'CONQ'
          },
          eventItems: [
            {
              id: 3,
              name: 'Vendaje de heridas',
              description: 'Realizar correctamente un vendaje de herida',
              maxScore: 15,
              order: 1,
              createdAt: '2025-01-21T11:30:00.000Z'
            }
          ]
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
  findAll(@Query('categoryId') categoryId?: string) {
    if (categoryId) {
      return this.eventsService.findByCategory(+categoryId);
    }
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener plantilla de evento por ID',
    description: 'Obtiene una plantilla de evento específica por su ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la plantilla de evento',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Plantilla de evento obtenida exitosamente',
    schema: {
      example: {
        id: 1,
        name: 'Nudos y Amarres',
        description: 'Competencia de habilidades en nudos y técnicas de amarre',
        categoryId: 1,
        createdAt: '2025-01-20T10:00:00.000Z',
        updatedAt: '2025-01-20T10:00:00.000Z',
        category: {
          id: 1,
          name: 'Guías Mayores',
          description: 'Categoría para jóvenes de 16 años en adelante',
          code: 'GM'
        },
        eventItems: [
          {
            id: 1,
            name: 'Nudo de Ocho',
            description: 'Realizar correctamente un nudo de ocho',
            maxScore: 10,
            order: 1,
            createdAt: '2025-01-20T10:00:00.000Z'
          },
          {
            id: 2,
            name: 'Nudo Ballestrinque',
            description: 'Realizar correctamente un nudo ballestrinque',
            maxScore: 10,
            order: 2,
            createdAt: '2025-01-20T10:00:00.000Z'
          }
        ]
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Plantilla de evento no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Plantilla de evento con ID 10 no encontrada',
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
    return this.eventsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar plantilla de evento',
    description: 'Actualiza una plantilla de evento existente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la plantilla de evento a actualizar',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Plantilla de evento actualizada exitosamente',
    schema: {
      example: {
        id: 1,
        name: 'Nudos y Amarres Avanzados',
        description: 'Competencia avanzada de habilidades en nudos y técnicas de amarre',
        categoryId: 1,
        createdAt: '2025-01-20T10:00:00.000Z',
        updatedAt: '2025-01-22T14:30:00.000Z',
        category: {
          id: 1,
          name: 'Guías Mayores',
          description: 'Categoría para jóvenes de 16 años en adelante',
          code: 'GM'
        },
        eventItems: [
          {
            id: 1,
            name: 'Nudo de Ocho',
            description: 'Realizar correctamente un nudo de ocho',
            maxScore: 10,
            order: 1,
            createdAt: '2025-01-20T10:00:00.000Z'
          },
          {
            id: 2,
            name: 'Nudo Ballestrinque',
            description: 'Realizar correctamente un nudo ballestrinque',
            maxScore: 10,
            order: 2,
            createdAt: '2025-01-20T10:00:00.000Z'
          },
          {
            id: 5,
            name: 'Nudo Prusik',
            description: 'Realizar correctamente un nudo prusik',
            maxScore: 15,
            order: 3,
            createdAt: '2025-01-22T14:30:00.000Z'
          }
        ]
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Plantilla de evento no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Plantilla de evento con ID 10 no encontrada',
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
        message: ['name no debe estar vacío'],
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
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar plantilla de evento',
    description: 'Elimina una plantilla de evento del sistema'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la plantilla de evento a eliminar',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Plantilla de evento eliminada exitosamente',
    schema: {
      example: {
        message: 'Plantilla de evento eliminada exitosamente'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Plantilla de evento no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Plantilla de evento con ID 10 no encontrada',
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
    return this.eventsService.remove(+id);
  }
}
