import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Camp } from './entities/camp.entity';
import { CreateCampDto } from './dto/create-camp.dto';
import { UpdateCampDto } from './dto/update-camp.dto';
import { FilesService } from '../common/services/files.service';

@Injectable()
export class CampsService {
  constructor(
    @InjectRepository(Camp)
    private campsRepository: Repository<Camp>,
    private filesService: FilesService,
  ) {}

  async create(
    createCampDto: CreateCampDto,
    logo?: Express.Multer.File,
  ): Promise<Camp> {
    const camp = this.campsRepository.create(createCampDto);

    // Si se proporciona un logo, guardarlo
    if (logo) {
      const logoUrl = await this.filesService.saveFile(logo, 'camps');
      camp.logoUrl = logoUrl;
    }

    return this.campsRepository.save(camp);
  }

  async findAll(includeRelations = false): Promise<Camp[]> {
    if (includeRelations) {
      return this.campsRepository.find({
        relations: ['clubs', 'events'],
      });
    }
    return this.campsRepository.find();
  }

  async findOne(id: number): Promise<Camp> {
    const camp = await this.campsRepository.findOne({
      where: { id },
      relations: ['clubs', 'events'],
    });

    if (!camp) {
      throw new NotFoundException(`Camp with ID ${id} not found`);
    }

    return camp;
  }

  async update(
    id: number,
    updateCampDto: UpdateCampDto,
    logo?: Express.Multer.File,
  ): Promise<Camp> {
    const camp = await this.findOne(id);

    // Si se proporciona un nuevo logo
    if (logo) {
      // Eliminar el logo anterior si existe
      if (camp.logoUrl) {
        await this.filesService.deleteFile(camp.logoUrl).catch((error) => {
          console.error(`Error al eliminar logo anterior: ${error.message}`);
          // No lanzamos el error para continuar con la actualización
        });
      }

      // Guardar el nuevo logo
      const logoUrl = await this.filesService.saveFile(logo, 'camps');
      updateCampDto.logoUrl = logoUrl;
    }

    Object.assign(camp, updateCampDto);
    return this.campsRepository.save(camp);
  }

  async remove(id: number): Promise<void> {
    // Primero buscar el campamento con sus relaciones
    const camp = await this.findOne(id);

    // Verificar si tiene clubes o eventos relacionados
    if (
      (camp.clubs && camp.clubs.length > 0) ||
      (camp.events && camp.events.length > 0)
    ) {
      throw new BadRequestException(
        'No se puede eliminar el campamento porque tiene clubes o eventos relacionados.',
      );
    }

    // Eliminar el logo si existe
    if (camp.logoUrl) {
      await this.filesService.deleteFile(camp.logoUrl).catch((error) => {
        console.error(`Error al eliminar logo: ${error.message}`);
        // No lanzamos el error para continuar con la eliminación
      });
    }

    // Si no tiene relaciones, proceder con la eliminación
    const result = await this.campsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Camp with ID ${id} not found`);
    }
  }
}
