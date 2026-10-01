import { Module } from '@nestjs/common';
import { MuxService } from './mux.service.js';
import { MuxController } from './mux.controller.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [MuxController],
  providers: [MuxService],
  exports: [MuxService],
})
export class MuxModule {}
