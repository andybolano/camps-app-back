import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Club } from './entities/club.entity';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { CampsService } from '../camps/camps.service';
import { FilesService } from '../common/services/files.service';
import { Result } from '../results/entities/result.entity';
import { ResultItem } from '../results/entities/result-item.entity';
import { ResultMemberBasedItem } from '../results/entities/result-member-based-item.entity';

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club)
    private clubsRepository: Repository<Club>,
    @InjectRepository(Result)
    private resultsRepository: Repository<Result>,
    @InjectRepository(ResultItem)
    private resultItemsRepository: Repository<ResultItem>,
    @InjectRepository(ResultMemberBasedItem)
    private resultMemberBasedItemsRepository: Repository<ResultMemberBasedItem>,
    private campsService: CampsService,
    private filesService: FilesService,
  ) {}

  async create(
    createClubDto: CreateClubDto,
    shield?: Express.Multer.File,
  ): Promise<Club> {
    const { campId, ...clubData } = createClubDto;

    // Find the referenced camp
    const camp = await this.campsService.findOne(campId);

    // Create the club
    const club = this.clubsRepository.create({
      ...clubData,
      camp,
    });

    // If shield is provided, save it
    if (shield) {
      const shieldUrl = await this.filesService.saveFile(
        shield,
        'club-shields',
      );
      club.shieldUrl = shieldUrl;
    }

    return this.clubsRepository.save(club);
  }

  async findAll(): Promise<Club[]> {
    return this.clubsRepository.find({
      relations: ['camp', 'memberCharacteristics'],
    });
  }

  async findByCamp(campId: number): Promise<Club[]> {
    return this.clubsRepository.find({
      where: { camp: { id: campId } },
      relations: ['camp', 'memberCharacteristics'],
    });
  }

  async findOne(id: number): Promise<Club> {
    const club = await this.clubsRepository.findOne({
      where: { id },
      relations: ['camp', 'results', 'memberCharacteristics'],
    });

    if (!club) {
      throw new NotFoundException(`Club with ID ${id} not found`);
    }

    return club;
  }

  async update(
    id: number,
    updateClubDto: UpdateClubDto,
    shield?: Express.Multer.File,
  ): Promise<Club> {
    const club = await this.findOne(id);

    // Handle camp update if campId is provided
    if (updateClubDto.campId) {
      const camp = await this.campsService.findOne(updateClubDto.campId);
      const { ...clubData } = updateClubDto;
      Object.assign(club, clubData);
      club.camp = camp;
    } else {
      Object.assign(club, updateClubDto);
    }

    // If a new shield is provided
    if (shield) {
      // Delete the old shield if it exists
      if (club.shieldUrl) {
        await this.filesService.deleteFile(club.shieldUrl).catch((error) => {
          console.error(`Error al eliminar escudo anterior: ${error.message}`);
          // No interrumpimos la actualización si hay error al eliminar
        });
      }

      // Save the new shield
      const shieldUrl = await this.filesService.saveFile(
        shield,
        'club-shields',
      );
      club.shieldUrl = shieldUrl;
    }

    return this.clubsRepository.save(club);
  }

  async remove(id: number): Promise<void> {
    try {
      // Cargar el club con todos sus resultados y sus elementos relacionados
      const club = await this.clubsRepository.findOne({
        where: { id },
        relations: [
          'camp',
          'results',
          'results.items',
          'results.memberBasedItems',
          'memberCharacteristics'
        ],
      });

      if (!club) {
        throw new NotFoundException(`Club with ID ${id} not found`);
      }

      // Eliminar todos los datos relacionados al club en cascada manual
      if (club.results && club.results.length > 0) {
        const resultIds = club.results.map(result => result.id);
        
        // 1. Eliminar todos los result_items
        await this.resultItemsRepository
          .createQueryBuilder()
          .delete()
          .where('resultId IN (:...resultIds)', { resultIds })
          .execute();
        
        // 2. Eliminar todos los result_member_based_items
        await this.resultMemberBasedItemsRepository
          .createQueryBuilder()
          .delete()
          .where('resultId IN (:...resultIds)', { resultIds })
          .execute();
        
        // 3. Eliminar los results
        await this.resultsRepository.delete(resultIds);
        
        console.log(`Se eliminaron ${club.results.length} resultado(s) y todos sus elementos asociados al club "${club.name}"`);
      }

      // Delete the shield if it exists
      if (club.shieldUrl) {
        await this.filesService.deleteFile(club.shieldUrl).catch((error) => {
          console.error(`Error al eliminar escudo: ${error.message}`);
          // No interrumpimos la eliminación si hay error al eliminar
        });
      }

      // Eliminar el club
      const result = await this.clubsRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Club with ID ${id} not found`);
      }

      console.log(`Club "${club.name}" eliminado exitosamente junto con todos sus datos asociados`);
    } catch (error) {
      console.error('Error al eliminar club:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error al eliminar el club: ${error.message}`);
    }
  }
}
