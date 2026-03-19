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
  const officialTags = ['Tech', 'Education', 'Social', 'Music', 'Sport', 'Workshop'];
  const titles = ['Workshop', 'Seminar', 'Hackathon', 'Networking', 'Conference', 'Masterclass'];
  const locations = [
    'Kyiv',
    'Lviv',
    'Odesa',
    'Dnipro',
    'Remote',
    'Kharkiv',
    'Ivano-Frankivsk',
    'Vinnytsia',
    'Zaporizhzhia',
    'Remote',
  ];

  const eventsToCreate: any[] = [
    {
      title: 'Global Tech Expo',
      description: 'A major gathering for tech enthusiasts to share ideas and network.',
      date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      location: 'Kyiv',
      capacity: 100,
      visibility: 'Public',
      organizer: { connect: { id: user1.id } },
      tags: {
        connectOrCreate: [
          { where: { name: 'Tech' }, create: { name: 'Tech' } },
          { where: { name: 'Social' }, create: { name: 'Social' } },
        ],
      },
    },
  ];

  for (let i = 1; i <= 20; i++) {
    const mainTagName = officialTags[i % officialTags.length];
    const secondaryTagName = officialTags[(i + 2) % officialTags.length];
    const eventTitle = titles[i % titles.length];
    const eventLocation = locations[i % locations.length];

    eventsToCreate.push({
      title: `${mainTagName} ${eventTitle}`,
      description: `Join our ${mainTagName.toLowerCase()} event. An excellent opportunity for networking and professional growth in ${eventLocation}.`,
      date: new Date(now.getTime() + (i + 14) * 24 * 60 * 60 * 1000),
      location: eventLocation,
      capacity: 15 + i * 2,
      visibility: 'Public',
      organizer: { connect: { id: i % 2 === 0 ? user1.id : user2.id } },
      tags: {
        connectOrCreate: [
          {
            where: { name: mainTagName },
            create: { name: mainTagName },
          },
          {
            where: { name: secondaryTagName },
            create: { name: secondaryTagName },
          },
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

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
