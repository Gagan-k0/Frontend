import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database...');

  // 1. Create Super Admin (Roweena)
  const admin = await prisma.user.upsert({
    where: { email: 'roweena@whatboutme.com' },
    update: {},
    create: {
      email: 'roweena@whatboutme.com',
      name: 'Roweena',
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`Created Super Admin: ${admin.email}`);

  // 2. Create the 11 Steps Program
  const program = await prisma.program.upsert({
    where: { slug: '11-steps-to-u' },
    update: {},
    create: {
      title: '11 Steps to U',
      slug: '11-steps-to-u',
      description: 'A comprehensive journey to resilience and transformation.',
      price: 1999.0,
      isActive: true,
      steps: {
        create: [
          { sequence: 1, title: 'Step 1: Introduction to U', description: 'Begin your journey.' },
          { sequence: 2, title: 'Step 2: Self Discovery', description: 'Uncover your inner strengths.' },
          { sequence: 3, title: 'Step 3: Resilience Building', description: 'Tools for bouncing back.' },
        ],
      },
    },
  });
  console.log(`Created Program: ${program.title}`);

  // 3. Create a Batch
  const batch = await prisma.batch.create({
    data: {
      name: 'Alpha Cohort 2026',
      programId: program.id,
      managerId: admin.id,
      startDate: new Date('2026-10-15T00:00:00Z'),
      capacity: 50,
    },
  });
  console.log(`Created Batch: ${batch.name}`);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
