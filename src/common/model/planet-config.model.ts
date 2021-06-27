import { Type } from 'class-transformer';
import { IsDefined, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { CommandEnum } from '../../planet-render/model/command.model';
import {
  AxisEnum,
  BehaviorTypeEnum,
  DirectionEnum,
} from '../../planet-render/model/direction.model';

export class PlanetConfigModel {
  @IsDefined()
  size: number;
  @IsDefined()
  obstaclesNumber: number;
  @IsDefined()
  @ValidateNested()
  @Type(() => BehaviorMoveConfigModel)
  behaviorMove: BehaviorMoveConfigModel[];
}

export class BehaviorMoveConfigModel {
  @IsDefined()
  @IsEnum(DirectionEnum)
  cardinal: DirectionEnum;
  @IsDefined()
  @IsEnum(AxisEnum)
  axis: AxisEnum;
  @IsDefined()
  @ValidateNested()
  @Type(() => CommandConfigModel)
  command: CommandConfigModel[];
}

export class CommandConfigModel {
  @IsDefined()
  @IsEnum(CommandEnum)
  type: CommandEnum;
  @IsDefined()
  @IsOptional()
  @IsEnum(BehaviorTypeEnum)
  direction?: BehaviorTypeEnum;
  @IsDefined()
  @IsOptional()
  @IsEnum(DirectionEnum)
  cardinal?: DirectionEnum;
}
