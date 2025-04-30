import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Association } from './entities/association.entity';
import { CreateAssociationDto } from './dto/create-association.dto';
import { UpdateAssociationDto } from './dto/update-association.dto';

@Injectable()
export class AssociationsService {
  constructor(
    @InjectRepository(Association)
    private associationsRepository: Repository<Association>,
  ) {}

  async create(
    createAssociationDto: CreateAssociationDto,
  ): Promise<Association> {
    const association =
      this.associationsRepository.create(createAssociationDto);
    return await this.associationsRepository.save(association);
  }

  async findAll(): Promise<Association[]> {
    return await this.associationsRepository.find();
  }

  async findOne(id: string): Promise<Association> {
    const association = await this.associationsRepository.findOne({
      where: { id },
    });
    if (!association) {
      throw new NotFoundException(`Association with ID ${id} not found`);
    }
    return association;
  }

  async update(
    id: string,
    updateAssociationDto: UpdateAssociationDto,
  ): Promise<Association> {
    const association = await this.findOne(id);
    Object.assign(association, updateAssociationDto);
    return await this.associationsRepository.save(association);
  }

  async remove(id: string): Promise<void> {
    const result = await this.associationsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Association with ID ${id} not found`);
    }
  }
}
