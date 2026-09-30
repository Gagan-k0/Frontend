import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: {
        enrolments: {
          include: { batch: true }
        }
      }
    });

    return users.map(user => {
      const enrolment = user.enrolments[0]; // Just take first for demo
      return {
        id: user.id,
        name: user.name || 'Unknown',
        email: user.email,
        role: user.role,
        status: enrolment?.status || 'Active',
        progress: '0%', // Mock for now
        cohort: enrolment?.batch?.name || 'Unassigned',
        joined: new Date(user.createdAt).toLocaleDateString(),
      };
    });
  }

  async create(data: any) {
    const bcrypt = await import('bcryptjs');
    if (data.passwordHash) {
      data.passwordHash = await bcrypt.hash(data.passwordHash, 12);
    }
    return this.prisma.user.create({ data });
  }

  update(id: string, data: any) {
    const { passwordHash, status, cohort, progress, joined, ...userData } = data;
    return this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
