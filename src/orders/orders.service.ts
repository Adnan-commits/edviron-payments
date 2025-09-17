import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(userId: string, amount: number): Promise<Order> {
    try {
      const order = new this.orderModel({
        userId,
        amount,
        status: 'pending',
      });
      const saved = await order.save();
      this.logger.log(`Order created: ${saved._id} for user ${userId}`);
      return saved;
    } catch (err) {
      this.logger.error('Order creation failed', err);
      throw new InternalServerErrorException('Failed to create order');
    }
  }

  async findAllByUser(userId: string): Promise<Order[]> {
    try {
      return this.orderModel.find({ userId }).sort({ createdAt: -1 }).exec();
    } catch (err) {
      this.logger.error('Failed to fetch orders for user', { userId, err });
      throw new InternalServerErrorException('Failed to fetch orders');
    }
  }

  async findById(orderId: string): Promise<Order> {
    try {
      const order = await this.orderModel.findById(orderId).exec();
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      return order;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      this.logger.error('Error fetching order by id', { orderId, err });
      throw new InternalServerErrorException('Failed to fetch order');
    }
  }

  // Optional helper to update status from other modules
  async updateStatus(orderId: string, status: string): Promise<Order> {
    try {
      const updated = await this.orderModel.findByIdAndUpdate(
        orderId,
        { status, updatedAt: new Date() },
        { new: true },
      );
      if (!updated) throw new NotFoundException('Order not found');
      this.logger.log(`Order ${orderId} status updated to ${status}`);
      return updated;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      this.logger.error('Failed to update order status', { orderId, status, err });
      throw new InternalServerErrorException('Failed to update order status');
    }
  }
}
