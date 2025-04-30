import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventItemDto } from './dto/create-event-item.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Event } from './entities/event.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({
    status: 201,
    description: 'The event has been successfully created.',
    type: Event,
  })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({
    status: 200,
    description: 'List of all events.',
    type: [Event],
  })
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an event by id' })
  @ApiResponse({
    status: 200,
    description: 'The found event.',
    type: Event,
  })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an event' })
  @ApiResponse({
    status: 200,
    description: 'The event has been successfully updated.',
    type: Event,
  })
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event' })
  @ApiResponse({
    status: 200,
    description: 'The event has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Add an item to an event' })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully added to the event.',
    type: Event,
  })
  addItem(
    @Param('id') id: string,
    @Body() createEventItemDto: CreateEventItemDto,
  ) {
    return this.eventsService.addItem(id, createEventItemDto);
  }

  @Delete(':eventId/items/:itemId')
  @ApiOperation({ summary: 'Remove an item from an event' })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully removed from the event.',
    type: Event,
  })
  removeItem(
    @Param('eventId') eventId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.eventsService.removeItem(eventId, itemId);
  }
}
