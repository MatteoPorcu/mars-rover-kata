import {
  BehaviorMoveConfigModel,
  CommandConfigModel,
} from '../../common/model/planet-config.model';
import { CommandEnum, Move } from './command.model';

export enum DirectionEnum {
  NORTH = 'N',
  EAST = 'E',
  SOUTH = 'S',
  WEST = 'W',
}

export enum AxisEnum {
  AXIS_X = 'x',
  AXIS_Y = 'y',
}

export enum BehaviorTypeEnum {
  INCREASE = 0,
  DECREASE = 1,
}

export class BehaviorDirectionModel extends CommandConfigModel {
  function?: typeof Move.prototype.increase | typeof Move.prototype.decrease;
}

export class DirectionModel extends BehaviorMoveConfigModel {
  command: BehaviorDirectionModel[];
}
