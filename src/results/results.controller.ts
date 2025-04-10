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
import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('results')
@UseGuards(JwtAuthGuard)
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  create(@Body() createResultDto: CreateResultDto) {
    return this.resultsService.create(createResultDto);
  }

  @Get()
  findAll(
    @Query('clubId') clubId?: string,
    @Query('eventId') eventId?: string,
    @Query('campId') campId?: string,
  ) {
    if (eventId && clubId) {
      console.log(
        `[DEBUG] Consultando resultados para eventId=${eventId} y clubId=${clubId}`,
      );
      return this.resultsService.findByEventAndClub(+eventId, +clubId);
    }
    
    if (clubId) {
      return this.resultsService.findByClub(+clubId);
    }
    if (eventId) {
      return this.resultsService.findByEvent(+eventId);
    }
    if (campId) {
      return this.resultsService.findByCamp(+campId);
    }
    return this.resultsService.findAll();
  }

  @Get('ranking/:campId')
  getClubRankingByCamp(@Param('campId') campId: string) {
    return this.resultsService.getClubRankingByCamp(+campId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResultDto: UpdateResultDto) {
    return this.resultsService.update(+id, updateResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resultsService.remove(+id);
  }
}
