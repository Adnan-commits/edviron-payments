import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'; // 👈 add this

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,                // strips unknown fields
    forbidNonWhitelisted: true,     // throws 400 if unknown fields
    transform: true,                // auto-transform payloads
    transformOptions: { enableImplicitConversion: true },
    validationError: { target: false }
  }));

  app.useGlobalFilters(new AllExceptionsFilter()); // 👈 add this
  app.enableCors({
  origin: "http://localhost:3001",
  credentials: true,
});


  await app.listen(process.env.PORT || 3000);
}
bootstrap();
