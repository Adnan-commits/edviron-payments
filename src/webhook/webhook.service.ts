import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from '../schemas/transaction.schema';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) {}

  /**
   * Update transaction status by paymentId
   */
  async updateTransaction(paymentId: string, status: string) {
    try {
      const now = new Date();
      const update: any = { status, updatedAt: now };
      if (status === 'success') update.processedAt = now;

      const updated = await this.transactionModel.findOneAndUpdate(
        { paymentId },
        update,
        { new: true },
      );

      if (!updated) {
        this.logger.warn(`Webhook update requested for unknown paymentId=${paymentId}`);
        throw new NotFoundException('paymentId not found');
      }

      this.logger.log(`Webhook processed: paymentId=${paymentId} status=${status}`);
      return updated;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      this.logger.error('Webhook update failed', err);
      throw new InternalServerErrorException('Webhook processing failed');
    }
  }
}
