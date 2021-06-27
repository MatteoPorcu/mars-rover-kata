import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getConfiguration } from '../config/configuration';
import { AppConfigService } from './app-config.service';
import { PlanetRenderModule } from './planet-render/planet-render.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getConfiguration('common')],
      isGlobal: true,
    }),
    PlanetRenderModule,
  ],
  controllers: [],
  providers: [AppConfigService],
})
export class AppModule {}
