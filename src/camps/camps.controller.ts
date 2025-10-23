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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CampsService } from './camps.service';
import { CreateCampDto } from './dto/create-camp.dto';
import { UpdateCampDto } from './dto/update-camp.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Camps')
@ApiBearerAuth()
@Controller('camps')
@UseGuards(JwtAuthGuard)
export class CampsController {
  constructor(private readonly campsService: CampsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  @ApiOperation({
    summary: 'Crear campamento',
    description: 'Crea un nuevo campamento con sus detalles y logo opcional'
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Campamento creado exitosamente',
    schema: {
      example: {
        id: 1,
        name: 'Campamento Nacional 2025',
        startDate: '2025-03-15T00:00:00.000Z',
        endDate: '2025-03-18T00:00:00.000Z',
        location: 'Parque Nacional Tayrona',
        description: 'Gran campamento nacional con actividades para todas las categorías',
        logoUrl: 'uploads/logos/camp-1.png',
        isActive: true,
        createdAt: '2025-01-18T08:00:00.000Z',
        updatedAt: '2025-01-18T08:00:00.000Z'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['name no debe estar vacío', 'startDate debe ser una fecha válida'],
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
  create(
    @Body() createCampDto: CreateCampDto,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    return this.campsService.create(createCampDto, logo);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los campamentos',
    description: 'Obtiene todos los campamentos. Se puede incluir relaciones usando el parámetro relations=true'
  })
  @ApiQuery({
    name: 'relations',
    required: false,
    description: 'Incluir relaciones del campamento (true/false)',
    type: String
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de campamentos obtenida exitosamente',
    schema: {
      example: [
        {
          id: 1,
          name: 'Campamento Nacional 2025',
          startDate: '2025-03-15T00:00:00.000Z',
          endDate: '2025-03-18T00:00:00.000Z',
          location: 'Parque Nacional Tayrona',
          description: 'Gran campamento nacional con actividades para todas las categorías',
          logoUrl: 'uploads/logos/camp-1.png',
          isActive: true,
          createdAt: '2025-01-18T08:00:00.000Z',
          updatedAt: '2025-01-18T08:00:00.000Z',
          campRegistrations: [
            {
              id: 1,
              numberOfParticipants: 25,
              clubCategory: {
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
          ],
          campEvents: [
            {
              id: 1,
              customName: 'Nudos y Amarres - Nivel Avanzado',
              event: {
                id: 1,
                name: 'Nudos y Amarres',
                categoryId: 1
              }
            }
          ]
        },
        {
          id: 2,
          name: 'Campamento Regional Costa 2025',
          startDate: '2025-05-20T00:00:00.000Z',
          endDate: '2025-05-22T00:00:00.000Z',
          location: 'Parque Los Caimanes',
          description: 'Campamento regional para clubes de la costa atlántica',
          logoUrl: 'uploads/logos/camp-2.png',
          isActive: true,
          createdAt: '2025-01-20T10:00:00.000Z',
          updatedAt: '2025-01-20T10:00:00.000Z'
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
  findAll(@Query('relations') relations?: string) {
    const includeRelations = relations === 'true';
    return this.campsService.findAll(includeRelations);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener campamento por ID',
    description: 'Obtiene un campamento específico por su ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del campamento',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Campamento obtenido exitosamente',
    schema: {
      example: {
        id: 1,
        name: 'Campamento Nacional 2025',
        startDate: '2025-03-15T00:00:00.000Z',
        endDate: '2025-03-18T00:00:00.000Z',
        location: 'Parque Nacional Tayrona',
        description: 'Gran campamento nacional con actividades para todas las categorías',
        logoUrl: 'uploads/logos/camp-1.png',
        isActive: true,
        createdAt: '2025-01-18T08:00:00.000Z',
        updatedAt: '2025-01-18T08:00:00.000Z',
        campRegistrations: [
          {
            id: 1,
            numberOfParticipants: 25,
            numberOfLeaders: 3,
            totalCost: 1650000,
            isPaid: false,
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
        ],
        campEvents: [
          {
            id: 1,
            customName: 'Nudos y Amarres - Nivel Avanzado',
            customMaxScore: 100,
            event: {
              id: 1,
              name: 'Nudos y Amarres',
              description: 'Competencia de habilidades en nudos y técnicas de amarre',
              categoryId: 1
            }
          }
        ]
      }
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
  findOne(@Param('id') id: string) {
    return this.campsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('logo'))
  @ApiOperation({
    summary: 'Actualizar campamento',
    description: 'Actualiza un campamento existente, incluyendo logo si se proporciona'
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    description: 'ID del campamento a actualizar',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Campamento actualizado exitosamente',
    schema: {
      example: {
        id: 1,
        name: 'Campamento Nacional 2025 - Edición Especial',
        startDate: '2025-03-15T00:00:00.000Z',
        endDate: '2025-03-19T00:00:00.000Z',
        location: 'Parque Nacional Tayrona',
        description: 'Gran campamento nacional con actividades ampliadas para todas las categorías',
        logoUrl: 'uploads/logos/camp-1-updated.png',
        isActive: true,
        createdAt: '2025-01-18T08:00:00.000Z',
        updatedAt: '2025-01-27T16:30:00.000Z'
      }
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
    status: 400,
    description: 'Datos de entrada inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['startDate debe ser anterior a endDate'],
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
    @Body() updateCampDto: UpdateCampDto,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    return this.campsService.update(+id, updateCampDto, logo);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar campamento',
    description: 'Elimina un campamento del sistema'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del campamento a eliminar',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Campamento eliminado exitosamente',
    schema: {
      example: {
        message: 'Campamento eliminado exitosamente'
      }
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
  remove(@Param('id') id: string) {
    return this.campsService.remove(+id);
  }
}
