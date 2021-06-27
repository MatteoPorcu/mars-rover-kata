import { Test, TestingModule } from '@nestjs/testing';
import { PlanetRenderController } from './planet-render.controller';

describe('PlanetRenderController', () => {
  let controller: PlanetRenderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanetRenderController],
    }).compile();

    controller = module.get<PlanetRenderController>(PlanetRenderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
