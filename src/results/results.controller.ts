import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('results')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new result item' })
  @ApiResponse({
    status: 201,
    description: 'The result item has been successfully created.',
  })
  create(@Body() createResultDto: CreateResultDto) {
    return this.resultsService.create(createResultDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all result items' })
  @ApiResponse({
    status: 200,
    description: 'List of all result items.',
  })
  findAll() {
    return this.resultsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a result item by id' })
  @ApiResponse({
    status: 200,
    description: 'The found result item.',
  })
  findOne(@Param('id') id: string) {
    return this.resultsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a result item' })
  @ApiResponse({
    status: 200,
    description: 'The result item has been successfully updated.',
  })
  update(@Param('id') id: string, @Body() updateResultDto: UpdateResultDto) {
    return this.resultsService.update(id, updateResultDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a result item' })
  @ApiResponse({
    status: 200,
    description: 'The result item has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.resultsService.remove(id);
  }
}
