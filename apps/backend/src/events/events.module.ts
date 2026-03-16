import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { AiService } from './ai.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService, AiService],
  exports: [EventsService],
})
export class EventsModule {}
