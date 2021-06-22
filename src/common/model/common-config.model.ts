import { IsDefined, IsNumber } from 'class-validator';

export enum EnvironmentType {
  DEVELOP = 'develop' as any,
  PROD = 'production' as any,
  STAGING = 'staging' as any,
}

export class CommonConfigModel {
  env: EnvironmentType;

  @IsDefined()
  @IsNumber()
  port: number;
}
