import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getConfiguration } from '../../config/configuration';
import { PlanetConfigService } from './service/planet-config.service';
import { PlanetRenderService } from './service/planet-render.service';
import { RoverController } from './rover.controller';

@Module({
  imports: [ConfigModule.forFeature(getConfiguration('planet'))],
  providers: [PlanetRenderService, PlanetConfigService],
  controllers: [RoverController],
})
export class RoverModule {}
