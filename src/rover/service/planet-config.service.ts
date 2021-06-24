import { Injectable } from '@nestjs/common';
import { TransformPlainToClass } from 'class-transformer';
import { ManagerConfigService } from '../../common/service/manager-config.service';
import { PlanetConfigModel } from "../../common/model/planet-config.model";

@Injectable()
export class PlanetConfigService extends ManagerConfigService<PlanetConfigModel> {
  @TransformPlainToClass(PlanetConfigModel)
  protected createConfiguration(): PlanetConfigModel {
    return this.configService.get('planet');
  }
}
