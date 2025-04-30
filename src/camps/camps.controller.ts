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
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CampsService } from './camps.service';
import { CreateCampDto } from './dto/create-camp.dto';
import { UpdateCampDto } from './dto/update-camp.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Camp } from './entities/camp.entity';

@ApiTags('camps')
@Controller('camps')
@UseGuards(JwtAuthGuard)
export class CampsController {
  constructor(private readonly campsService: CampsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  @ApiOperation({ summary: 'Create a new camp' })
  @ApiResponse({
    status: 201,
    description: 'The camp has been successfully created.',
    type: Camp,
  })
  create(
    @Body() createCampDto: CreateCampDto,
    @UploadedFile() logo?: Express.Multer.File,
    @Request() req?: any,
  ) {
    return this.campsService.create(createCampDto, logo, req?.user?.role);
  }

  @Get()
  @ApiOperation({ summary: 'Get all camps' })
  @ApiResponse({
    status: 200,
    description: 'List of all camps.',
    type: [Camp],
  })
  findAll(@Query('relations') relations?: string) {
    const includeRelations = relations === 'true';
    return this.campsService.findAll(includeRelations);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a camp by id' })
  @ApiResponse({
    status: 200,
    description: 'The found camp.',
    type: Camp,
  })
  findOne(@Param('id') id: string) {
    return this.campsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('logo'))
  @ApiOperation({ summary: 'Update a camp' })
  @ApiResponse({
    status: 200,
    description: 'The camp has been successfully updated.',
    type: Camp,
  })
  update(
    @Param('id') id: string,
    @Body() updateCampDto: UpdateCampDto,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    return this.campsService.update(id, updateCampDto, logo);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a camp' })
  @ApiResponse({
    status: 200,
    description: 'The camp has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.campsService.remove(id);
  }
}
