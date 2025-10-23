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
import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { CreateBulkResultDto } from './dto/create-bulk-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Results')
@ApiBearerAuth()
@Controller('results')
@UseGuards(JwtAuthGuard)
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear resultado individual',
    description: 'Crea un resultado para una instancia de evento (campEventId) y un registro de campamento (campRegistrationId)'
  })
  @ApiResponse({
    status: 201,
    description: 'Resultado creado exitosamente',
    schema: {
      example: {
        id: 1,
        campEventId: 1,
        campRegistrationId: 1,
        score: 85,
        observations: 'Excelente desempeño en todos los nudos',
        createdAt: '2025-01-25T14:30:00.000Z',
        updatedAt: '2025-01-25T14:30:00.000Z',
        campEvent: {
          id: 1,
          customName: 'Nudos y Amarres - Nivel Avanzado',
          customMaxScore: 100,
          event: {
            id: 1,
            name: 'Nudos y Amarres',
            categoryId: 1
          }
        },
        campRegistration: {
          id: 1,
          clubCategory: {
            id: 1,
            club: {
              id: 1,
              name: 'Club Maranatha',
              city: 'Barranquilla'
            },
            category: {
              id: 1,
              name: 'Guías Mayores',
              code: 'GM'
            }
          }
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
        message: ['score debe ser un número', 'campEventId no debe estar vacío'],
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
  create(@Body() createResultDto: CreateResultDto) {
    return this.resultsService.create(createResultDto);
  }

  @Post('bulk')
  @ApiOperation({
    summary: 'Crear resultados en lote',
    description: 'Crea múltiples resultados para una instancia de evento (campEventId) de manera masiva. Útil para registrar resultados de todos los clubes en un evento'
  })
  @ApiResponse({
    status: 201,
    description: 'Resultados creados exitosamente en lote',
    schema: {
      example: {
        message: 'Resultados guardados exitosamente',
        count: 3,
        results: [
          {
            id: 1,
            campEventId: 1,
            campRegistrationId: 1,
            score: 85,
            observations: 'Excelente desempeño',
            createdAt: '2025-01-25T14:30:00.000Z'
          },
          {
            id: 2,
            campEventId: 1,
            campRegistrationId: 2,
            score: 92,
            observations: 'Perfecto en todos los nudos',
            createdAt: '2025-01-25T14:30:00.000Z'
          },
          {
            id: 3,
            campEventId: 1,
            campRegistrationId: 3,
            score: 78,
            observations: 'Buen trabajo, puede mejorar',
            createdAt: '2025-01-25T14:30:00.000Z'
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
        message: ['campEventId no debe estar vacío', 'results debe ser un array'],
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
  createBulk(@Body() createBulkResultDto: CreateBulkResultDto) {
    return this.resultsService.createBulk(createBulkResultDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los resultados',
    description: 'Obtiene todos los resultados. Se puede filtrar por registro de campamento (campRegistrationId), instancia de evento (campEventId) o campamento (campId)'
  })
  @ApiQuery({
    name: 'campRegistrationId',
    required: false,
    description: 'ID del registro de campamento para filtrar resultados',
    type: Number
  })
  @ApiQuery({
    name: 'campEventId',
    required: false,
    description: 'ID de la instancia de evento para filtrar resultados',
    type: Number
  })
  @ApiQuery({
    name: 'campId',
    required: false,
    description: 'ID del campamento para filtrar resultados',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de resultados obtenida exitosamente',
    schema: {
      example: [
        {
          id: 1,
          campEventId: 1,
          campRegistrationId: 1,
          score: 85,
          observations: 'Excelente desempeño en todos los nudos',
          createdAt: '2025-01-25T14:30:00.000Z',
          updatedAt: '2025-01-25T14:30:00.000Z',
          campEvent: {
            id: 1,
            customName: 'Nudos y Amarres - Nivel Avanzado',
            customMaxScore: 100,
            event: {
              id: 1,
              name: 'Nudos y Amarres'
            }
          },
          campRegistration: {
            id: 1,
            clubCategory: {
              id: 1,
              club: {
                id: 1,
                name: 'Club Maranatha',
                city: 'Barranquilla'
              },
              category: {
                id: 1,
                name: 'Guías Mayores',
                code: 'GM'
              }
            }
          }
        },
        {
          id: 2,
          campEventId: 1,
          campRegistrationId: 2,
          score: 92,
          observations: 'Perfecto en todos los nudos',
          createdAt: '2025-01-25T14:35:00.000Z',
          updatedAt: '2025-01-25T14:35:00.000Z',
          campEvent: {
            id: 1,
            customName: 'Nudos y Amarres - Nivel Avanzado',
            customMaxScore: 100,
            event: {
              id: 1,
              name: 'Nudos y Amarres'
            }
          },
          campRegistration: {
            id: 2,
            clubCategory: {
              id: 3,
              club: {
                id: 2,
                name: 'Club Centinelas del Rey',
                city: 'Cartagena'
              },
              category: {
                id: 1,
                name: 'Guías Mayores',
                code: 'GM'
              }
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
  findAll(
    @Query('campRegistrationId') campRegistrationId?: string,
    @Query('campEventId') campEventId?: string,
    @Query('campId') campId?: string,
  ) {
    if (campRegistrationId) {
      return this.resultsService.findByCampRegistration(+campRegistrationId);
    }
    if (campEventId) {
      return this.resultsService.findByCampEvent(+campEventId);
    }
    if (campId) {
      return this.resultsService.findByCamp(+campId);
    }
    return this.resultsService.findAll();
  }

  @Get('ranking/:campId')
  @ApiOperation({
    summary: 'Obtener ranking de clubes por campamento',
    description: 'Obtiene el ranking de clubes ordenado por puntaje total para un campamento específico'
  })
  @ApiParam({
    name: 'campId',
    description: 'ID del campamento',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Ranking de clubes obtenido exitosamente',
    schema: {
      example: [
        {
          clubId: 1,
          clubName: 'Club Maranatha',
          city: 'Barranquilla',
          categoryId: 1,
          categoryName: 'Guías Mayores',
          categoryCode: 'GM',
          totalScore: 425,
          eventCount: 5,
          averageScore: 85,
          ranking: 1
        },
        {
          clubId: 2,
          clubName: 'Club Centinelas del Rey',
          city: 'Cartagena',
          categoryId: 1,
          categoryName: 'Guías Mayores',
          categoryCode: 'GM',
          totalScore: 405,
          eventCount: 5,
          averageScore: 81,
          ranking: 2
        },
        {
          clubId: 3,
          clubName: 'Club Águilas de Dios',
          city: 'Santa Marta',
          categoryId: 1,
          categoryName: 'Guías Mayores',
          categoryCode: 'GM',
          totalScore: 380,
          eventCount: 5,
          averageScore: 76,
          ranking: 3
        }
      ]
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Campamento no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Campamento con ID 10 no encontrado',
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
  getClubRankingByCamp(@Param('campId') campId: string) {
    return this.resultsService.getClubRankingByCamp(+campId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener resultado por ID',
    description: 'Obtiene un resultado específico por su ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del resultado',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado obtenido exitosamente',
    schema: {
      example: {
        id: 1,
        campEventId: 1,
        campRegistrationId: 1,
        score: 85,
        observations: 'Excelente desempeño en todos los nudos',
        createdAt: '2025-01-25T14:30:00.000Z',
        updatedAt: '2025-01-25T14:30:00.000Z',
        campEvent: {
          id: 1,
          customName: 'Nudos y Amarres - Nivel Avanzado',
          customMaxScore: 100,
          event: {
            id: 1,
            name: 'Nudos y Amarres',
            categoryId: 1
          }
        },
        campRegistration: {
          id: 1,
          clubCategory: {
            id: 1,
            club: {
              id: 1,
              name: 'Club Maranatha',
              city: 'Barranquilla'
            },
            category: {
              id: 1,
              name: 'Guías Mayores',
              code: 'GM'
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Resultado no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Resultado con ID 10 no encontrado',
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
    return this.resultsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar resultado',
    description: 'Actualiza un resultado existente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del resultado a actualizar',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado actualizado exitosamente',
    schema: {
      example: {
        id: 1,
        campEventId: 1,
        campRegistrationId: 1,
        score: 90,
        observations: 'Excelente desempeño en todos los nudos - Actualizado',
        createdAt: '2025-01-25T14:30:00.000Z',
        updatedAt: '2025-01-26T10:15:00.000Z',
        campEvent: {
          id: 1,
          customName: 'Nudos y Amarres - Nivel Avanzado',
          customMaxScore: 100,
          event: {
            id: 1,
            name: 'Nudos y Amarres',
            categoryId: 1
          }
        },
        campRegistration: {
          id: 1,
          clubCategory: {
            id: 1,
            club: {
              id: 1,
              name: 'Club Maranatha',
              city: 'Barranquilla'
            },
            category: {
              id: 1,
              name: 'Guías Mayores',
              code: 'GM'
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Resultado no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Resultado con ID 10 no encontrado',
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
        message: ['score debe ser un número positivo'],
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
  update(@Param('id') id: string, @Body() updateResultDto: UpdateResultDto) {
    return this.resultsService.update(+id, updateResultDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar resultado',
    description: 'Elimina un resultado del sistema'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del resultado a eliminar',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado eliminado exitosamente',
    schema: {
      example: {
        message: 'Resultado eliminado exitosamente'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Resultado no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Resultado con ID 10 no encontrado',
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
    return this.resultsService.remove(+id);
  }
}
