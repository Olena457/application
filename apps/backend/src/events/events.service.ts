import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublic() {
    return this.prisma.event.findMany({
      where: { visibility: 'Public' },
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
        participants: {
          select: { userId: true },
        },
        _count: { select: { participants: true } },
      },
      orderBy: { date: 'asc' },
    });
  }

  async findById(id: string, userId?: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
        participants: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.visibility === 'Private' && event.organizerId !== userId) {
      const isParticipant = event.participants.some((p) => p.userId === userId);
      if (!isParticipant) {
        throw new ForbiddenException('This event is private');
      }
    }

    return {
      ...event,
      participantCount: event.participants.length,
    };
  }

  async create(userId: string, dto: CreateEventDto) {
    const date = new Date(dto.date);
    if (date < new Date()) {
      throw new BadRequestException('Cannot create events in the past');
    }

    return this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        date,
        location: dto.location,
        capacity: dto.capacity ?? null,
        visibility: dto.visibility ?? 'Public',
        organizerId: userId,
      },
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateEventDto) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== userId) {
      throw new ForbiddenException('Only the organizer can edit this event');
    }

    const date = dto.date ? new Date(dto.date) : event.date;
    if (date < new Date()) {
      throw new BadRequestException('Cannot set event date in the past');
    }

    return this.prisma.event.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.date && { date: new Date(dto.date) }),
        ...(dto.location && { location: dto.location }),
        ...(dto.capacity !== undefined && { capacity: dto.capacity }),
        ...(dto.visibility && { visibility: dto.visibility }),
      },
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async delete(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== userId) {
      throw new ForbiddenException('Only the organizer can delete this event');
    }

    await this.prisma.event.delete({ where: { id } });
    return { success: true };
  }

  async join(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { participants: true } } },
    });

    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId === userId) {
      throw new BadRequestException('You are already the organizer');
    }

    const existing = await this.prisma.participant.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });
    if (existing) {
      throw new BadRequestException('You have already joined this event');
    }

    if (event.capacity && event._count.participants >= event.capacity) {
      throw new BadRequestException('Event is full');
    }

    return this.prisma.participant.create({
      data: { userId, eventId },
      include: {
        event: { select: { id: true, title: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async leave(eventId: string, userId: string) {
    const participant = await this.prisma.participant.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });

    if (!participant) {
      throw new BadRequestException('You are not a participant of this event');
    }

    await this.prisma.participant.delete({
      where: {
        userId_eventId: { userId, eventId },
      },
    });
    return { success: true };
  }

  async findUserEvents(userId: string) {
    const events = await this.prisma.event.findMany({
      where: {
        OR: [{ organizerId: userId }, { participants: { some: { userId } } }],
      },
      include: {
        organizer: {
          select: { id: true, name: true },
        },
        _count: { select: { participants: true } },
      },
      orderBy: { date: 'asc' },
    });

    return events;
  }
}
