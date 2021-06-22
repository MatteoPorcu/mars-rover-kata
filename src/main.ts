import { EnvironmentType } from './common/model/common-config.model';
import { NestFactory } from '@nestjs/core';
import { AppConfigService } from './app-config.service';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: `${process.env.FRONTEND_URL}`,
  });

  // Swagger
  const appConfig = app.get(AppConfigService).config;
  if (appConfig.env == EnvironmentType.DEVELOP) {
    const options = new DocumentBuilder()
      .setTitle('Mars Rover Kata')
      .setDescription('Api to move mars rover from remote')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);
  }

  await app.listen(appConfig.port);
}
bootstrap();
