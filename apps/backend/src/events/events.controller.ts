import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Fetch public events' })
  findPublic() {
    return this.eventsService.findPublic();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Fetch single event' })
  findById(@Param('id') id: string, @CurrentUser() userId?: string) {
    return this.eventsService.findById(id, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new event' })
  create(@CurrentUser() userId: string, @Body() dto: CreateEventDto) {
    return this.eventsService.create(userId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Edit event (organizer only)' })
  update(@Param('id') id: string, @CurrentUser() userId: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete event (organizer only)' })
  delete(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.eventsService.delete(id, userId);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join event' })
  join(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.eventsService.join(id, userId);
  }

  @Post(':id/leave')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leave event' })
  leave(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.eventsService.leave(id, userId);
  }
}
