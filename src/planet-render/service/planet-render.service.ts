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

  /**
   * constructor expects the configurations and launches the random population of obstacles
   * @constructor
   * @param {PlanetConfigService} [planetConfigService]
   */
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

  /**
   * method that populates the planet service with a random list of obstacles,
   * the obstacles before being assigned to the attribute have been assigned to the Sets object 
   * to make the list of obstacles unique
   */
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

  /**
   * method that check if the past coordinates belong to the list of obstacles
   * @param {CoordinatesModel} [coordinate] - mandatory parameter to check obstacles
   * @returns {boolean} true or false in case the past coordinates belong to the list of obstacles
   */
  hasObstacles(coordinate: CoordinatesModel): boolean {
    const currentObstacle = this.obstacles.find((obstacle: ObstaclesModel) => {
      return obstacle.x === coordinate.x && obstacle.y === coordinate.y;
    });
    return currentObstacle ? true : false;
  }

  /**
   * method that populate the rover instance
   * @param {CoordinatesModel} [coordinates]
   * @param {DirectionEnum} [direction]
   * @param {CoordinatesModel} [stepMove] - optional parameter
   * @returns {RoverModel} transformed by class-transform
   */
  populateRover(
    coordinates: CoordinatesModel,
    direction: DirectionEnum,
    stepMove?: CoordinatesModel,
  ): RoverModel {
    if (!this.hasObstacles(coordinates)) {
      this._rover = new RoverModel(
        coordinates,
        direction,
        this.planet.behaviorMove,
        stepMove,
        this.newGuid(),
      );
    } else {
      this.cleanRoverInstance();
      throw new Error(
        `it is impossible to land the Rover, in coordinates {x: ${coordinates.x}, y: ${coordinates.y}} there are an obstacles`,
      );
    }
    return <RoverModel>classToPlain(this.rover);
  }

  private cleanRoverInstance() {
    this._rover = null;
  }

  /**
   * method that split a screen and generate a list of CommandEnum
   * @param {string} [commands] - is a string char of commands
   * @returns CommandEnum list validated
   */
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

  /**
   * method that, in base a past parameter, launch moveByDirection or chandeDirection functionality
   * (with obstacles detection)
   * @param {CommandEnum} [moveCommand]
   */
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

  /**
   * method that check the limit size of planet
   * @param {CoordinatesModel} [coordinates]
   * @returns {CoordinatesModel} copyCoordinates edited using the limit of planet
   */
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

  /**
   * method that check if the rover instance is populated
   * @returns {boolean} in base at the presence of the rover instance
   */
  checkRoverInstance(): boolean {
    if (this.rover) {
      return true;
    } else {
      throw new Error(
        `The rover has not landed yet, please re-launch it to Mars`,
      );
    }
  }

  /**
   * method that generate random guid
   * @returns {string} - random string
   */
  newGuid(): string {
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
