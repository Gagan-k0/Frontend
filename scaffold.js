const fs = require('fs');
const path = require('path');

const modules = ['users', 'programs', 'batches'];
const baseDir = path.join(__dirname, 'apps', 'api', 'src', 'modules');

if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

modules.forEach(mod => {
  const modDir = path.join(baseDir, mod);
  if (!fs.existsSync(modDir)) fs.mkdirSync(modDir, { recursive: true });

  const capitalized = mod.charAt(0).toUpperCase() + mod.slice(1);

  // Module file
  fs.writeFileSync(path.join(modDir, `${mod}.module.ts`), `
import { Module } from '@nestjs/common';
import { ${capitalized}Controller } from './${mod}.controller.js';
import { ${capitalized}Service } from './${mod}.service.js';

@Module({
  controllers: [${capitalized}Controller],
  providers: [${capitalized}Service],
  exports: [${capitalized}Service],
})
export class ${capitalized}Module {}
  `.trim() + '\n');

  // Controller file
  fs.writeFileSync(path.join(modDir, `${mod}.controller.ts`), `
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ${capitalized}Service } from './${mod}.service.js';

@Controller('${mod}')
export class ${capitalized}Controller {
  constructor(private readonly ${mod}Service: ${capitalized}Service) {}

  @Get()
  findAll() {
    return this.${mod}Service.findAll();
  }

  @Post()
  create(@Body() createDto: any) {
    return this.${mod}Service.create(createDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.${mod}Service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.${mod}Service.remove(id);
  }
}
  `.trim() + '\n');

  // Service file
  fs.writeFileSync(path.join(modDir, `${mod}.service.ts`), `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ${capitalized}Service {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.${mod.replace(/es$/, '').replace(/s$/, '')}.findMany();
  }

  create(data: any) {
    return this.prisma.${mod.replace(/es$/, '').replace(/s$/, '')}.create({ data });
  }

  update(id: string, data: any) {
    return this.prisma.${mod.replace(/es$/, '').replace(/s$/, '')}.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.${mod.replace(/es$/, '').replace(/s$/, '')}.delete({
      where: { id },
    });
  }
}
  `.trim() + '\n');
});

console.log('Modules generated successfully.');
