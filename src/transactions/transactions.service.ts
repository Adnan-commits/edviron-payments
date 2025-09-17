// src/transactions/transactions.service.ts
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from '../schemas/transaction.schema';
import { randomUUID } from 'crypto';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async create(orderId: string, amount: number) {
    if (!orderId) throw new BadRequestException('orderId is required');
    try {
      const paymentId = randomUUID();
      const transaction = new this.transactionModel({
        orderId,
        amount,
        status: 'pending',
        paymentId,
      });
      const saved = await transaction.save();
      this.logger.log(
        `Transaction created: ${saved._id} (paymentId=${paymentId}) for order ${orderId}`,
      );
      return saved;
    } catch (err) {
      this.logger.error('Transaction creation failed', err);
      throw new InternalServerErrorException('Failed to create transaction');
    }
  }

  async findAll() {
    try {
      return this.transactionModel.find().sort({ createdAt: -1 }).exec();
    } catch (err) {
      this.logger.error('Failed to fetch transactions', err);
      throw new InternalServerErrorException('Failed to fetch transactions');
    }
  }

  async findAllByOrder(orderId: string) {
    try {
      return this.transactionModel
        .find({ orderId })
        .sort({ createdAt: -1 })
        .exec();
    } catch (err) {
      this.logger.error('Failed to fetch transactions by order', {
        orderId,
        err,
      });
      throw new InternalServerErrorException(
        'Failed to fetch transactions for order',
      );
    }
  }

  async findById(id: string) {
    try {
      return this.transactionModel.findById(id).exec();
    } catch (err) {
      this.logger.error('Error fetching transaction by ID', { id, err });
      throw new InternalServerErrorException('Failed to lookup transaction');
    }
  }

  async findByPaymentId(paymentId: string) {
    try {
      const tx = await this.transactionModel.findOne({ paymentId }).exec();
      if (!tx)
        throw new NotFoundException('Transaction not found for given paymentId');
      return tx;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      this.logger.error('Error finding transaction by paymentId', {
        paymentId,
        err,
      });
      throw new InternalServerErrorException('Failed to lookup transaction');
    }
  }

  async updateStatus(paymentId: string, status: string) {
    try {
      const now = new Date();
      const updated = await this.transactionModel.findOneAndUpdate(
        { paymentId },
        {
          status,
          processedAt: status === 'success' ? now : undefined,
          updatedAt: now,
        },
        { new: true },
      );
      if (!updated)
        throw new NotFoundException('Transaction not found for given paymentId');
      this.logger.log(
        `Transaction ${updated._id} (paymentId=${paymentId}) status updated to ${status}`,
      );
      return updated;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      this.logger.error('Failed to update transaction status', {
        paymentId,
        status,
        err,
      });
      throw new InternalServerErrorException(
        'Failed to update transaction status',
      );
    }
  }

  async cancelTransaction(paymentId: string) {
    return this.updateStatus(paymentId, 'cancelled');
  }
}
