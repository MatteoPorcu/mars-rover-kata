import { HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getConfiguration } from '../../config/configuration';
import { DirectionEnum } from './model/direction.model';
import { CommandsDto } from './model/dto/commands.dto';
import { RoverDto } from './model/dto/rover.dto';
import { ObstaclesModel } from './model/obstacles.model';
import { PlanetRenderController } from './planet-render.controller';
import { PlanetConfigService } from './service/planet-config.service';
import { PlanetRenderService } from './service/planet-render.service';

describe('PlanetRenderController', () => {
  let controller: PlanetRenderController;
  let planetRenderService: PlanetRenderService;
  let obstacles: ObstaclesModel[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(getConfiguration('planet'))],
      controllers: [PlanetRenderController],
      providers: [PlanetRenderService, PlanetConfigService],
    }).compile();

    controller = module.get<PlanetRenderController>(PlanetRenderController);
    planetRenderService = module.get<PlanetRenderService>(PlanetRenderService);
    obstacles = [
      { x: 10, y: 1 },
      { x: 6, y: 2 },
      { x: 0, y: 9 },
      { x: 0, y: 10 },
      { x: 1, y: 5 },
      { x: 5, y: 2 },
      { x: 0, y: 1 },
      { x: 3, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 1 },
    ] as ObstaclesModel[];
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('rover', () => {
    it('should call rover api to landing the rover', async () => {
      const roverDto: RoverDto = {
        coordinates: { x: 0, y: 4 },
        direction: DirectionEnum.NORTH,
      };
      const rover = await controller.release(roverDto);
      expect(rover.data).toStrictEqual({
        currentCoordinates: { x: 0, y: 4 },
        currentDirection: 'N',
        guid: rover.data.guid,
      });
    });
  });

  describe('rover', () => {
    it('should call rover api to landing the rover but in the past coordinate there are an obstacles', async () => {
      planetRenderService.obstacles = obstacles;

      const roverDto: RoverDto = {
        coordinates: { x: 0, y: 10 },
        direction: DirectionEnum.NORTH,
      };
      expect.assertions(1);
      try {
        await controller.release(roverDto);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('rover/commands', () => {
    it('should call rover api to move the rover', async () => {
      const roverDto: RoverDto = {
        coordinates: { x: 0, y: 4 },
        direction: DirectionEnum.NORTH,
      };
      const commandsDto: CommandsDto = { command: 'FFFBBLFFRBBRFFFF' };
      planetRenderService.populateRover(
        roverDto.coordinates,
        roverDto.direction,
      );
      planetRenderService.obstacles = obstacles;

      const roverMoved = await controller.commands(commandsDto);
      expect(roverMoved.data).toStrictEqual({
        currentCoordinates: { x: 2, y: 3 },
        currentDirection: DirectionEnum.EAST,
        guid: roverMoved.data.guid,
      });
    });
  });

  describe('rover/commands', () => {
    it('should call rover api to move the rover, in this case it scan a obstacles', async () => {
      const roverDto: RoverDto = {
        coordinates: { x: 0, y: 4 },
        direction: DirectionEnum.NORTH,
      };
      const commandsDto: CommandsDto = { command: 'BBBRFF' };
      planetRenderService.populateRover(
        roverDto.coordinates,
        roverDto.direction,
      );
      planetRenderService.obstacles = obstacles;
      expect.assertions(1);
      try {
        await controller.commands(commandsDto);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('rover/commands', () => {
    it('should call rover api to move the rover, in this case there are a command invalid', async () => {
      const roverDto: RoverDto = {
        coordinates: { x: 0, y: 4 },
        direction: DirectionEnum.NORTH,
      };
      const commandsDto: CommandsDto = { command: 'FFSFRBBRFFFF' };
      planetRenderService.populateRover(
        roverDto.coordinates,
        roverDto.direction,
      );
      planetRenderService.obstacles = obstacles;
      expect.assertions(1);
      try {
        await controller.commands(commandsDto);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('rover/commands', () => {
    it('should call rover api to move the rover, in this case the rover has not landed yet', async () => {
      const commandsDto: CommandsDto = { command: 'FFFBBLFFRBBRFFFF' };
      expect.assertions(1);
      try {
        await controller.commands(commandsDto);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });
});
