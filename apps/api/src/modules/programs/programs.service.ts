import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class ProgramsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.program.findMany();
  }

  async enroll(programId: string, userId: string) {
    let batch = await this.prisma.batch.findFirst({
      where: { programId }
    });
    if (!batch) {
      batch = await this.prisma.batch.create({
        data: {
          name: 'Default Cohort',
          programId,
          capacity: 100,
          startDate: new Date()
        }
      });
    }

    const existing = await this.prisma.enrolment.findFirst({
      where: { userId, batchId: batch.id }
    });

    if (existing) return existing;

    return this.prisma.enrolment.create({
      data: {
        userId,
        batchId: batch.id,
        status: 'ACTIVE'
      }
    });
  }

  create(data: any) {
    if (data.title && !data.slug) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    const programData = {
      title: data.title,
      slug: data.slug,
      description: data.description,
      price: data.price,
      isActive: data.status === 'Active' || data.isActive !== false,
    };
    return this.prisma.program.create({ data: programData });
  }

  update(id: string, data: any) {
    const programData: any = {};
    if (data.title) programData.title = data.title;
    if (data.description) programData.description = data.description;
    if (data.price !== undefined) programData.price = data.price;
    if (data.status !== undefined) programData.isActive = data.status === 'Active';
    
    return this.prisma.program.update({
      where: { id },
      data: programData,
    });
  }

  remove(id: string) {
    return this.prisma.program.delete({
      where: { id },
    });
  }

  getSteps(programId: string) {
    return this.prisma.step.findMany({
      where: { programId },
      orderBy: { sequence: 'asc' },
    });
  }

  createStep(programId: string, data: any) {
    return this.prisma.step.create({
      data: {
        programId,
        title: data.title,
        description: data.description,
        sequence: data.sequence,
      }
    });
  }

  getStep(stepId: string) {
    return this.prisma.step.findUnique({
      where: { id: stepId },
      include: { lessons: true, quiz: { include: { questions: { include: { options: true } } } } }
    });
  }

  removeStep(stepId: string) {
    return this.prisma.step.delete({
      where: { id: stepId },
    });
  }

  getLessons(stepId: string) {
    return this.prisma.lesson.findMany({
      where: { stepId },
    });
  }

  createLesson(stepId: string, data: any) {
    return this.prisma.lesson.create({
      data: {
        stepId,
        title: data.title,
        type: data.type, // e.g. VIDEO
        mediaUrl: data.mediaUrl, // This will be the Mux Asset ID or Playback ID
        durationSec: data.durationSec || 0,
      }
    });
  }

  removeLesson(lessonId: string) {
    return this.prisma.lesson.delete({
      where: { id: lessonId }
    });
  }
}
