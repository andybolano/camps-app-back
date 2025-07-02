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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ResultItem } from './entities/result-item.entity';

@ApiTags('results')
@Controller('results')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  @ApiOperation({ summary: 'Create result items for a club' })
  @ApiResponse({
    status: 201,
    description: 'Result items created successfully',
    type: [ResultItem],
  })
  create(@Body() createResultDto: CreateResultDto) {
    return this.resultsService.create(createResultDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all result items' })
  @ApiResponse({
    status: 200,
    description: 'List of all result items',
    type: [ResultItem],
  })
  findAll() {
    return this.resultsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a result item by id' })
  @ApiResponse({
    status: 200,
    description: 'The found result item',
    type: ResultItem,
  })
  findOne(@Param('id') id: string) {
    return this.resultsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a result item' })
  @ApiResponse({
    status: 200,
    description: 'Result item updated successfully',
    type: ResultItem,
  })
  update(@Param('id') id: string, @Body() updateResultDto: UpdateResultDto) {
    return this.resultsService.update(id, updateResultDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a result item' })
  @ApiResponse({ status: 200, description: 'Result item deleted successfully' })
  remove(@Param('id') id: string) {
    return this.resultsService.remove(id);
  }
}
