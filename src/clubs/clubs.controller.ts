import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Clubs')
@ApiBearerAuth()
@Controller('clubs')
@UseGuards(JwtAuthGuard)
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('shield'))
  @ApiOperation({
    summary: 'Crear un nuevo club',
    description: 'Crea un club independiente con nombre, ciudad, lema, categorías y opcionalmente un escudo (imagen)'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos del club, categorías y archivo de escudo (opcional)',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Club Maranatha' },
        city: { type: 'string', example: 'Barranquilla' },
        motto: { type: 'string', example: 'Unidos en Cristo', nullable: true },
        categoryIds: {
          type: 'array',
          items: { type: 'number' },
          example: [1, 2],
          description: 'IDs de categorías (1: Guías Mayores, 2: Conquistadores, 3: Aventureros)',
          nullable: true
        },
        shield: { type: 'string', format: 'binary', nullable: true },
      },
      required: ['name', 'city'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Club creado exitosamente con sus categorías',
    schema: {
      example: {
        id: 1,
        name: 'Club Maranatha',
        city: 'Barranquilla',
        motto: 'Unidos en Cristo',
        shieldUrl: 'uploads/shields/club-1.png',
        createdAt: '2025-01-15T10:30:00.000Z',
        updatedAt: '2025-01-15T10:30:00.000Z',
        clubCategories: [
          {
            id: 1,
            isActive: true,
            createdAt: '2025-01-15T10:30:00.000Z',
            category: {
              id: 1,
              name: 'Guías Mayores',
              description: 'Categoría para jóvenes de 16 años en adelante',
              code: 'GM'
            }
          },
          {
            id: 2,
            isActive: true,
            createdAt: '2025-01-15T10:30:00.000Z',
            category: {
              id: 2,
              name: 'Conquistadores',
              description: 'Categoría para jóvenes de 10 a 15 años',
              code: 'CONQ'
            }
          }
        ]
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['name no debe estar vacío', 'city no debe estar vacío'],
        error: 'Bad Request'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Categoría con ID 5 no encontrada',
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
  create(
    @Body() createClubDto: CreateClubDto,
    @UploadedFile() shield: Express.Multer.File,
  ) {
    return this.clubsService.create(createClubDto, shield);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos los clubes',
    description: 'Obtiene una lista de todos los clubes registrados en el sistema con sus categorías asociadas'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de clubes obtenida exitosamente',
    schema: {
      example: [
        {
          id: 1,
          name: 'Club Maranatha',
          city: 'Barranquilla',
          motto: 'Unidos en Cristo',
          shieldUrl: 'uploads/shields/club-1.png',
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-15T10:30:00.000Z',
          clubCategories: [
            {
              id: 1,
              isActive: true,
              createdAt: '2025-01-15T10:30:00.000Z',
              category: {
                id: 1,
                name: 'Guías Mayores',
                description: 'Categoría para jóvenes de 16 años en adelante',
                code: 'GM'
              }
            }
          ]
        },
        {
          id: 2,
          name: 'Club Centinelas del Rey',
          city: 'Cartagena',
          motto: 'Firmes en la Fe',
          shieldUrl: 'uploads/shields/club-2.png',
          createdAt: '2025-01-16T14:20:00.000Z',
          updatedAt: '2025-01-16T14:20:00.000Z',
          clubCategories: [
            {
              id: 3,
              isActive: true,
              createdAt: '2025-01-16T14:20:00.000Z',
              category: {
                id: 2,
                name: 'Conquistadores',
                description: 'Categoría para jóvenes de 10 a 15 años',
                code: 'CONQ'
              }
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
  findAll() {
    return this.clubsService.findAll();
  }

  @Get('by-category/:categoryId')
  @ApiOperation({
    summary: 'Listar clubes por categoría',
    description: 'Obtiene una lista de todos los clubes que tienen asociada una categoría específica'
  })
  @ApiParam({
    name: 'categoryId',
    description: 'ID de la categoría (1: Guías Mayores, 2: Conquistadores, 3: Aventureros)',
    type: Number,
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de clubes de la categoría obtenida exitosamente',
    schema: {
      example: [
        {
          id: 1,
          name: 'Club Maranatha',
          city: 'Barranquilla',
          motto: 'Unidos en Cristo',
          shieldUrl: 'uploads/shields/club-1.png',
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-15T10:30:00.000Z',
          clubCategories: [
            {
              id: 1,
              isActive: true,
              createdAt: '2025-01-15T10:30:00.000Z',
              category: {
                id: 1,
                name: 'Guías Mayores',
                description: 'Categoría para jóvenes de 16 años en adelante',
                code: 'GM'
              }
            }
          ]
        },
        {
          id: 3,
          name: 'Club Senderos de Luz',
          city: 'Santa Marta',
          motto: 'Iluminando el camino',
          shieldUrl: 'uploads/shields/club-3.png',
          createdAt: '2025-01-17T09:15:00.000Z',
          updatedAt: '2025-01-17T09:15:00.000Z',
          clubCategories: [
            {
              id: 5,
              isActive: true,
              createdAt: '2025-01-17T09:15:00.000Z',
              category: {
                id: 1,
                name: 'Guías Mayores',
                description: 'Categoría para jóvenes de 16 años en adelante',
                code: 'GM'
              }
            }
          ]
        }
      ]
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Category with ID 10 not found or is not active',
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
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.clubsService.findByCategory(+categoryId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un club por ID',
    description: 'Obtiene los detalles de un club específico incluyendo sus categorías'
  })
  @ApiParam({ name: 'id', description: 'ID del club', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Club encontrado',
    schema: {
      example: {
        id: 1,
        name: 'Club Maranatha',
        city: 'Barranquilla',
        motto: 'Unidos en Cristo',
        shieldUrl: 'uploads/shields/club-1.png',
        createdAt: '2025-01-15T10:30:00.000Z',
        updatedAt: '2025-01-15T10:30:00.000Z',
        clubCategories: [
          {
            id: 1,
            isActive: true,
            createdAt: '2025-01-15T10:30:00.000Z',
            category: {
              id: 1,
              name: 'Guías Mayores',
              description: 'Categoría para jóvenes de 16 años en adelante',
              code: 'GM'
            }
          },
          {
            id: 2,
            isActive: true,
            createdAt: '2025-01-15T10:30:00.000Z',
            category: {
              id: 2,
              name: 'Conquistadores',
              description: 'Categoría para jóvenes de 10 a 15 años',
              code: 'CONQ'
            }
          }
        ]
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Club no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Club con ID 10 no encontrado',
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
    return this.clubsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('shield'))
  @ApiOperation({
    summary: 'Actualizar un club',
    description: 'Actualiza la información de un club existente, incluyendo sus categorías y el escudo si se proporciona. Las categorías se reemplazan completamente con las nuevas proporcionadas.'
  })
  @ApiParam({ name: 'id', description: 'ID del club', type: Number })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos a actualizar del club. Las categorías se reemplazan completamente.',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Club Maranatha', nullable: true },
        city: { type: 'string', example: 'Barranquilla', nullable: true },
        motto: { type: 'string', example: 'Unidos en Cristo', nullable: true },
        categoryIds: {
          type: 'array',
          items: { type: 'number' },
          example: [1, 3],
          description: 'IDs de categorías a asociar (reemplaza las existentes). 1: Guías Mayores, 2: Conquistadores, 3: Aventureros',
          nullable: true
        },
        shield: { type: 'string', format: 'binary', nullable: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Club actualizado exitosamente',
    schema: {
      example: {
        id: 1,
        name: 'Club Maranatha Renovado',
        city: 'Barranquilla',
        motto: 'Unidos en Cristo para Siempre',
        shieldUrl: 'uploads/shields/club-1-updated.png',
        createdAt: '2025-01-15T10:30:00.000Z',
        updatedAt: '2025-01-20T16:45:00.000Z',
        clubCategories: [
          {
            id: 5,
            isActive: true,
            createdAt: '2025-01-20T16:45:00.000Z',
            category: {
              id: 1,
              name: 'Guías Mayores',
              description: 'Categoría para jóvenes de 16 años en adelante',
              code: 'GM'
            }
          },
          {
            id: 6,
            isActive: true,
            createdAt: '2025-01-20T16:45:00.000Z',
            category: {
              id: 3,
              name: 'Aventureros',
              description: 'Categoría para niños de 6 a 9 años',
              code: 'AVT'
            }
          }
        ]
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Club o categoría no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Club con ID 10 no encontrado',
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
  update(
    @Param('id') id: string,
    @Body() updateClubDto: UpdateClubDto,
    @UploadedFile() shield: Express.Multer.File,
  ) {
    return this.clubsService.update(+id, updateClubDto, shield);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un club',
    description: 'Elimina un club del sistema. Esta acción también elimina todas las relaciones de categorías del club.'
  })
  @ApiParam({ name: 'id', description: 'ID del club', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Club eliminado exitosamente',
    schema: {
      example: {
        message: 'Club eliminado exitosamente'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Club no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Club con ID 10 no encontrado',
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
    return this.clubsService.remove(+id);
  }
}
