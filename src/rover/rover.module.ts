import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getConfiguration } from '../../config/configuration';
import { PlanetConfigService } from './service/planet-config.service';
import { PlanetService } from "./service/planet.service";

@Module({
    imports: [
        ConfigModule.forFeature(getConfiguration('planet'))
    ],
    providers: [PlanetService, PlanetConfigService],
})
export class RoverModule { }
