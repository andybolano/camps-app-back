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
  Put,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { AssociateClubCampDto } from './dto/associate-club-camp.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBody,
  ApiConsumes,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Club } from './entities/club.entity';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('clubs')
@Controller('clubs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Get('my-club')
  @ApiOperation({ summary: "Get the authenticated user's clubs" })
  @ApiResponse({
    status: 200,
    description: 'Clubs found or empty array if no clubs',
    type: [Club],
  })
  async getMyClub(@Request() req) {
    if (!req.user || !req.user.userId) {
      throw new ForbiddenException('Usuario no autenticado');
    }
    return this.clubsService.findByUserId(req.user.userId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('shield'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateClubDto })
  @ApiResponse({
    status: 201,
    description: 'Club created successfully',
    type: Club,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body() createClubDto: CreateClubDto,
    @Request() req: any,
    @UploadedFile() shield?: Express.Multer.File,
  ) {
    if (!req.user || !req.user.userId) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    if (req.user.role !== UserRole.DIRECTOR) {
      throw new ForbiddenException('Solo los directores pueden crear clubes');
    }

    return this.clubsService.create(
      createClubDto,
      shield,
      req.user.role,
      req.user.userId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all clubs' })
  @ApiResponse({
    status: 200,
    description: 'List of all clubs.',
    type: [Club],
  })
  findAll(@Query('campId') campId?: string) {
    if (campId) {
      return this.clubsService.findByCamp(campId);
    }
    return this.clubsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a club by id' })
  @ApiResponse({
    status: 200,
    description: 'The found club.',
    type: Club,
  })
  findOne(@Param('id') id: string) {
    return this.clubsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('shield'))
  @ApiOperation({ summary: 'Update a club' })
  @ApiResponse({
    status: 200,
    description: 'The club has been successfully updated.',
    type: Club,
  })
  update(
    @Param('id') id: string,
    @Body() updateClubDto: UpdateClubDto,
    @UploadedFile() shield?: Express.Multer.File,
  ) {
    return this.clubsService.update(id, updateClubDto, shield);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a club' })
  @ApiResponse({
    status: 200,
    description: 'The club has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.clubsService.remove(id);
  }

  @Put(':id/associate-camp')
  associateWithCamp(
    @Param('id') id: string,
    @Body() associateClubCampDto: AssociateClubCampDto,
  ) {
    return this.clubsService.associateWithCamp(id, associateClubCampDto.campId);
  }

  @Delete(':id/camp/:campId')
  removeFromCamp(@Param('id') id: string, @Param('campId') campId: string) {
    return this.clubsService.removeFromCamp(id, campId);
  }
}
