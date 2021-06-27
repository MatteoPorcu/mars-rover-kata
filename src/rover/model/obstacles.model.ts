import { Exclude } from 'class-transformer';
import { CoordinatesModel } from './coordinates.model';

export class ObstaclesModel implements CoordinatesModel {
  x: number;
  y: number;
  @Exclude()
  max: number;

  constructor(max: number) {
    this.max = max;
    this.setPosition();
  }

  randomNumber(): number {
    return Math.floor(Math.random() * this.max) + 1;
  }

  setPosition() {
    this.x = this.randomNumber();
    this.y = this.randomNumber();
  }
}
