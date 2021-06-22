import { Type } from 'class-transformer';
import { CommonConfigModel } from './common-config.model';

export class ApplicationConfigModel{
    @Type(() => CommonConfigModel)
    common: CommonConfigModel;
}