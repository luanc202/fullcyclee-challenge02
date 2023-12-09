import { Test, TestingModule } from '@nestjs/testing';
import { WalletsAssetsController } from './wallets-assets.controller';

describe('WalletsAssetsController', () => {
  let controller: WalletsAssetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletsAssetsController],
    }).compile();

    controller = module.get<WalletsAssetsController>(WalletsAssetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
