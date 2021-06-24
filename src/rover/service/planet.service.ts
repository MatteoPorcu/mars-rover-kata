import { Injectable } from "@nestjs/common";
import { PlanetConfigModel } from "../../common/model/planet-config.model";
import { CommandEnum } from "../model/command.model";
import { CoordinatesModel } from '../model/coordinates.model';
import { DirectionEnum, DirectionModel } from "../model/direction.model";
import { RoverModel } from "../model/rover.model";
import { PlanetConfigService } from './planet-config.service';

@Injectable()
export class PlanetService {
    planet: PlanetConfigModel = this.planetConfigService.config;
    private _rover: RoverModel;
    private _cardinals: DirectionModel[] = [];

    constructor(private planetConfigService: PlanetConfigService) {
        this.populateRover({x: 1, y:2}, DirectionEnum.NORTH)
        console.log(this.rover.currentDirection);
        const predictiveMove = this.rover.moveByDirection(CommandEnum.FORWARD);
        console.log(predictiveMove, this.rover.currentCoordinates);
    }

    populateRover(coordinates: CoordinatesModel, direction: DirectionEnum) {
        this._rover = new RoverModel(coordinates, direction, this.planet.behaviorMove);
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
                const predictiveMove = this.rover.moveByDirection(moveCommand)
                this.rover.currentCoordinates = predictiveMove;
                break
            }
            case CommandEnum.TURN_RIGHT || CommandEnum.TURN_LEFT: {
                // this.rover.predictiveMove();
                break
            }
        }
    }
}