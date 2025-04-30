import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberResponseDto } from './dto/member-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { MemberType, MemberStatus } from './entities/member.entity';

@ApiTags('members')
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new member' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          example: 'Juan',
          description: 'First name of the member',
        },
        lastName: {
          type: 'string',
          example: 'Pérez',
          description: 'Last name of the member',
        },
        identification: {
          type: 'string',
          example: '123456789',
          description: 'Unique identification number',
        },
        birthDate: {
          type: 'string',
          format: 'date',
          example: '2000-01-01',
          description: 'Date of birth',
        },
        type: {
          type: 'string',
          enum: Object.values(MemberType),
          example: MemberType.BAPTIZED,
          description: 'Type of member',
        },
        status: {
          type: 'string',
          enum: Object.values(MemberStatus),
          example: MemberStatus.ACTIVE,
          description: 'Status of the member',
        },
        clubId: {
          type: 'string',
          format: 'uuid',
          example: '123e4567-e89b-12d3-a456-426614174000',
          description: 'UUID of the club the member belongs to',
        },
      },
      required: [
        'firstName',
        'lastName',
        'identification',
        'birthDate',
        'type',
        'status',
        'clubId',
      ],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Member created successfully',
    type: MemberResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Club not found' })
  @ApiResponse({
    status: 409,
    description: 'Member with this identification already exists',
  })
  async create(
    @Body() createMemberDto: CreateMemberDto,
  ): Promise<MemberResponseDto> {
    const member = await this.membersService.create(createMemberDto);
    return this.mapToResponseDto(member);
  }

  @Get()
  @ApiOperation({ summary: 'Get all members' })
  @ApiResponse({
    status: 200,
    description: 'List of all members',
    type: [MemberResponseDto],
  })
  async findAll(): Promise<MemberResponseDto[]> {
    const members = await this.membersService.findAll();
    return members.map((member) => this.mapToResponseDto(member));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a member by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Member ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Member found',
    type: MemberResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Member not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MemberResponseDto> {
    const member = await this.membersService.findOne(id);
    return this.mapToResponseDto(member);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a member' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Member ID',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          example: 'Juan',
          description: 'First name of the member',
        },
        lastName: {
          type: 'string',
          example: 'Pérez',
          description: 'Last name of the member',
        },
        identification: {
          type: 'string',
          example: '123456789',
          description: 'Unique identification number',
        },
        birthDate: {
          type: 'string',
          format: 'date',
          example: '2000-01-01',
          description: 'Date of birth',
        },
        type: {
          type: 'string',
          enum: Object.values(MemberType),
          example: MemberType.BAPTIZED,
          description: 'Type of member',
        },
        status: {
          type: 'string',
          enum: Object.values(MemberStatus),
          example: MemberStatus.ACTIVE,
          description: 'Status of the member',
        },
        clubId: {
          type: 'string',
          format: 'uuid',
          example: '123e4567-e89b-12d3-a456-426614174000',
          description: 'UUID of the club the member belongs to',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Member updated successfully',
    type: MemberResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Member or club not found' })
  @ApiResponse({
    status: 409,
    description: 'Member with this identification already exists',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ): Promise<MemberResponseDto> {
    const member = await this.membersService.update(id, updateMemberDto);
    return this.mapToResponseDto(member);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a member' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Member ID',
  })
  @ApiResponse({ status: 204, description: 'Member deleted successfully' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.membersService.remove(id);
  }

  @Get('club/:clubId')
  @ApiOperation({ summary: 'Get all members of a club' })
  @ApiParam({
    name: 'clubId',
    type: 'string',
    format: 'uuid',
    description: 'Club ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of members found',
    type: [MemberResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Club not found' })
  async findByClub(
    @Param('clubId', ParseUUIDPipe) clubId: string,
  ): Promise<MemberResponseDto[]> {
    const members = await this.membersService.findByClub(clubId);
    return members.map((member) => this.mapToResponseDto(member));
  }

  private mapToResponseDto(member: any): MemberResponseDto {
    return {
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      identification: member.identification,
      birthDate: member.birthDate,
      type: member.type,
      status: member.status,
      clubId: member.club.id,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  }
}
