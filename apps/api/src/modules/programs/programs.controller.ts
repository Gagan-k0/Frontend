import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProgramsService } from './programs.service.js';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  findAll() {
    return this.programsService.findAll();
  }

  @Post('enroll')
  enroll(@Body() body: { programId: string; userId: string }) {
    return this.programsService.enroll(body.programId, body.userId);
  }

  @Post()
  create(@Body() createDto: any) {
    return this.programsService.create(createDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.programsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.programsService.remove(id);
  }

  @Get(':id/steps')
  getSteps(@Param('id') id: string) {
    return this.programsService.getSteps(id);
  }

  @Post(':id/steps')
  createStep(@Param('id') id: string, @Body() data: any) {
    return this.programsService.createStep(id, data);
  }

  @Get('steps/:stepId')
  getStep(@Param('stepId') stepId: string) {
    return this.programsService.getStep(stepId);
  }

  @Delete('steps/:stepId')
  removeStep(@Param('stepId') stepId: string) {
    return this.programsService.removeStep(stepId);
  }

  @Get('steps/:stepId/lessons')
  getLessons(@Param('stepId') stepId: string) {
    return this.programsService.getLessons(stepId);
  }

  @Post('steps/:stepId/lessons')
  createLesson(@Param('stepId') stepId: string, @Body() data: any) {
    return this.programsService.createLesson(stepId, data);
  }

  @Delete('lessons/:lessonId')
  removeLesson(@Param('lessonId') lessonId: string) {
    return this.programsService.removeLesson(lessonId);
  }
}
