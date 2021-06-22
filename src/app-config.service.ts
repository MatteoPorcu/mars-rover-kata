import { Injectable } from '@nestjs/common';
import { TransformPlainToClass } from 'class-transformer';
import { CommonConfigModel } from './common/model/common-config.model';
import { ManagerConfigService } from './common/service/manager-config.service';

@Injectable()
export class AppConfigService extends ManagerConfigService<CommonConfigModel> {
  @TransformPlainToClass(CommonConfigModel)
  protected createConfiguration(): CommonConfigModel {
    return this.configService.get('common');
  }
}
