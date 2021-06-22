import { Type } from 'class-transformer';
import { IsDefined } from 'class-validator';

export class JwtConfigModel {
    @IsDefined({ message: 'secret string must be set' })
    secret: string;
    @Type(() => JwtSignOptionsConfigModel)
    signOptions: JwtSignOptionsConfigModel;
}

export class JwtSignOptionsConfigModel {
    expiresIn: string;
}