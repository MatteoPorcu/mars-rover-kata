import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export abstract class ManagerConfigService<T> {
  private _config: T;

  get config(): T {
    return this._config;
  }

  constructor(protected configService: ConfigService) {
    this._config = this.createConfiguration();
  }

  protected abstract createConfiguration(): T;
}
