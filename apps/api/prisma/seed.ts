import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ──────────────────────────────────────────────
  // 1. Create Admin user (Roweena)
  // ──────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@2026', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@whatboutme.com' },
    update: { passwordHash: adminPassword, role: Role.SUPER_ADMIN },
    create: {
      email: 'admin@whatboutme.com',
      name: 'Roweena (Admin)',
      passwordHash: adminPassword,
      role: Role.SUPER_ADMIN,
    },
  });
  console.log(`✅ Admin user created: ${admin.email} (password: Admin@2026)`);

  // ──────────────────────────────────────────────
  // 2. Create a Manager user
  // ──────────────────────────────────────────────
  const managerPassword = await bcrypt.hash('Manager@2026', 12);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@whatboutme.com' },
    update: { passwordHash: managerPassword, role: Role.MANAGER },
    create: {
      email: 'manager@whatboutme.com',
      name: 'Sarah (Manager)',
      passwordHash: managerPassword,
      role: Role.MANAGER,
    },
  });
  console.log(`✅ Manager user created: ${manager.email} (password: Manager@2026)`);

  // ──────────────────────────────────────────────
  // 3. Create test learner users
  // ──────────────────────────────────────────────
  const learnerPassword = await bcrypt.hash('Learner@2026', 12);
  
  const learner1 = await prisma.user.upsert({
    where: { email: 'learner1@example.com' },
    update: { passwordHash: learnerPassword },
    create: {
      email: 'learner1@example.com',
      name: 'Alice Johnson',
      passwordHash: learnerPassword,
      role: Role.USER,
    },
  });
  console.log(`✅ Learner 1 created: ${learner1.email} (password: Learner@2026)`);

  const learner2 = await prisma.user.upsert({
    where: { email: 'learner2@example.com' },
    update: { passwordHash: learnerPassword },
    create: {
      email: 'learner2@example.com',
      name: 'Bob Williams',
      passwordHash: learnerPassword,
      role: Role.USER,
    },
  });
  console.log(`✅ Learner 2 created: ${learner2.email} (password: Learner@2026)`);

  // ──────────────────────────────────────────────
  // 4. Create a sample program & batch
  // ──────────────────────────────────────────────
  const program = await prisma.program.upsert({
    where: { slug: '11-steps-to-u' },
    update: {},
    create: {
      title: '11 Steps to U',
      slug: '11-steps-to-u',
      description: 'A transformative self-discovery certification program.',
      price: 1999,
      isActive: true,
    },
  });
  console.log(`✅ Program created: ${program.title}`);

  const batch = await prisma.batch.create({
    data: {
      name: 'Cohort Jan 2027',
      programId: program.id,
      managerId: manager.id,
      startDate: new Date('2027-01-15'),
      capacity: 30,
    },
  });
  console.log(`✅ Batch created: ${batch.name}`);

  // ──────────────────────────────────────────────
  // 5. Enroll learner1 into the batch (tenant separation)
  //    Learner2 is NOT enrolled
  // ──────────────────────────────────────────────
  await prisma.enrolment.create({
    data: {
      userId: learner1.id,
      batchId: batch.id,
      status: 'ACTIVE',
    },
  });
  console.log(`✅ Learner 1 (Alice) enrolled in batch: ${batch.name}`);
  console.log(`⛔ Learner 2 (Bob) is NOT enrolled — tenant separation test!`);

  console.log('\n🎉 Seed complete! Login credentials:');
  console.log('────────────────────────────────────');
  console.log('Admin:    admin@whatboutme.com / Admin@2026');
  console.log('Manager:  manager@whatboutme.com / Manager@2026');
  console.log('Learner1: learner1@example.com / Learner@2026 (enrolled)');
  console.log('Learner2: learner2@example.com / Learner@2026 (NOT enrolled)');
  console.log('────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
