import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { EnrolmentStatus } from '@prisma/client';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async fulfillOrder(orderId: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId }
      });

      if (!order) {
        throw new BadRequestException('Order not found');
      }

      if (order.status === 'PAID') {
        // Idempotent: return existing enrolment if already paid
        const existingEnrolment = await tx.enrolment.findUnique({
          where: {
            userId_programId: {
              userId: order.userId,
              programId: order.programId,
            }
          }
        });
        if (existingEnrolment) return existingEnrolment;
      }

      // Mark order as paid conditionally to prevent concurrent fulfills
      const updateResult = await tx.order.updateMany({
        where: { id: orderId, status: 'PENDING' },
        data: {
          status: 'PAID',
          paidAt: new Date(),
        }
      });

      if (updateResult.count === 0 && order.status === 'PENDING') {
        // Another transaction beat us to it
        throw new ConflictException('Order is already being processed');
      }

      // Find or create batch
      let batch = await tx.batch.findFirst({
        where: { programId: order.programId }
      });

      if (!batch) {
        batch = await tx.batch.create({
          data: {
            name: 'Default Cohort',
            programId: order.programId,
            capacity: 100,
            startDate: new Date()
          }
        });
      }

      // Create enrolment
      const enrolment = await tx.enrolment.upsert({
        where: {
          userId_programId: {
            userId: order.userId,
            programId: order.programId,
          }
        },
        update: {
          status: 'ACTIVE' as EnrolmentStatus,
        },
        create: {
          userId: order.userId,
          batchId: batch.id,
          programId: order.programId,
          status: 'ACTIVE' as EnrolmentStatus,
        }
      });

      return enrolment;
    });
  }

  async mockCheckout(userId: string, programId: string) {
    if (process.env.NODE_ENV === 'production' && process.env.PAYMENT_MODE !== 'stripe') {
      throw new BadRequestException('Mock checkout not allowed in production');
    }

    const program = await this.prisma.program.findUnique({
      where: { id: programId }
    });
    if (!program) throw new BadRequestException('Program not found');

    const order = await this.prisma.order.create({
      data: {
        userId,
        programId,
        amount: program.price,
        provider: 'MOCK',
        status: 'PENDING',
      }
    });

    return this.fulfillOrder(order.id);
  }
}
