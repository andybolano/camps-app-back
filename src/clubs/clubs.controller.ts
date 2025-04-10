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
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('clubs')
@UseGuards(JwtAuthGuard)
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('shield'))
  create(
    @Body() createClubDto: CreateClubDto,
    @UploadedFile() shield: Express.Multer.File,
  ) {
    if (
      createClubDto.isPaid !== undefined &&
      typeof createClubDto.isPaid === 'string'
    ) {
      createClubDto.isPaid =
        createClubDto.isPaid === '1' || createClubDto.isPaid === 'true';
    }
    console.log('Creating club with isPaid:', createClubDto.isPaid);
    return this.clubsService.create(createClubDto, shield);
  }

  @Get()
  findAll(@Query('campId') campId?: string) {
    if (campId) {
      return this.clubsService.findByCamp(+campId);
    }
    return this.clubsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clubsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('shield'))
  update(
    @Param('id') id: string,
    @Body() updateClubDto: UpdateClubDto,
    @UploadedFile() shield: Express.Multer.File,
  ) {
    if (
      updateClubDto.isPaid !== undefined &&
      typeof updateClubDto.isPaid === 'string'
    ) {
      updateClubDto.isPaid =
        updateClubDto.isPaid === '1' || updateClubDto.isPaid === 'true';
    }
    console.log('Updating club with isPaid:', updateClubDto.isPaid);
    return this.clubsService.update(+id, updateClubDto, shield);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clubsService.remove(+id);
  }
}
