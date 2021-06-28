import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { CommonConfigModel } from './common-config.model';
import { PlanetConfigModel } from './planet-config.model';

export class ApplicationConfigModel {
  @IsDefined()
  @ValidateNested()
  @Type(() => CommonConfigModel)
  common: CommonConfigModel;
  @IsDefined()
  @ValidateNested()
  @Type(() => PlanetConfigModel)
  planet: PlanetConfigModel;
}
