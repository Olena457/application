import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.participant.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.user.deleteMany({
    where: { email: { in: ['alice@example.com', 'bob@example.com'] } },
  });

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: { email: 'alice@example.com', password: hashedPassword, name: 'Alice Smith' },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: { email: 'bob@example.com', password: hashedPassword, name: 'Bob Johnson' },
  });

  const now = new Date();
  const eventsToCreate: any[] = [
    {
      title: 'Tech Meetup 2026',
      description: 'A gathering for tech enthusiasts to share ideas and network.',
      date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      location: 'Kyiv, Tech Hub',
      capacity: 50,
      visibility: 'Public',
      organizer: { connect: { id: user1.id } },
      tags: { connectOrCreate: [{ where: { name: 'Tech' }, create: { name: 'Tech' } }] },
    },
  ];

  const titles = ['Workshop', 'Seminar', 'Hackathon', 'Networking', 'Conference', 'Masterclass'];
  const topics = [
    'JavaScript',
    'NestJS',
    'CSS Animations',
    'UI/UX Design',
    'Database Optimization',
  ];

  for (let i = 1; i <= 17; i++) {
    eventsToCreate.push({
      title: `${topics[i % topics.length]} ${titles[i % titles.length]} #${i}`,
      description: `This is a randomly generated event description for ${topics[i % topics.length]}. Highly recommended for developers!`,
      date: new Date(now.getTime() + (i + 14) * 24 * 60 * 60 * 1000),
      location: i % 2 === 0 ? 'Kyiv, Online' : 'Lviv, Remote',
      capacity: 10 + i * 5,
      visibility: 'Public',
      organizer: { connect: { id: i % 2 === 0 ? user1.id : user2.id } },
      tags: {
        connectOrCreate: [
          {
            where: { name: topics[i % topics.length] },
            create: { name: topics[i % topics.length] },
          },
          { where: { name: 'Random' }, create: { name: 'Random' } },
        ],
      },
    });
  }

  const createdEvents: { id: string }[] = [];
  for (const data of eventsToCreate) {
    const event = await prisma.event.create({
      data: data as unknown as Prisma.EventCreateInput,
    });
    createdEvents.push({ id: event.id });
  }

  if (createdEvents.length > 0) {
    await prisma.participant.create({
      data: { userId: user2.id, eventId: createdEvents[0].id },
    });
  }

  console.log('Seed completed: 2 users and 20 events created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
