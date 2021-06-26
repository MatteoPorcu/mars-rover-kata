import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as validator from 'class-validator';

@Injectable()
export abstract class ManagerConfigService<T = any> {
  private _config: T;

  get config(): T {
    return this._config;
  }

  constructor(protected configService: ConfigService) {
    this._config = this.createConfiguration();
    const validationError: validator.ValidationError[] = validator.validateSync(
      this._config as any,
      {
        whitelist: true,
        forbidNonWhitelisted: true,
      },
    );
    if (!validationError || Object.values(validationError).length > 0) {
      throw Error(`validation error: ${validationError}`);
    }
  }

  protected abstract createConfiguration(): T;
}


