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

  async findPublic(page: number = 1) {
    const limit = 8;
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where: { visibility: 'Public' },
        take: limit,
        skip: skip,
        include: {
          organizer: { select: { id: true, name: true, email: true } },
          tags: true,
          participants: {
            select: {
              userId: true,
            },
          },
          _count: { select: { participants: true } },
        },
        orderBy: { date: 'asc' },
      }),
      this.prisma.event.count({ where: { visibility: 'Public' } }),
    ]);

    return {
      events,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findById(id: string, userId?: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
        tags: true,
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
    const { tags, date, ...eventData } = dto;

    if (tags && tags.length > 5) {
      throw new BadRequestException('Maximum 5 tags allowed');
    }

    return this.prisma.event.create({
      data: {
        ...eventData,
        date: new Date(date),
        organizerId: userId,
        tags: tags?.length
          ? {
              connectOrCreate: tags.map((tag) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            }
          : undefined,
      },
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
        tags: true,
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateEventDto) {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== userId) {
      throw new ForbiddenException('Only the organizer can edit this event');
    }

    const { tags, date, ...eventData } = dto;

    if (tags && tags.length > 5) {
      throw new BadRequestException('Maximum 5 tags allowed');
    }

    return this.prisma.event.update({
      where: { id },
      data: {
        ...eventData,
        ...(date && { date: new Date(date) }),
        tags: tags
          ? {
              set: [],
              connectOrCreate: tags.map((tag) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            }
          : undefined,
      },
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
        tags: true,
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

    const participantCount = (event as typeof event & { _count: { participants: number } })._count
      .participants;

    if (event.capacity && participantCount >= event.capacity) {
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
        tags: true,
        _count: { select: { participants: true } },
      },
      orderBy: { date: 'asc' },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.event.findMany({
      where: {
        OR: [
          { organizerId: userId },
          { participants: { some: { userId: userId } } },
          { visibility: 'Public' },
        ],
      },
      include: {
        organizer: { select: { name: true } },
        tags: true,
        participants: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });
  }
}
