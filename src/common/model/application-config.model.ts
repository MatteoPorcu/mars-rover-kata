import { Type } from 'class-transformer';
import { IsDefined, IsOptional, ValidateNested } from 'class-validator';
import { CommonConfigModel } from './common-config.model';
import { JwtConfigModel } from './jwt-config.model';
import { PlanetConfigModel } from './planet-config.model';

export class ApplicationConfigModel {
  @IsDefined()
  @ValidateNested()
  @Type(() => CommonConfigModel)
  common: CommonConfigModel;
  @IsOptional()
  @Type(() => JwtConfigModel)
  jwt: JwtConfigModel;
  @IsDefined()
  @ValidateNested()
  @Type(() => PlanetConfigModel)
  planet: PlanetConfigModel;
}
