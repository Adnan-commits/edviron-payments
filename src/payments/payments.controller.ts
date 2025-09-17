import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createPayment(
    @Body() body: { orderId: string; amount: number },
  ) {
    return this.paymentsService.createPayment(body.orderId, body.amount);
  }
}
