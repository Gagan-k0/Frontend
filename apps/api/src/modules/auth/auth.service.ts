import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Production-level login: validates email + password hash, returns JWT.
   */
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        enrolments: {
          include: {
            batch: {
              include: { program: true },
            },
          },
        },
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Build basic payload for refresh token (sessionId is added later for access token)
    const refreshPayload = {
      sub: user.id,
    };

    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    // Hash the refresh token and store it
    const tokenHash = await bcrypt.hash(refreshToken, 10);

    // Enforce device limits and store session
    const sessionId = await this.createDeviceSession(user.id, user.role, tokenHash);

    // Build JWT payload with user role and tenant context (enrolled programs)
    const accessPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      sessionId,
    };

    const accessToken = this.jwtService.sign(accessPayload, { expiresIn: '15m' });

    // Return user data with enrolled programs for tenant separation
    const enrolledPrograms = user.enrolments.map((e) => ({
      enrolmentId: e.id,
      batchId: e.batchId,
      batchName: e.batch.name,
      programId: e.batch.programId,
      programTitle: e.batch.program.title,
      status: e.status,
    }));

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
        enrolledPrograms,
      },
    };
  }

  /**
   * Production-level signup: hashes password, creates user, enrolls in programs, returns JWT.
   */
  async signup(data: { name: string; email: string; password: string; programIds?: string[] }) {
    // Check if user already exists
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    // Hash password with bcrypt (12 rounds)
    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
        role: Role.USER,
      },
    });

    // Enrol user in default batches for the selected programs
    const enrolledPrograms = [];
    if (data.programIds && data.programIds.length > 0) {
      for (const pId of data.programIds) {
        let batch = await this.prisma.batch.findFirst({
          where: { programId: pId }
        });
        
        // Create a default batch if none exists
        if (!batch) {
          batch = await this.prisma.batch.create({
            data: {
              name: 'Default Cohort',
              programId: pId,
              capacity: 100,
              startDate: new Date()
            }
          });
        }

        const enrolment = await this.prisma.enrolment.create({
          data: {
            userId: user.id,
            batchId: batch.id,
            programId: pId,
            status: 'ACTIVE'
          },
          include: {
            batch: {
              include: { program: true }
            }
          }
        });

        // Add to enrolled programs array to be returned in JWT payload
        enrolledPrograms.push({
          enrolmentId: enrolment.id,
          batchId: batch.id,
          batchName: batch.name,
          programId: pId,
          programTitle: enrolment.batch?.program?.title || 'Unknown',
          status: enrolment.status,
          progress: 0,
        });
      }
    }

    const refreshPayload = { sub: user.id };
    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    const tokenHash = await bcrypt.hash(refreshToken, 10);

    // Enforce device limits
    const sessionId = await this.createDeviceSession(user.id, user.role, tokenHash);

    const accessPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      sessionId,
    };

    const accessToken = this.jwtService.sign(accessPayload, { expiresIn: '15m' });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        enrolledPrograms,
      },
    };
  }

  /**
   * Admin login: only ADMIN / SUPER_ADMIN / MANAGER roles can log in here.
   */
  async adminLogin(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Enforce role-based access: only admin roles can use admin login
    const adminRoles: string[] = [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER];
    if (!adminRoles.includes(user.role)) {
      throw new UnauthorizedException('Insufficient permissions for admin access');
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const refreshPayload = { sub: user.id };
    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    const tokenHash = await bcrypt.hash(refreshToken, 10);

    // Enforce device limits
    const sessionId = await this.createDeviceSession(user.id, user.role, tokenHash);

    const accessPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      sessionId,
    };

    const accessToken = this.jwtService.sign(accessPayload, { expiresIn: '15m' });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  /**
   * Refresh token endpoint
   */
  async refreshToken(refreshTokenStr: string) {
    try {
      const payload = this.jwtService.verify(refreshTokenStr, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException({ message: 'User not found', error: 'INVALID_CREDENTIALS' });
      }

      const session = await this.checkSession(payload.sessionId);

      // Verify token hash
      const isValid = await bcrypt.compare(refreshTokenStr, session.token);
      if (!isValid) {
        // Reuse detected! Revoke the session
        await this.prisma.userSession.update({
          where: { id: session.id },
          data: { revokedAt: new Date(), revokedReason: 'TOKEN_REUSED' }
        });
        throw new UnauthorizedException({ message: 'Session revoked due to token reuse', error: 'SESSION_REVOKED' });
      }

      // Generate new tokens
      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        sessionId: payload.sessionId,
      };

      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      });
      const newHash = await bcrypt.hash(newRefreshToken, 10);

      // Rotate hash in db
      await this.prisma.userSession.update({
        where: { id: session.id },
        data: { token: newHash }
      });

      const accessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });

      return { access_token: accessToken, refresh_token: newRefreshToken };
    } catch (e: any) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      throw new UnauthorizedException({ message: 'Invalid or expired refresh token', error: 'TOKEN_EXPIRED' });
    }
  }

  /**
   * Get user profile with tenant-specific enrolled programs.
   */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        enrolments: {
          include: {
            batch: {
              include: { 
                program: {
                  include: {
                    steps: {
                      include: {
                        lessons: true,
                        quiz: true,
                      }
                    }
                  }
                }
              },
            },
            lessonProgress: true,
            attempts: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const batchIds = user.enrolments.map(e => e.batchId);
    
    // Fetch sessions for all batches the user is in
    const sessions = await this.prisma.session.findMany({
      where: {
        batchId: { in: batchIds },
        endTime: { gt: new Date() } // Only future or ongoing sessions
      },
      orderBy: { startTime: 'asc' },
      take: 5
    });

    const enrolledPrograms = user.enrolments.map((e) => {
      let totalItems = 0;
      let completedItems = 0;

      const steps = e.batch?.program?.steps || [];
      for (const step of steps) {
        // Count lessons
        for (const lesson of step.lessons || []) {
          totalItems++;
          const lp = e.lessonProgress?.find(p => p.lessonId === lesson.id);
          if (lp?.viewed) completedItems++;
        }
        // Count quiz
        if (step.quiz) {
          totalItems++;
          const attempt = e.attempts?.find(a => a.quizId === step.quiz?.id && a.status === 'PASSED');
          if (attempt) completedItems++;
        }
      }

      const progress = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

      return {
        enrolmentId: e.id,
        batchId: e.batchId,
        batchName: e.batch.name,
        programId: e.batch.programId,
        programTitle: e.batch.program.title,
        status: e.status,
        progress: progress, // Dynamic progress added
      };
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyId: user.companyId,
      enrolledPrograms,
      upcomingSessions: sessions,
    };
  }

  /**
   * Helper: Create a device session and enforce limits
   */
  async createDeviceSession(userId: string, role: string, tokenHash: string): Promise<string> {
    const maxSessions = role === Role.USER ? 1 : 3;

    const sessionId = await this.prisma.$transaction(async (tx) => {
      // 1. Take advisory lock
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${userId}))`;

      // 2. Find active sessions
      const activeSessions = await tx.userSession.findMany({
        where: { userId, revokedAt: null },
        orderBy: { createdAt: 'asc' },
      });

      // 3. Revoke excess
      if (activeSessions.length >= maxSessions) {
        const toRevoke = activeSessions.slice(0, activeSessions.length - maxSessions + 1);
        await tx.userSession.updateMany({
          where: { id: { in: toRevoke.map(s => s.id) } },
          data: {
            revokedAt: new Date(),
            revokedReason: 'NEW_LOGIN'
          }
        });
      }

      // 4. Create new
      const newSession = await tx.userSession.create({
        data: {
          userId,
          token: tokenHash,
        }
      });

      return newSession.id;
    });

    return sessionId;
  }

  /**
   * Check if session is revoked
   */
  async checkSession(sessionId: string) {
    if (!sessionId) {
      throw new UnauthorizedException({ message: 'Session ID missing', error: 'INVALID_CREDENTIALS' });
    }

    const session = await this.prisma.userSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.revokedAt) {
      throw new UnauthorizedException({ message: 'Session has been revoked', error: 'SESSION_REVOKED' });
    }

    return session;
  }

  /**
   * Logout all sessions
   */
  async logoutAll(userId: string) {
    const res = await this.prisma.userSession.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date(), revokedReason: 'LOGOUT_ALL' }
    });
    
    await this.prisma.logAction({
      actorId: userId,
      action: 'LOGOUT_ALL_SESSIONS',
      entity: 'User',
      entityId: userId,
      meta: { count: res.count }
    });

    return { success: true, count: res.count };
  }
}
