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
    const { campId, clubCategoryId, ...registrationData } =
      createRegistrationDto;

    // Verify camp exists
    const camp = await this.campsService.findOne(campId);

    // Verify club category exists
    const clubCategory = await this.clubCategoryRepository.findOne({
      where: { id: clubCategoryId },
      relations: ['club', 'category'],
    });

    if (!clubCategory) {
      throw new NotFoundException(
        `ClubCategory with ID ${clubCategoryId} not found`,
      );
    }

    const registration = this.registrationsRepository.create({
      ...registrationData,
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
