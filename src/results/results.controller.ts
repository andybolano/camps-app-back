import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Result } from './entities/result.entity';

@ApiTags('results')
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new result' })
  @ApiResponse({
    status: 201,
    description: 'The result has been successfully created.',
    type: Result,
  })
  create(@Body() createResultDto: CreateResultDto) {
    return this.resultsService.create(createResultDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all results' })
  @ApiResponse({
    status: 200,
    description: 'List of all results.',
    type: [Result],
  })
  findAll() {
    return this.resultsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a result by id' })
  @ApiResponse({
    status: 200,
    description: 'The found result.',
    type: Result,
  })
  findOne(@Param('id') id: string) {
    return this.resultsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a result' })
  @ApiResponse({
    status: 200,
    description: 'The result has been successfully updated.',
    type: Result,
  })
  update(@Param('id') id: string, @Body() updateResultDto: UpdateResultDto) {
    return this.resultsService.update(id, updateResultDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a result' })
  @ApiResponse({
    status: 200,
    description: 'The result has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.resultsService.remove(id);
  }
}
