import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Club } from './entities/club.entity';
import { ClubCategory } from './entities/club-category.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { FilesService } from '../common/services/files.service';

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club)
    private clubsRepository: Repository<Club>,
    @InjectRepository(ClubCategory)
    private clubCategoryRepository: Repository<ClubCategory>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private filesService: FilesService,
  ) {}

  async create(
    createClubDto: CreateClubDto,
    shield?: Express.Multer.File,
  ): Promise<Club> {
    const { categoryIds, ...clubData } = createClubDto;
    const club = this.clubsRepository.create(clubData);

    // If shield is provided, save it
    if (shield) {
      const shieldUrl = await this.filesService.saveFile(
        shield,
        'club-shields',
      );
      club.shieldUrl = shieldUrl;
    }

    // Save the club first
    const savedClub = await this.clubsRepository.save(club);

    // If categoryIds are provided, create the club-category relationships
    if (categoryIds && categoryIds.length > 0) {
      await this.updateClubCategories(savedClub.id, categoryIds);
    }

    // Return the club with its categories
    return this.findOne(savedClub.id);
  }

  async findAll(): Promise<Club[]> {
    return this.clubsRepository.find({
      relations: ['clubCategories', 'clubCategories.category'],
    });
  }

  async findOne(id: number): Promise<Club> {
    const club = await this.clubsRepository.findOne({
      where: { id },
      relations: ['clubCategories', 'clubCategories.category'],
    });

    if (!club) {
      throw new NotFoundException(`Club with ID ${id} not found`);
    }

    return club;
  }

  async findByCategory(categoryId: number): Promise<Club[]> {
    // Verificar que la categoría existe
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId, isActive: true },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${categoryId} not found or is not active`,
      );
    }

    // Buscar clubes que tengan esta categoría activa
    const clubs = await this.clubsRepository
      .createQueryBuilder('club')
      .leftJoinAndSelect('club.clubCategories', 'clubCategory')
      .leftJoinAndSelect('clubCategory.category', 'category')
      .where('clubCategory.categoryId = :categoryId', { categoryId })
      .andWhere('clubCategory.isActive = :isActive', { isActive: true })
      .getMany();

    return clubs;
  }

  async update(
    id: number,
    updateClubDto: UpdateClubDto,
    shield?: Express.Multer.File,
  ): Promise<Club> {
    const { categoryIds, ...clubData } = updateClubDto;
    const club = await this.findOne(id);

    Object.assign(club, clubData);

    // If a new shield is provided
    if (shield) {
      // Delete the old shield if it exists
      if (club.shieldUrl) {
        await this.filesService.deleteFile(club.shieldUrl).catch((error) => {
          console.error(`Error al eliminar escudo anterior: ${error.message}`);
        });
      }

      // Save the new shield
      const shieldUrl = await this.filesService.saveFile(
        shield,
        'club-shields',
      );
      club.shieldUrl = shieldUrl;
    }

    // Save the club data
    await this.clubsRepository.save(club);

    // If categoryIds are provided, update the club-category relationships
    if (categoryIds !== undefined) {
      await this.updateClubCategories(id, categoryIds);
    }

    // Return the club with its updated categories
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const club = await this.clubsRepository.findOne({
      where: { id },
      relations: ['clubCategories'],
    });

    if (!club) {
      throw new NotFoundException(`Club with ID ${id} not found`);
    }

    // Delete the shield if it exists
    if (club.shieldUrl) {
      await this.filesService.deleteFile(club.shieldUrl).catch((error) => {
        console.error(`Error al eliminar escudo: ${error.message}`);
      });
    }

    // Delete the club (cascade will handle clubCategories)
    const result = await this.clubsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Club with ID ${id} not found`);
    }
  }

  /**
   * Private method to update club categories
   * Replaces all existing categories with the new ones
   */
  private async updateClubCategories(
    clubId: number,
    categoryIds: number[],
  ): Promise<void> {
    // Delete all existing club-category relationships
    await this.clubCategoryRepository.delete({ club: { id: clubId } });

    // Create new club-category relationships
    for (const categoryId of categoryIds) {
      // Verify category exists
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }

      // Create the club-category relationship
      const clubCategory = this.clubCategoryRepository.create({
        club: { id: clubId } as Club,
        category: { id: categoryId } as Category,
        isActive: true,
      });

      await this.clubCategoryRepository.save(clubCategory);
    }
  }
}
