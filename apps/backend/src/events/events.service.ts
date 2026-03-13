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
            user: { select: { id: true, name: true, email: true } },
          },
        },
        _count: { select: { participants: true } },
      },
    });

    if (!event) throw new NotFoundException('Event not found');

    if (event.visibility === 'Private' && event.organizerId !== userId) {
      const isParticipant = event.participants.some((p) => p.userId === userId);
      if (!isParticipant) {
        throw new ForbiddenException('This event is private');
      }
    }

    return event;
  }

  async create(userId: string, dto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        ...dto,
        date: new Date(dto.date),
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

    return this.prisma.event.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.date && { date: new Date(dto.date) }),
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
      throw new BadRequestException('You are the organizer');
    }

    const existing = await this.prisma.participant.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });

    if (existing) throw new BadRequestException('Already joined');

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
      where: { userId_eventId: { userId, eventId } },
    });

    if (!participant) throw new BadRequestException('Not a participant');

    await this.prisma.participant.delete({
      where: { userId_eventId: { userId, eventId } },
    });
    return { success: true };
  }

  async findUserEvents(userId: string) {
    return this.prisma.event.findMany({
      where: {
        OR: [{ organizerId: userId }, { participants: { some: { userId } } }],
      },
      include: {
        organizer: { select: { id: true, name: true } },
        _count: { select: { participants: true } },
      },
      orderBy: { date: 'asc' },
    });
  }
}
