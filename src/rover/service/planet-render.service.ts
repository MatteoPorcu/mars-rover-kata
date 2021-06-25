import { Injectable } from '@nestjs/common';
import { PlanetConfigModel } from '../../common/model/planet-config.model';
import { CommandEnum } from '../model/command.model';
import { CoordinatesModel } from '../model/coordinates.model';
import { DirectionEnum, DirectionModel } from '../model/direction.model';
import { RoverModel } from '../model/rover.model';
import { PlanetConfigService } from './planet-config.service';

@Injectable()
export class PlanetRenderService {
  planet: PlanetConfigModel = this.planetConfigService.config;
  private _rover: RoverModel;
  private _cardinals: DirectionModel[] = [];

  constructor(private planetConfigService: PlanetConfigService) {
    this.populateRover({ x: 3, y: 2 }, DirectionEnum.WEST, { x: 3, y: 3 });
    console.log(this.rover.currentDirection);
    this.move(CommandEnum.FORWARD);
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

  get rover(): RoverModel {
    return this._rover;
  }

  get cardinals(): DirectionModel[] {
    return this._cardinals;
  }

  move(moveCommand: CommandEnum) {
    switch (moveCommand) {
      case CommandEnum.FORWARD || CommandEnum.BACKWARD: {
        const predictiveMove = this.rover.moveByDirection(moveCommand);
        console.log(predictiveMove, this.rover.currentCoordinates);
        this.rover.currentCoordinates = this.limitPlanetSize(predictiveMove);
        console.log('limitPlanet', this.rover.currentCoordinates);
        break;
      }
      case CommandEnum.TURN_RIGHT || CommandEnum.TURN_LEFT: {
        // this.rover.predictiveMove();
        break;
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
