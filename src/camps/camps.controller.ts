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
import { FileInterceptor } from '@nestjs/platform-express';
import { CampsService } from './camps.service';
import { CreateCampDto } from './dto/create-camp.dto';
import { UpdateCampDto } from './dto/update-camp.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('camps')
@UseGuards(JwtAuthGuard)
export class CampsController {
  constructor(private readonly campsService: CampsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  create(
    @Body() createCampDto: CreateCampDto,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    return this.campsService.create(createCampDto, logo);
  }

  @Get()
  findAll(@Query('relations') relations?: string) {
    const includeRelations = relations === 'true';
    return this.campsService.findAll(includeRelations);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('logo'))
  update(
    @Param('id') id: string,
    @Body() updateCampDto: UpdateCampDto,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    return this.campsService.update(+id, updateCampDto, logo);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campsService.remove(+id);
  }
}
