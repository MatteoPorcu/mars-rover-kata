import { Type } from 'class-transformer';
import {
  AxisEnum,
  DirectionEnum,
  BehaviorTypeEnum,
} from '../../rover/model/direction.model';
import { CommandEnum } from '../../rover/model/command.model';

export class PlanetConfigModel {
  size: number;
  obstaclesNumber: number;
  @Type(() => BehaviorMoveConfigModel)
  behaviorMove: BehaviorMoveConfigModel[];
}

export class BehaviorMoveConfigModel {
  cardinal: DirectionEnum;
  axis: AxisEnum;
  @Type(() => CommandConfigModel)
  command: CommandConfigModel[];
}

export class CommandConfigModel {
  type: CommandEnum;
  direction: BehaviorTypeEnum;
}
