import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  // 1. Get all certificates (for Admin queue)
  async findAll() {
    return this.prisma.certificate.findMany({
      include: {
        enrolment: {
          include: {
            user: true,
            batch: { include: { program: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // 2. Request a certificate (Learner claims they are done)
  async requestCertificate(enrolmentId: string, userId: string) {
    const enrolment = await this.prisma.enrolment.findUnique({
      where: { id: enrolmentId },
      include: { certificate: true, batch: { include: { program: true } } }
    });

    if (!enrolment) throw new NotFoundException('Enrolment not found');
    if (enrolment.userId !== userId) throw new ForbiddenException('Not your enrolment');
    if (enrolment.certificate) throw new BadRequestException('Certificate request already exists');

    // In a real app, we'd check if all quizzes and sessions are complete here.
    // For now, we trust the request and put it in PENDING state.
    
    return this.prisma.certificate.create({
      data: {
        enrolmentId,
        certificateNumber: `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: 'PENDING'
      }
    });
  }

  // 3. Admin Approves the certificate
  async approveCertificate(id: string) {
    return this.prisma.certificate.update({
      where: { id },
      data: {
        status: 'APPROVED',
        issueDate: new Date(),
        // Mock PDF URL, in reality this generates a PDF and uploads to S3
        pdfUrl: `https://whatboutme-certs.s3.amazonaws.com/${id}.pdf`
      }
    });
  }

  // 4. Admin Rejects the certificate
  async rejectCertificate(id: string) {
    return this.prisma.certificate.update({
      where: { id },
      data: {
        status: 'REJECTED'
      }
    });
  }

  // 5. Get Learner's Certificates
  async getMyCertificates(userId: string) {
    return this.prisma.certificate.findMany({
      where: {
        enrolment: { userId },
        status: 'APPROVED'
      },
      include: {
        enrolment: {
          include: { batch: { include: { program: true } } }
        }
      }
    });
  }
}
