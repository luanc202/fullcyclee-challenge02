import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { WalletsAssetsService } from './wallets-assets/wallets-assets.service';
import { WalletsAssetsController } from './wallets-assets/wallets-assets.controller';

@Module({
  controllers: [WalletsController, WalletsAssetsController],
  providers: [WalletsService, WalletsAssetsService],
})
export class WalletsModule {}
