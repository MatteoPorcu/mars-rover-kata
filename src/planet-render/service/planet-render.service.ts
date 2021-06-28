import { Injectable } from '@nestjs/common';
import { classToPlain, deserialize, serialize } from 'class-transformer';
import { PlanetConfigModel } from '../../common/model/planet-config.model';
import { CommandEnum } from '../model/command.model';
import { CoordinatesModel } from '../model/coordinates.model';
import { DirectionEnum, DirectionModel } from '../model/direction.model';
import { ObstaclesModel } from '../model/obstacles.model';
import { RoverModel } from '../model/rover.model';
import { PlanetConfigService } from './planet-config.service';

@Injectable()
export class PlanetRenderService {
  planet: PlanetConfigModel = this.planetConfigService.config;
  private _rover: RoverModel;
  private _cardinals: DirectionModel[] = [];
  private _obstacles: ObstaclesModel[] = [];

  constructor(private planetConfigService: PlanetConfigService) {
    this.populateRandomObstacles();
  }

  get rover(): RoverModel {
    return this._rover;
  }

  get cardinals(): DirectionModel[] {
    return this._cardinals;
  }

  get obstacles(): ObstaclesModel[] {
    return this._obstacles;
  }

  set obstacles(value: ObstaclesModel[]) {
    this._obstacles = value;
  }

  populateRandomObstacles() {
    const uniquePositions = new Set();
    while (uniquePositions.size < this.planet.obstaclesNumber) {
      uniquePositions.add(
        serialize<ObstaclesModel>(new ObstaclesModel(this.planet.size)),
      );
    }
    uniquePositions.forEach((position: string) => {
      deserialize(ObstaclesModel, position);
      this.obstacles.push(deserialize(ObstaclesModel, position));
    });
  }

  hasObstacles(coordinate: CoordinatesModel): boolean {
    const currentObstacle = this.obstacles.find((obstacle: ObstaclesModel) => {
      return obstacle.x === coordinate.x && obstacle.y === coordinate.y;
    });
    return currentObstacle ? true : false;
  }

  populateRover(
    coordinates: CoordinatesModel,
    direction: DirectionEnum,
    stepMove?: CoordinatesModel,
  ): RoverModel {
    this._rover = new RoverModel(
      coordinates,
      direction,
      this.planet.behaviorMove,
      stepMove,
      this.newGuid(),
    );
    return <RoverModel>classToPlain(this.rover);
  }

  splitStringToCommand(commands: string): CommandEnum[] {
    const commandList: string[] = [...commands];
    const commandEnum = Object.values(CommandEnum);
    const hasInvalidCommand = !commandList.every((command: CommandEnum) => {
      return commandEnum.includes(command);
    });
    if (hasInvalidCommand) {
      throw new Error(`Invalid command to move the Rover`);
    }
    return commandList as CommandEnum[];
  }

  move(moveCommand: CommandEnum) {
    if (this.checkRoverInstance()) {
      switch (moveCommand) {
        case CommandEnum.FORWARD:
        case CommandEnum.BACKWARD: {
          const predictiveMove = this.rover.moveByDirection(moveCommand);
          if (!this.hasObstacles(predictiveMove)) {
            this.rover.currentCoordinates =
              this.limitPlanetSize(predictiveMove);
          } else {
            throw new Error(
              `Obstacle detected in position x: ${predictiveMove.x}, y: ${predictiveMove.y}`,
            );
          }
          break;
        }
        case CommandEnum.TURN_RIGHT:
        case CommandEnum.TURN_LEFT: {
          this.rover.changeDirection(moveCommand);
          break;
        }
        default: {
          throw new Error('error, invalid command');
        }
      }
    }
  }

  limitPlanetSize(coordinates: CoordinatesModel): CoordinatesModel {
    let dif: number;
    const copyCoordinates: CoordinatesModel = { ...coordinates };
    Object.keys(copyCoordinates).forEach((key: string) => {
      if (copyCoordinates[key] > this.planet.size) {
        // added minus one to the difference to align the calculation to starting from zero
        dif = copyCoordinates[key] - this.planet.size - 1;
        copyCoordinates[key] = 0 + dif;
      } else if (copyCoordinates[key] < 0) {
        // plus one added to the difference to align the calculation to starting from zero
        dif = copyCoordinates[key] - 0 + 1;
        copyCoordinates[key] = this.planet.size + dif;
      }
    });
    return copyCoordinates;
  }

  checkRoverInstance(): boolean {
    if (this.rover) {
      return true;
    } else {
      throw new Error(
        `The rover has not landed yet, please re-launch it to Mars`,
      );
    }
  }

  newGuid() {
    return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }
}
