import { Controller, Post, Get, Param } from '@nestjs/common';
import { MuxService } from './mux.service.js';

@Controller('mux')
export class MuxController {
  constructor(private readonly muxService: MuxService) {}

  @Post('upload-url')
  createUploadUrl() {
    return this.muxService.createDirectUpload();
  }

  @Get('upload/:uploadId')
  getPlaybackId(@Param('uploadId') uploadId: string) {
    return this.muxService.getPlaybackIdFromUpload(uploadId);
  }
}
