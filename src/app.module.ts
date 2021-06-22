import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getConfiguration } from '../config/configuration';
import { AppConfigService } from "./app-config.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getConfiguration('common')],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [AppConfigService],
})
export class AppModule { }
