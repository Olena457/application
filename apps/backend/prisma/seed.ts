import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.participant.deleteMany({});
  await prisma.event.deleteMany({});

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      password: hashedPassword,
      name: 'Alice Smith',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      password: hashedPassword,
      name: 'Bob Johnson',
    },
  });

  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const eventData: Prisma.EventCreateInput[] = [
    {
      title: 'Tech Meetup 2026',
      description: 'A gathering for tech enthusiasts to share ideas and network.',
      date: nextWeek,
      location: 'Kyiv, Tech Hub',
      capacity: 50,
      visibility: 'Public',
      organizer: { connect: { id: user1.id } },
    },
    {
      title: 'React Workshop',
      description: 'Hands-on React workshop for beginners.',
      date: new Date(nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000),
      location: 'Lviv, Coworking Space',
      capacity: 20,
      visibility: 'Public',
      organizer: { connect: { id: user1.id } },
    },
    {
      title: 'Node.js Conference',
      description: 'Annual Node.js and backend development conference.',
      date: twoWeeks,
      location: 'Odessa, Conference Center',
      capacity: null,
      visibility: 'Public',
      organizer: { connect: { id: user2.id } },
    },
  ] as unknown as Prisma.EventCreateInput[];

  const [event1] = await Promise.all(eventData.map((data) => prisma.event.create({ data })));

  await prisma.participant.create({
    data: {
      userId: user2.id,
      eventId: event1.id,
    },
  });

  console.log('Seed completed: successfully created users');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
