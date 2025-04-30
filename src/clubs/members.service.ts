import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Club } from './entities/club.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Club)
    private readonly clubRepository: Repository<Club>,
  ) {}

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    // Check if member with same identification already exists
    const existingMember = await this.memberRepository.findOne({
      where: { identification: createMemberDto.identification },
    });

    if (existingMember) {
      throw new ConflictException(
        'A member with this identification already exists',
      );
    }

    // Check if club exists
    const club = await this.clubRepository.findOne({
      where: { id: createMemberDto.clubId },
    });

    if (!club) {
      throw new NotFoundException('Club not found');
    }

    const member = this.memberRepository.create({
      ...createMemberDto,
      club,
    });

    return this.memberRepository.save(member);
  }

  async findAll(): Promise<Member[]> {
    return this.memberRepository.find({
      relations: ['club'],
    });
  }

  async findOne(id: string): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: { id },
      relations: ['club'],
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return member;
  }

  async update(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const member = await this.findOne(id);

    if (
      updateMemberDto.identification &&
      updateMemberDto.identification !== member.identification
    ) {
      const existingMember = await this.memberRepository.findOne({
        where: { identification: updateMemberDto.identification },
      });

      if (existingMember) {
        throw new ConflictException(
          'A member with this identification already exists',
        );
      }
    }

    if (updateMemberDto.clubId) {
      const club = await this.clubRepository.findOne({
        where: { id: updateMemberDto.clubId },
      });

      if (!club) {
        throw new NotFoundException('Club not found');
      }

      member.club = club;
    }

    Object.assign(member, updateMemberDto);
    return this.memberRepository.save(member);
  }

  async remove(id: string): Promise<void> {
    const member = await this.findOne(id);
    await this.memberRepository.remove(member);
  }

  async findByClub(clubId: string): Promise<Member[]> {
    // Check if club exists
    const club = await this.clubRepository.findOne({
      where: { id: clubId },
    });

    if (!club) {
      throw new NotFoundException('Club not found');
    }

    return this.memberRepository.find({
      where: { club: { id: clubId } },
      relations: ['club'],
    });
  }
}
