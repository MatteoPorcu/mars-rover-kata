import { DirectionModel } from "./direction.model";
export enum CommandEnum {
    FORWARD = 'F',
    BACKWARD = 'B',
    TURN_LEFT = 'L',
    TURN_RIGHT = 'R'
}

export type MoveCommand = CommandEnum.FORWARD | CommandEnum.BACKWARD;
export type TurnCommand = CommandEnum.TURN_LEFT | CommandEnum.TURN_RIGHT;


export abstract class Move {
    abstract increase(point: number): number
    abstract decrease(point: number): number
    protected abstract _directionsBehavior: DirectionModel[]; 

}