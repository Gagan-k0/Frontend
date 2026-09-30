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

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ProgramsModule,
    BatchesModule,
    AuthModule,
    MuxModule,
    QuizzesModule,
    InvoicesModule,
    RevenueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
