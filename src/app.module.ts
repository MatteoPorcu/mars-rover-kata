import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getConfiguration } from '../config/configuration';
import { AppConfigService } from "./app-config.service";
import { RoverModule } from './rover/rover.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getConfiguration('common')],
      isGlobal: true,
    }),
    RoverModule,
  ],
  controllers: [],
  providers: [AppConfigService],
})
export class AppModule { }
