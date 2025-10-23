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
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CampRegistrationsService } from './camp-registrations.service';
import { CreateCampRegistrationDto } from './dto/create-camp-registration.dto';
import { UpdateCampRegistrationDto } from './dto/update-camp-registration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Camp Registrations')
@ApiBearerAuth()
@Controller('camp-registrations')
@UseGuards(JwtAuthGuard)
export class CampRegistrationsController {
  constructor(
    private readonly registrationsService: CampRegistrationsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar un club a un campamento',
    description: 'Registra una categoría específica de un club a un campamento con todos los detalles de participación y costos'
  })
  @ApiResponse({
    status: 201,
    description: 'Registro creado exitosamente',
    schema: {
      example: {
        id: 1,
        campId: 1,
        clubCategoryId: 1,
        numberOfParticipants: 25,
        numberOfLeaders: 3,
        numberOfGuests: 5,
        totalParticipants: 33,
        totalCost: 1650000,
        isPaid: false,
        paymentDate: null,
        createdAt: '2025-01-18T09:30:00.000Z',
        updatedAt: '2025-01-18T09:30:00.000Z',
        camp: {
          id: 1,
          name: 'Campamento Nacional 2025',
          startDate: '2025-03-15T00:00:00.000Z',
          endDate: '2025-03-18T00:00:00.000Z',
          location: 'Parque Nacional Tayrona'
        },
        clubCategory: {
          id: 1,
          isActive: true,
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
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['campId debe ser un número', 'clubCategoryId no debe estar vacío'],
        error: 'Bad Request'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Campamento o club-categoría no encontrado',
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
  create(@Body() createRegistrationDto: CreateCampRegistrationDto) {
    return this.registrationsService.create(createRegistrationDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar registros de campamento',
    description: 'Obtiene todos los registros o filtra por campamento o club específico'
  })
  @ApiQuery({ name: 'campId', required: false, description: 'Filtrar por ID de campamento', type: Number })
  @ApiQuery({ name: 'clubId', required: false, description: 'Filtrar por ID de club', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Lista de registros obtenida exitosamente',
    schema: {
      example: [
        {
          id: 1,
          campId: 1,
          clubCategoryId: 1,
          numberOfParticipants: 25,
          numberOfLeaders: 3,
          numberOfGuests: 5,
          totalParticipants: 33,
          totalCost: 1650000,
          isPaid: false,
          paymentDate: null,
          createdAt: '2025-01-18T09:30:00.000Z',
          updatedAt: '2025-01-18T09:30:00.000Z',
          camp: {
            id: 1,
            name: 'Campamento Nacional 2025',
            startDate: '2025-03-15T00:00:00.000Z',
            endDate: '2025-03-18T00:00:00.000Z',
            location: 'Parque Nacional Tayrona'
          },
          clubCategory: {
            id: 1,
            isActive: true,
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
        },
        {
          id: 2,
          campId: 1,
          clubCategoryId: 3,
          numberOfParticipants: 18,
          numberOfLeaders: 2,
          numberOfGuests: 3,
          totalParticipants: 23,
          totalCost: 1150000,
          isPaid: true,
          paymentDate: '2025-01-20T00:00:00.000Z',
          createdAt: '2025-01-19T11:15:00.000Z',
          updatedAt: '2025-01-20T14:30:00.000Z',
          camp: {
            id: 1,
            name: 'Campamento Nacional 2025',
            startDate: '2025-03-15T00:00:00.000Z',
            endDate: '2025-03-18T00:00:00.000Z',
            location: 'Parque Nacional Tayrona'
          },
          clubCategory: {
            id: 3,
            isActive: true,
            club: {
              id: 2,
              name: 'Club Centinelas del Rey',
              city: 'Cartagena'
            },
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
  findAll(
    @Query('campId') campId?: string,
    @Query('clubId') clubId?: string,
  ) {
    if (campId) {
      return this.registrationsService.findByCamp(+campId);
    }
    if (clubId) {
      return this.registrationsService.findByClub(+clubId);
    }
    return this.registrationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un registro por ID',
    description: 'Obtiene los detalles completos de un registro específico'
  })
  @ApiParam({ name: 'id', description: 'ID del registro', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Registro encontrado',
    schema: {
      example: {
        id: 1,
        campId: 1,
        clubCategoryId: 1,
        numberOfParticipants: 25,
        numberOfLeaders: 3,
        numberOfGuests: 5,
        totalParticipants: 33,
        totalCost: 1650000,
        isPaid: false,
        paymentDate: null,
        createdAt: '2025-01-18T09:30:00.000Z',
        updatedAt: '2025-01-18T09:30:00.000Z',
        camp: {
          id: 1,
          name: 'Campamento Nacional 2025',
          startDate: '2025-03-15T00:00:00.000Z',
          endDate: '2025-03-18T00:00:00.000Z',
          location: 'Parque Nacional Tayrona'
        },
        clubCategory: {
          id: 1,
          isActive: true,
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
  })
  @ApiResponse({
    status: 404,
    description: 'Registro no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Registro con ID 10 no encontrado',
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
    return this.registrationsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un registro',
    description: 'Actualiza la información de un registro existente (conteos, costos, estado de pago, etc.)'
  })
  @ApiParam({ name: 'id', description: 'ID del registro', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Registro actualizado exitosamente',
    schema: {
      example: {
        id: 1,
        campId: 1,
        clubCategoryId: 1,
        numberOfParticipants: 30,
        numberOfLeaders: 4,
        numberOfGuests: 6,
        totalParticipants: 40,
        totalCost: 2000000,
        isPaid: true,
        paymentDate: '2025-01-22T00:00:00.000Z',
        createdAt: '2025-01-18T09:30:00.000Z',
        updatedAt: '2025-01-22T15:45:00.000Z',
        camp: {
          id: 1,
          name: 'Campamento Nacional 2025',
          startDate: '2025-03-15T00:00:00.000Z',
          endDate: '2025-03-18T00:00:00.000Z',
          location: 'Parque Nacional Tayrona'
        },
        clubCategory: {
          id: 1,
          isActive: true,
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
  })
  @ApiResponse({
    status: 404,
    description: 'Registro no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Registro con ID 10 no encontrado',
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
    @Body() updateRegistrationDto: UpdateCampRegistrationDto,
  ) {
    return this.registrationsService.update(+id, updateRegistrationDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un registro',
    description: 'Elimina un registro de campamento del sistema'
  })
  @ApiParam({ name: 'id', description: 'ID del registro', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Registro eliminado exitosamente',
    schema: {
      example: {
        message: 'Registro eliminado exitosamente'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Registro no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Registro con ID 10 no encontrado',
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
    return this.registrationsService.remove(+id);
  }
}
