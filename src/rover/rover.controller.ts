import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { RestBaseResponse } from '../common/model/rest.model';
import { RoverDto } from './model/dto/rover.dto';
import { PlanetRenderService } from './service/planet-render.service';
import { RoverModel } from './model/rover.model';
import { classToPlain } from 'class-transformer';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';

@Controller('rover')
export class RoverController {
  constructor(private planetRenderService: PlanetRenderService) { }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBody({ type: RoverDto })
  @ApiOkResponse({ content: { 'application/json': {} } })
  @HttpCode(HttpStatus.OK)
  @Post()
  async release(
    @Body() roverDto: RoverDto,
  ): Promise<RestBaseResponse<RoverModel>> {
    try {
      this.planetRenderService.populateRover(
        roverDto.coordinates,
        roverDto.direction,
      );
      const response: RestBaseResponse<RoverModel> = {
        message: `the Rover landed successfully`,
        data: <RoverModel>classToPlain(this.planetRenderService.rover),
      };
      return response;
    } catch (error) {
      throw new HttpException(
        <RestBaseResponse<void>>{ message: error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
