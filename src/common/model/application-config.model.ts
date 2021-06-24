import { Type } from 'class-transformer';
import { CommonConfigModel } from './common-config.model';
import { JwtConfigModel } from "./jwt-config.model";
import { PlanetConfigModel } from './planet-config.model';

export class ApplicationConfigModel{
    @Type(() => CommonConfigModel)
    common: CommonConfigModel;
    @Type(() => JwtConfigModel)
    jwt: JwtConfigModel;
    @Type(() => PlanetConfigModel)
    planet: PlanetConfigModel;
}