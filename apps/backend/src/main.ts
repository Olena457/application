// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     }),
//   );
//   app.enableCors({
//     origin: 'http://localhost:5173',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   });

//   const config = new DocumentBuilder()
//     .setTitle('Event Platform API')
//     .setDescription('API documentation for the Event Platform application')
//     .setVersion('1.0')
//     .addTag('auth')
//     .addTag('events')
//     .addTag('users')
//     .addBearerAuth()
//     .build();

//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api-dock', app, document);

//   await app.listen(4000);
//   console.log(`Server running: http://localhost:4000`);
//   console.log(`Dock Swagger: http://localhost:4000/api-dock`);
// }
// bootstrap().catch((err: unknown) => {
//   console.error('Error during application bootstrap', err);
//   process.exit(1);
// });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Event Platform API')
    .setDescription('API documentation for the Event Platform application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-dock', app, document);

  const port = 4000;
  await app.listen(port);

  console.log(`Server running: http://localhost:${port}`);
  console.log(`Swagger: http://localhost:${port}/api-dock`);
}

bootstrap().catch((err: unknown) => {
  console.error('Bootstrap error:', err);
  process.exit(1);
});
