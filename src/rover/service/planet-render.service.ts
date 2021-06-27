import { Injectable } from '@nestjs/common';
import { deserialize, serialize } from 'class-transformer';
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
    this.populateObstacles();
    // this.move(CommandEnum.BACKWARD);
    // this.move(CommandEnum.TURN_LEFT);
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

  populateObstacles() {
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
  ) {
    this._rover = new RoverModel(
      coordinates,
      direction,
      this.planet.behaviorMove,
      stepMove,
    );
  }

  move(moveCommand: CommandEnum) {
    switch (moveCommand) {
      case CommandEnum.FORWARD:
      case CommandEnum.BACKWARD: {
        const predictiveMove = this.rover.moveByDirection(moveCommand);
        if (!this.hasObstacles(predictiveMove)){
          this.rover.currentCoordinates = this.limitPlanetSize(predictiveMove);
        } else {
          throw new Error(
            `Obstacle detected in position x: ${predictiveMove.x}, y: ${predictiveMove.y}`,
          );
        }
        console.log('limitPlanet', this.rover.currentCoordinates);
        break;
      }
      case CommandEnum.TURN_RIGHT:
      case CommandEnum.TURN_LEFT: {
        this.rover.changeDirection(moveCommand);
        console.log('changeDirection', this.rover.currentDirection);
        break;
      }
      default: {
        throw new Error('error, invalid command');
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
}
