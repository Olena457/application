import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, //forbid sending extra fields
      transform: true,
    }),
  );
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://application-six-ruby.vercel.app', // render
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Event Platform API')
    .setDescription('API documentation for the Event Platform application')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('events')
    .addTag('users')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-dock', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`Server running: http://localhost:${port}`);
  console.log(`Swagger: http://localhost:${port}/api-dock`);
}

bootstrap().catch((err: unknown) => {
  console.error('Error during application bootstrap', err);
  process.exit(1);
});
