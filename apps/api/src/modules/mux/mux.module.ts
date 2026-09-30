import { Module } from '@nestjs/common';
import { MuxService } from './mux.service.js';
import { MuxController } from './mux.controller.js';

@Module({
  controllers: [MuxController],
  providers: [MuxService],
  exports: [MuxService],
})
export class MuxModule {}
