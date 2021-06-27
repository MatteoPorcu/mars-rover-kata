import { classToClass, Exclude, Expose, Transform } from 'class-transformer';
import { BehaviorMoveConfigModel } from '../../common/model/planet-config.model';
import { CommandEnum, Move, MoveCommand, TurnCommand } from './command.model';
import { CoordinatesModel } from './coordinates.model';
import {
  BehaviorDirectionModel,
  DirectionEnum,
  DirectionModel,
} from './direction.model';

export class RoverModel extends Move {
  @Exclude()
  private _currentCoordinates: CoordinatesModel;
  @Exclude()
  private _currentDirection: DirectionModel;
  @Exclude()
  protected _directionsBehavior: DirectionModel[] = [];
  @Exclude()
  private _behaviorMoveConfig: BehaviorMoveConfigModel[];
  @Exclude()
  private _currentStepMove: CoordinatesModel;
  @Exclude()
  private _guid: string;

  constructor(
    coordinates: CoordinatesModel,
    direction: DirectionEnum,
    behaviorMoveConfig: BehaviorMoveConfigModel[],
    stepMove: CoordinatesModel = { x: 1, y: 1 },
    guid: string,
  ) {
    super();
    this._behaviorMoveConfig = behaviorMoveConfig;
    this.currentCoordinates = coordinates;
    this.currentStepMove = stepMove;
    this.populateDirectionsBehavior();
    this.populateCurrentDirection(direction);
    this.guid = guid;
  }

  @Expose({ name: 'currentCoordinates' })
  get currentCoordinates(): CoordinatesModel {
    return this._currentCoordinates;
  }
  set currentCoordinates(value: CoordinatesModel) {
    this._currentCoordinates = value;
  }
  @Transform(({ value }) => value['cardinal'], { toPlainOnly: true })
  @Expose({ name: 'currentDirection' })
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
  get currentStepMove(): CoordinatesModel {
    return this._currentStepMove;
  }
  set currentStepMove(value: CoordinatesModel) {
    this._currentStepMove = value;
  }
  get behaviorMoveConfig(): BehaviorMoveConfigModel[] {
    return this._behaviorMoveConfig;
  }
  @Expose({ name: 'guid' })
  public get guid(): string {
    return this._guid;
  }
  public set guid(value: string) {
    this._guid = value;
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
