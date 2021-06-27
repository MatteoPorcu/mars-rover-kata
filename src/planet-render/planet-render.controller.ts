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
import { CommandsDto } from './model/dto/commands.dto';
import { CommandEnum } from './model/command.model';

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
        <RestBaseResponse<void>>{ message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('commands')
  async commands(
    @Body() commands: CommandsDto,
  ): Promise<RestBaseResponse<RoverModel>> {
    try {
      const commandList: CommandEnum[] =
        this.planetRenderService.splitStringToCommand(commands.command);
      commandList.forEach((singleCommand: CommandEnum) => {
        this.planetRenderService.move(singleCommand);
      });
      const rover = <RoverModel>classToPlain(this.planetRenderService.rover);
      const response: RestBaseResponse<RoverModel> = {
        message: `the Rover moved with succesfully, current coordinate x: ${rover.currentCoordinates.x}, y: ${rover.currentCoordinates.y}, direction: ${rover.currentDirection.cardinal}`,
        data: <RoverModel>classToPlain(this.planetRenderService.rover),
      };
      return response;
    } catch (error) {
      throw new HttpException(
        <RestBaseResponse<RoverModel>>{
          message: error.message,
          data: <RoverModel>classToPlain(this.planetRenderService.rover),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
