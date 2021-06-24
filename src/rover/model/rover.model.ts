import { classToClass } from 'class-transformer';
import { BehaviorMoveConfigModel } from '../../common/model/planet-config.model';
import { Move, MoveCommand } from "./command.model";
import { CoordinatesModel } from './coordinates.model';
import { BehaviorDirectionModel, DirectionEnum, DirectionModel } from "./direction.model";

export class RoverModel extends Move {
    private _currentCoordinates: CoordinatesModel;
    private _currentDirection: DirectionModel;
    protected _directionsBehavior: DirectionModel[] = [];
    private _behaviorMoveConfig: BehaviorMoveConfigModel[];

    constructor(coordinates: CoordinatesModel,
        direction: DirectionEnum,
        behaviorMoveConfig: BehaviorMoveConfigModel[]
    ) {
        super();
        this._behaviorMoveConfig = behaviorMoveConfig;
        console.log(this.behaviorMoveConfig[0].command, "prova");
        this.currentCoordinates = coordinates;
        this.populateDirectionsBehavior();
        this.currentDirection = this.directionsBehavior.find(directionConfig => {
            return directionConfig.cardinal === direction
        });
    }

    private populateDirectionsBehavior(): DirectionModel[] {
        this.directionsBehavior = classToClass(this.behaviorMoveConfig);
        this.directionsBehavior.forEach(behaviorCommand =>{
            behaviorCommand.command.map(behavior =>{ 
                behavior.function = behavior.type
                                ? (axis) => this.increase(axis)
                                : (axis) => this.decrease(axis)
                return behavior
                        
            });
        });
        return this.directionsBehavior;
    }

    moveByDirection(moveCommand: MoveCommand): CoordinatesModel {
        let predictiveCoordinate: CoordinatesModel = {...this.currentCoordinates};
        let currentCommand = this.currentDirection.command.find(current => {
            return current.type === moveCommand
        });
        predictiveCoordinate[this.currentDirection.axis] = currentCommand.function(predictiveCoordinate[this.currentDirection.axis]);
        return predictiveCoordinate;
    }

    increase(point: number): number {
        return point + 1;
    }

    decrease(point: number): number {
        return point - 1;
    }

    get currentCoordinates(): CoordinatesModel {
        return this._currentCoordinates;
    }
    set currentDirection(value: DirectionModel) {
        this._currentDirection = value;
    }

    get currentDirection(): DirectionModel {
        return this._currentDirection;
    }
    set currentCoordinates(value: CoordinatesModel) {
        this._currentCoordinates = value;
    }

    get directionsBehavior(): DirectionModel[] {
        return this._directionsBehavior;
    }
    set directionsBehavior(value: DirectionModel[]) {
        this._directionsBehavior = value;
    }

    get behaviorMoveConfig(): BehaviorMoveConfigModel[] {
        return this._behaviorMoveConfig;
    }
}