import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ZoomService } from './zoom.service.js';

@Injectable()
export class SessionsService {
  constructor(
    private prisma: PrismaService,
    private zoomService: ZoomService
  ) {}

  // 1. Get all sessions for a specific batch
  async getSessionsByBatch(batchId: string) {
    return this.prisma.session.findMany({
      where: { batchId },
      orderBy: { startTime: 'asc' },
      include: {
        attendances: true
      }
    });
  }

  // 2. Create a session for a batch
  async createSession(data: { batchId: string, title: string, startTime: string, endTime: string, joinUrl?: string, recordingUrl?: string, quizId?: string }) {
    let finalJoinUrl = data.joinUrl;
    
    // If no join URL was provided, automatically generate a Zoom meeting
    if (!finalJoinUrl || finalJoinUrl.trim() === '') {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      const durationMin = Math.round((end.getTime() - start.getTime()) / 60000);
      
      finalJoinUrl = await this.zoomService.createMeeting(data.title, start, durationMin);
    }

    return this.prisma.session.create({
      data: {
        batchId: data.batchId,
        title: data.title,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        joinUrl: finalJoinUrl || null,
        recordingUrl: data.recordingUrl || null,
        quizId: data.quizId || null,
      }
    });
  }

  // 3. Delete a session
  async deleteSession(sessionId: string) {
    return this.prisma.session.delete({
      where: { id: sessionId }
    });
  }

  // 4. Mark attendance for a learner (either self-check-in or admin manual)
  async markAttendance(sessionId: string, userId: string, isAdminOverride: boolean = false) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: { batch: true }
    });

    if (!session) throw new NotFoundException('Session not found');

    // Check if within time window (unless Admin is overriding)
    if (!isAdminOverride) {
      const now = new Date();
      // Allow check-in 5 mins before start, until the end time
      const windowStart = new Date(session.startTime.getTime() - 5 * 60000);
      const windowEnd = session.endTime;
      
      if (now < windowStart) {
        throw new BadRequestException('Attendance window has not opened yet.');
      }
      if (now > windowEnd) {
        throw new BadRequestException('Attendance window has closed.');
      }
    }

    // Find the student's enrolment for this batch
    const enrolment = await this.prisma.enrolment.findUnique({
      where: { userId_batchId: { userId, batchId: session.batchId } }
    });

    if (!enrolment) {
      throw new BadRequestException('User is not enrolled in this batch.');
    }

    // Upsert the attendance record (creates if not exists)
    return this.prisma.attendance.upsert({
      where: {
        sessionId_enrolmentId: {
          sessionId,
          enrolmentId: enrolment.id
        }
      },
      update: {
        joinTime: new Date()
      },
      create: {
        sessionId,
        enrolmentId: enrolment.id,
        joinTime: new Date()
      }
    });
  }

  // 5. Get attendance records for a session
  async getAttendanceForSession(sessionId: string, user: any) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: { batch: true }
    });
    
    if (!session) throw new NotFoundException('Session not found');

    if (user.role === Role.MANAGER && session.batch.managerId !== user.sub) {
      throw new ForbiddenException('You can only view attendance for your own batches');
    }

    return this.prisma.attendance.findMany({
      where: { sessionId },
      include: {
        enrolment: {
          include: { user: true }
        }
      }
    });
  }
}
