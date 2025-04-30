import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AssociationsService } from './associations.service';
import { CreateAssociationDto } from './dto/create-association.dto';
import { UpdateAssociationDto } from './dto/update-association.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Association } from './entities/association.entity';

@ApiTags('Associations')
@Controller('associations')
export class AssociationsController {
  constructor(private readonly associationsService: AssociationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new association' })
  @ApiResponse({
    status: 201,
    description: 'The association has been successfully created.',
    type: Association,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: CreateAssociationDto })
  create(@Body() createAssociationDto: CreateAssociationDto) {
    return this.associationsService.create(createAssociationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all associations' })
  @ApiResponse({
    status: 200,
    description: 'Return all associations.',
    type: [Association],
  })
  findAll() {
    return this.associationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an association by id' })
  @ApiParam({ name: 'id', description: 'Association ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the association.',
    type: Association,
  })
  @ApiResponse({ status: 404, description: 'Association not found.' })
  findOne(@Param('id') id: string) {
    return this.associationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an association' })
  @ApiParam({ name: 'id', description: 'Association ID' })
  @ApiResponse({
    status: 200,
    description: 'The association has been successfully updated.',
    type: Association,
  })
  @ApiResponse({ status: 404, description: 'Association not found.' })
  @ApiBody({ type: UpdateAssociationDto })
  update(
    @Param('id') id: string,
    @Body() updateAssociationDto: UpdateAssociationDto,
  ) {
    return this.associationsService.update(id, updateAssociationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an association' })
  @ApiParam({ name: 'id', description: 'Association ID' })
  @ApiResponse({
    status: 200,
    description: 'The association has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Association not found.' })
  remove(@Param('id') id: string) {
    return this.associationsService.remove(id);
  }
}
