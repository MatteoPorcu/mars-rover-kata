import { classToClass } from 'class-transformer';
import { BehaviorMoveConfigModel } from '../../common/model/planet-config.model';
import { Move, MoveCommand, TurnCommand, CommandEnum } from './command.model';
import { CoordinatesModel } from './coordinates.model';
import {
  DirectionEnum,
  DirectionModel,
  BehaviorDirectionModel,
} from './direction.model';

export class RoverModel extends Move {
  private _currentCoordinates: CoordinatesModel;
  private _currentDirection: DirectionModel;
  protected _directionsBehavior: DirectionModel[] = [];
  private _behaviorMoveConfig: BehaviorMoveConfigModel[];
  private _currentStepMove: CoordinatesModel;

  constructor(
    coordinates: CoordinatesModel,
    direction: DirectionEnum,
    behaviorMoveConfig: BehaviorMoveConfigModel[],
    stepMove: CoordinatesModel = { x: 1, y: 1 },
  ) {
    super();
    this._behaviorMoveConfig = behaviorMoveConfig;
    this.currentCoordinates = coordinates;
    this.currentStepMove = stepMove;
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
  public get currentStepMove(): CoordinatesModel {
    return this._currentStepMove;
  }
  public set currentStepMove(value: CoordinatesModel) {
    this._currentStepMove = value;
  }
  get behaviorMoveConfig(): BehaviorMoveConfigModel[] {
    return this._behaviorMoveConfig;
  }

  private populateDirectionsBehavior(): DirectionModel[] {
    this.directionsBehavior = classToClass(this.behaviorMoveConfig);
    this.directionsBehavior.forEach((behaviorCommand) => {
      behaviorCommand.command.map((behavior) => {
        behavior.function = behavior.direction
          ? (axis, stepMove) => this.decreaseCoordinate(axis, stepMove)
          : (axis, stepMove) => this.increaseCoordinate(axis, stepMove);
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
    const currentCommand = this.retrieveCurrentCommand(moveCommand);
    predictiveCoordinate[this.currentDirection.axis] = currentCommand.function(
      predictiveCoordinate[this.currentDirection.axis],
      this.currentStepMove[this.currentDirection.axis],
    );
    return predictiveCoordinate;
  }

  increaseCoordinate(point: number, stepMove: number): number {
    return point + stepMove;
  }

  decreaseCoordinate(point: number, stepMove: number): number {
    return point - stepMove;
  }

  changeDirection(moveCommand: TurnCommand) {
    const currentCommand = this.retrieveCurrentCommand(moveCommand);
    this.populateCurrentDirection(currentCommand.cardinal);
  }

  retrieveCurrentCommand(moveCommand: CommandEnum): BehaviorDirectionModel {
    return this.currentDirection.command.find((current) => {
      return current.type === moveCommand;
    });
  }
}
