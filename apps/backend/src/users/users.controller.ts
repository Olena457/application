import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EventsService } from '../events/events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('me/events')
  @ApiOperation({ summary: "Fetch user's events (calendar)" })
  getMyEvents(@CurrentUser() userId: string) {
    return this.eventsService.findUserEvents(userId);
  }
}
