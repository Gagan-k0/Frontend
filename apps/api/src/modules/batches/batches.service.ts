import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class BatchesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const batches = await this.prisma.batch.findMany({
      include: {
        program: true,
        manager: true,
        enrolments: true,
      }
    });

    return batches.map(batch => ({
      id: batch.id,
      name: batch.name,
      program: batch.program?.title || 'Unknown Program',
      manager: batch.manager?.name || 'Unassigned',
      startDate: new Date(batch.startDate).toLocaleDateString(),
      students: batch.enrolments.length,
      status: 'Active',
    }));
  }

  create(data: any) {
    return this.prisma.batch.create({ data });
  }

  update(id: string, data: any) {
    return this.prisma.batch.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.batch.delete({
      where: { id },
    });
  }
}
