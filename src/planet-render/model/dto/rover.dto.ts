import { CoordinatesModel } from '../coordinates.model';
import { DirectionEnum } from '../direction.model';
import { ApiProperty } from '@nestjs/swagger';

export class RoverDto {
  @ApiProperty()
  coordinates: CoordinatesModel;
  @ApiProperty()
  direction: DirectionEnum;
}
