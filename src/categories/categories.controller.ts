import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todas las categorías',
    description:
      'Obtiene una lista de todas las categorías activas disponibles en el sistema (Guías Mayores, Conquistadores, Aventureros)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías obtenida exitosamente',
    schema: {
      example: [
        {
          id: 1,
          name: 'Guías Mayores',
          description: 'Categoría para jóvenes de 16 años en adelante',
          code: 'GM',
          isActive: true,
        },
        {
          id: 2,
          name: 'Conquistadores',
          description: 'Categoría para niños y adolescentes de 10 a 15 años',
          code: 'CQ',
          isActive: true,
        },
        {
          id: 3,
          name: 'Aventureros',
          description: 'Categoría para niños de 6 a 9 años',
          code: 'AV',
          isActive: true,
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
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una categoría por ID',
    description: 'Obtiene los detalles de una categoría específica por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la categoría',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría encontrada',
    schema: {
      example: {
        id: 1,
        name: 'Guías Mayores',
        description: 'Categoría para jóvenes de 16 años en adelante',
        code: 'GM',
        isActive: true,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Categoría no encontrada',
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
    return this.categoriesService.findOne(+id);
  }
}
