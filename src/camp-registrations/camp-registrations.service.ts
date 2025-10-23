import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CampRegistration } from './entities/camp-registration.entity';
import { CreateCampRegistrationDto } from './dto/create-camp-registration.dto';
import { UpdateCampRegistrationDto } from './dto/update-camp-registration.dto';
import { CampsService } from '../camps/camps.service';
import { ClubCategory } from '../clubs/entities/club-category.entity';

@Injectable()
export class CampRegistrationsService {
  constructor(
    @InjectRepository(CampRegistration)
    private registrationsRepository: Repository<CampRegistration>,
    @InjectRepository(ClubCategory)
    private clubCategoryRepository: Repository<ClubCategory>,
    private campsService: CampsService,
  ) {}

  async create(
    createRegistrationDto: CreateCampRegistrationDto,
  ): Promise<CampRegistration> {
    const { campId, clubId, categoryId, ...registrationData } =
      createRegistrationDto;

    // Verify camp exists
    const camp = await this.campsService.findOne(campId);

    // Verify that the camp's target category matches the requested category
    if (camp.targetCategory.id !== categoryId) {
      throw new NotFoundException(
        `This camp is for category ${camp.targetCategory.name} (ID: ${camp.targetCategory.id}), not for category ID ${categoryId}`,
      );
    }

    // Find the club category relationship
    const clubCategory = await this.clubCategoryRepository.findOne({
      where: {
        club: { id: clubId },
        category: { id: categoryId },
        isActive: true,
      },
      relations: ['club', 'category'],
    });

    if (!clubCategory) {
      throw new NotFoundException(
        `Club with ID ${clubId} does not have an active category with ID ${categoryId}. Please verify that the club has this category assigned.`,
      );
    }

    // Check if this club is already registered for this camp in this category
    const existingRegistration = await this.registrationsRepository.findOne({
      where: {
        camp: { id: campId },
        clubCategory: { id: clubCategory.id },
      },
    });

    if (existingRegistration) {
      throw new NotFoundException(
        `Club ${clubCategory.club.name} (${clubCategory.category.name}) is already registered for this camp`,
      );
    }

    const registration = this.registrationsRepository.create({
      ...registrationData,
      registrationFee: registrationData.registrationFee ?? 0,
      camp,
      clubCategory,
    });

    return this.registrationsRepository.save(registration);
  }

  async findAll(): Promise<CampRegistration[]> {
    return this.registrationsRepository.find({
      relations: ['camp', 'clubCategory', 'clubCategory.club', 'clubCategory.category'],
    });
  }

  async findByCamp(campId: number): Promise<CampRegistration[]> {
    return this.registrationsRepository.find({
      where: { camp: { id: campId } },
      relations: ['clubCategory', 'clubCategory.club', 'clubCategory.category'],
    });
  }

  async findByClub(clubId: number): Promise<CampRegistration[]> {
    return this.registrationsRepository.find({
      where: { clubCategory: { club: { id: clubId } } },
      relations: ['camp', 'clubCategory', 'clubCategory.category'],
    });
  }

  async findOne(id: number): Promise<CampRegistration> {
    const registration = await this.registrationsRepository.findOne({
      where: { id },
      relations: ['camp', 'clubCategory', 'clubCategory.club', 'clubCategory.category'],
    });

    if (!registration) {
      throw new NotFoundException(`Registration with ID ${id} not found`);
    }

    return registration;
  }

  async update(
    id: number,
    updateRegistrationDto: UpdateCampRegistrationDto,
  ): Promise<CampRegistration> {
    const registration = await this.findOne(id);
    Object.assign(registration, updateRegistrationDto);
    return this.registrationsRepository.save(registration);
  }

  async remove(id: number): Promise<void> {
    const result = await this.registrationsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Registration with ID ${id} not found`);
    }
  }
}
