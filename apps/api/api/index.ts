import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module.js';
import serverlessExpress from '@vendia/serverless-express';
import { Handler } from 'express';

let cachedServer: Handler;

async function bootstrap() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.init();
    
    const expressApp = app.getHttpAdapter().getInstance();
    cachedServer = serverlessExpress({ app: expressApp });
  }
  return cachedServer;
}

export default async (req: any, res: any) => {
  const server = await bootstrap();
  return server(req, res);
};
