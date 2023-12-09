import { Test, TestingModule } from '@nestjs/testing';
import { WalletsAssetsService } from './wallets-assets.service';

describe('WalletsAssetsService', () => {
  let service: WalletsAssetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletsAssetsService],
    }).compile();

    service = module.get<WalletsAssetsService>(WalletsAssetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
