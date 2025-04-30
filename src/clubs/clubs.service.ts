import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Club } from './entities/club.entity';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { CampsService } from '../camps/camps.service';
import { FilesService } from '../common/services/files.service';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club)
    private clubsRepository: Repository<Club>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private campsService: CampsService,
    private filesService: FilesService,
  ) {}

  async create(
    createClubDto: CreateClubDto,
    shield?: Express.Multer.File,
    userRole?: UserRole,
    userId?: number,
  ): Promise<Club> {
    if (userRole !== UserRole.DIRECTOR) {
      throw new ForbiddenException('Solo los directores pueden crear clubes');
    }

    const club = this.clubsRepository.create(createClubDto);

    if (shield) {
      const shieldPath = await this.filesService.saveFile(shield, 'clubs');
      club.shield = shieldPath;
    }

    if (userId) {
      const director = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!director) {
        throw new NotFoundException('Director not found');
      }
      club.director = director;
    }

    return this.clubsRepository.save(club);
  }

  async findAll(): Promise<Club[]> {
    return this.clubsRepository.find({
      relations: ['camps', 'director'],
    });
  }

  async findByCamp(campId: string): Promise<Club[]> {
    return this.clubsRepository.find({
      where: { camps: { id: campId } },
      relations: ['camps', 'director'],
    });
  }

  async findOne(id: string): Promise<Club> {
    const club = await this.clubsRepository.findOne({
      where: { id },
      relations: ['camps', 'members', 'users'],
    });

    if (!club) {
      throw new NotFoundException(`Club with ID ${id} not found`);
    }

    return club;
  }

  async update(
    id: string,
    updateClubDto: UpdateClubDto,
    shield?: Express.Multer.File,
  ): Promise<Club> {
    const club = await this.findOne(id);

    if (shield) {
      if (club.shield) {
        await this.filesService.deleteFile(club.shield);
      }

      const shieldPath = await this.filesService.saveFile(shield, 'clubs');
      club.shield = shieldPath;
    }

    Object.assign(club, updateClubDto);

    return this.clubsRepository.save(club);
  }

  async remove(id: string): Promise<void> {
    const club = await this.clubsRepository.findOne({
      where: { id },
      relations: ['camps', 'members', 'users'],
    });

    if (!club) {
      throw new NotFoundException(`Club with ID ${id} not found`);
    }

    if (club.shield) {
      await this.filesService.deleteFile(club.shield);
    }

    if (club.users) {
      club.users = [];
      await this.clubsRepository.save(club);
    }

    if (club.camps) {
      club.camps = [];
      await this.clubsRepository.save(club);
    }

    await this.clubsRepository.remove(club);
  }

  async associateWithCamp(clubId: string, campId: string): Promise<Club> {
    const club = await this.findOne(clubId);
    const camp = await this.campsService.findOne(campId);

    if (!club.camps) {
      club.camps = [];
    }

    if (!club.camps.some((c) => c.id === camp.id)) {
      club.camps.push(camp);
      return this.clubsRepository.save(club);
    }

    return club;
  }

  async removeFromCamp(clubId: string, campId: string): Promise<Club> {
    const club = await this.findOne(clubId);

    if (club.camps) {
      club.camps = club.camps.filter((camp) => camp.id !== campId);
      return this.clubsRepository.save(club);
    }

    return club;
  }

  async findByUserId(userId: number): Promise<Club[]> {
    const clubs = await this.clubsRepository.find({
      where: [{ users: { id: userId } }, { director: { id: userId } }],
      relations: ['camps', 'members', 'users', 'director'],
    });

    return clubs || [];
  }
}
