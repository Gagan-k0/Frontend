import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { ProgramsModule } from './modules/programs/programs.module.js';
import { BatchesModule } from './modules/batches/batches.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { MuxModule } from './modules/mux/mux.module.js';
import { QuizzesModule } from './modules/quizzes/quizzes.module.js';
import { InvoicesModule } from './modules/invoices/invoices.module.js';
import { RevenueModule } from './modules/revenue/revenue.module.js';
import { SessionsModule } from './modules/sessions/sessions.module.js';
import { CertificatesModule } from './modules/certificates/certificates.module.js';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module.js';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard.js';
import { RolesGuard } from './common/guards/roles.guard.js';

@Module({
  imports: [
    PrismaModule,
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 100, // 100 reqs / min
      },
      {
        name: 'auth',
        ttl: 60000,
        limit: 5, // 5 reqs / min
      }
    ]),
    UsersModule,
    ProgramsModule,
    BatchesModule,
    AuthModule,
    MuxModule,
    QuizzesModule,
    InvoicesModule,
    RevenueModule,
    SessionsModule,
    CertificatesModule,
    EnrollmentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule {}
