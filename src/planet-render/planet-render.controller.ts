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
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { classToPlain } from 'class-transformer';
import { RestBaseResponse } from '../common/model/rest.model';
import { CommandEnum } from './model/command.model';
import { CommandsDto } from './model/dto/commands.dto';
import { RoverDto } from './model/dto/rover.dto';
import { RoverModel } from './model/rover.model';
import { PlanetRenderService } from './service/planet-render.service';

@Controller('rover')
export class PlanetRenderController {
  constructor(private planetRenderService: PlanetRenderService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBody({ type: RoverDto })
  @ApiOkResponse({ content: { 'application/json': {} } })
  @HttpCode(HttpStatus.OK)
  @Post()
  async release(
    @Body() roverDto: RoverDto,
  ): Promise<RestBaseResponse<RoverModel>> {
    let roverLanded: RoverModel;
    try {
      roverLanded = this.planetRenderService.populateRover(
        roverDto.coordinates,
        roverDto.direction,
      );
    } catch (error) {
      throw new HttpException(
        <RestBaseResponse<void>>{ message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
    const response: RestBaseResponse<RoverModel> = {
      message: `the Rover landed successfully`,
      data: roverLanded,
    };
    return response;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBody({ type: CommandsDto })
  @ApiOkResponse({ content: { 'application/json': {} } })
  @HttpCode(HttpStatus.OK)
  @Post('commands')
  async commands(
    @Body() commands: CommandsDto,
  ): Promise<RestBaseResponse<RoverModel>> {
    let response: RestBaseResponse<RoverModel>;
    try {
      const commandList: CommandEnum[] =
        this.planetRenderService.splitStringToCommand(commands.command);
      commandList.forEach((singleCommand: CommandEnum) => {
        this.planetRenderService.move(singleCommand);
      });
      const rover = <RoverModel>classToPlain(this.planetRenderService.rover);
      response = {
        message: `the Rover moved with succesfully, current coordinate x: ${rover.currentCoordinates.x}, y: ${rover.currentCoordinates.y}, direction: ${rover.currentDirection}`,
        data: <RoverModel>classToPlain(this.planetRenderService.rover),
      };
    } catch (error) {
      throw new HttpException(
        <RestBaseResponse<RoverModel>>{
          message: error.message,
          data: <RoverModel>classToPlain(this.planetRenderService.rover),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return response;
  }
}
