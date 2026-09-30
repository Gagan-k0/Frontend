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

    // Build JWT payload with user role and tenant context (enrolled programs)
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

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
          programTitle: enrolment.batch.program.title,
          status: enrolment.status,
          progress: 0,
        });
      }
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

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

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '2h' });

    return {
      access_token: accessToken,
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
        throw new UnauthorizedException('User not found');
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      };

      const accessToken = this.jwtService.sign(newPayload, { expiresIn: '1h' });

      return { access_token: accessToken };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
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
              include: { program: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const enrolledPrograms = user.enrolments.map((e) => {
      // Calculate a dummy progress based on enrolment ID to make it dynamic but consistent per enrolment
      const hash = Array.from(e.id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const progress = (hash % 100) + 1; // 1 to 100%

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
    };
  }
}
