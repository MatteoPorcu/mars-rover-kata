import { classToClass } from 'class-transformer';
import { BehaviorMoveConfigModel } from '../../common/model/planet-config.model';
import { Move, MoveCommand } from './command.model';
import { CoordinatesModel } from './coordinates.model';
import { DirectionEnum, DirectionModel } from './direction.model';

export class RoverModel extends Move {
  private _currentCoordinates: CoordinatesModel;
  private _currentDirection: DirectionModel;
  protected _directionsBehavior: DirectionModel[] = [];
  private _behaviorMoveConfig: BehaviorMoveConfigModel[];

  constructor(
    coordinates: CoordinatesModel,
    direction: DirectionEnum,
    behaviorMoveConfig: BehaviorMoveConfigModel[],
  ) {
    super();
    this._behaviorMoveConfig = behaviorMoveConfig;
    this.currentCoordinates = coordinates;
    this.populateDirectionsBehavior();
    this.populateCurrentDirection(direction);
  }

  get currentCoordinates(): CoordinatesModel {
    return this._currentCoordinates;
  }
  set currentCoordinates(value: CoordinatesModel) {
    this._currentCoordinates = value;
  }
  get currentDirection(): DirectionModel {
    return this._currentDirection;
  }
  set currentDirection(value: DirectionModel) {
    this._currentDirection = value;
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

  private populateDirectionsBehavior(): DirectionModel[] {
    this.directionsBehavior = classToClass(this.behaviorMoveConfig);
    this.directionsBehavior.forEach((behaviorCommand) => {
      behaviorCommand.command.map((behavior) => {
        behavior.function = behavior.direction
          ? (axis) => this.increase(axis)
          : (axis) => this.decrease(axis);
        return behavior;
      });
    });
    return this.directionsBehavior;
  }

  private populateCurrentDirection(direction: DirectionEnum) {
    this.currentDirection = this.directionsBehavior.find((directionConfig) => {
      return directionConfig.cardinal === direction;
    });
  }

  moveByDirection(moveCommand: MoveCommand): CoordinatesModel {
    const predictiveCoordinate: CoordinatesModel = {
      ...this.currentCoordinates,
    };
    const currentCommand = this.currentDirection.command.find((current) => {
      return current.type === moveCommand;
    });
    predictiveCoordinate[this.currentDirection.axis] = currentCommand.function(
      predictiveCoordinate[this.currentDirection.axis],
    );
    return predictiveCoordinate;
  }

  increase(point: number): number {
    return point + 1;
  }

  decrease(point: number): number {
    return point - 1;
  }
}
