import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { AiService } from './ai.service';
import type { RequestWithUser, EventData } from '../common/interfaces/request-with-user.interface';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly aiService: AiService,
  ) {}

  @Post('assistant')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chat with AI Assistant about events' })
  async askAssistant(
    @Body('question') question: string,
    @Req() req: RequestWithUser,
  ): Promise<{ answer: string }> {
    if (!question) {
      throw new BadRequestException('Question is required for AI Assistant');
    }

    const userId = req.user.id;
    const events = (await this.eventsService.findAllForUser(userId)) as EventData[];
    const answer = await this.aiService.askAssistant(question, events);

    return { answer };
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Fetch public events with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  findPublic(@Query('page') page?: string) {
    return this.eventsService.findPublic(Number(page) || 1);
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
