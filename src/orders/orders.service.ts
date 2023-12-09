import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InitTransactionDto, InputExecuteTransactionDto } from './order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prismaService: PrismaService) {}

  initTransaction(input: InitTransactionDto) {
    return this.prismaService.order.create({
      data: {
        asset_id: input.asset_id,
        wallet_id: input.wallet_id,
        shares: input.shares,
        partial: input.shares,
        price: input.price,
        type: input.type,
        status: OrderStatus.PENDING,
        version: 1,
      },
    });
  }

  async executeTransaction(input: InputExecuteTransactionDto) {
    const order = await this.prismaService.order.findUniqueOrThrow({
      where: { id: input.order_id },
    });
    await this.prismaService.order.update({
      where: { id: input.order_id },
      data: {
        partial: order.partial - input.negotiated_shares,
        status: input.status,
        Transactions: {
          create: {
            related_investor_id: input.related_investor_id,
            broker_transaction_id: input.broker_investor_id,
            shares: input.negotiated_shares,
            price: input.price,
          },
        },
      },
    });
    if (input.status == OrderStatus.CLOSED) {
      await this.prismaService.asset.update({
        where: { id: order.asset_id },
        data: {
          price: input.price,
        },
      });
      await this.prismaService.walletAsset.findUnique({
        where: {
          wallet_id_asset_id: {
            asset_id: order.asset_id,
            wallet_id: order.wallet_id,
          },
        },
      });
      const walletAsset = await this.prismaService.walletAsset.findUnique({
        where: {
          wallet_id_asset_id: {
            asset_id: order.asset_id,
            wallet_id: order.wallet_id,
          },
        },
      });
      if (walletAsset) {
        await this.prismaService.walletAsset.update({
          where: {
            wallet_id_asset_id: {
              asset_id: order.asset_id,
              wallet_id: order.wallet_id,
            },
          },
          data: {
            shares: walletAsset.shares + input.negotiated_shares,
          },
        });
      } else {
        await this.prismaService.walletAsset.create({
          data: {
            asset_id: order.asset_id,
            wallet_id: order.wallet_id,
            shares: input.negotiated_shares,
            version: 1,
          },
        });
      }
    }
  }
}
