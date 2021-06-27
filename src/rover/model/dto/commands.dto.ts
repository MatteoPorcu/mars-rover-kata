import { ApiProperty } from '@nestjs/swagger';

export class CommandsDto {
  @ApiProperty()
  command: string;
}
