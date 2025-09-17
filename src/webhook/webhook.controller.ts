// src/webhook/webhook.controller.ts
import { Controller, Post, Get, Body, Query, BadRequestException, Res, InternalServerErrorException } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookDto } from './dto/webhook.dto';
import type { Response } from 'express';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('payment')
async handlePostPayment(@Body() dto: WebhookDto, @Res() res: Response) {
  const updated = await this.webhookService.updateTransaction(dto.paymentId, dto.status);
  if (!updated) throw new BadRequestException('paymentId not found');

  return res.redirect(
    `${process.env.FRONTEND_URL}/payment-status?transactionId=${updated._id}`
  );
}


  // ✅ New GET handler for Edviron callbacks
  @Get('payment')
  async handleGetPayment(
    @Query('EdvironCollectRequestId') collectRequestId: string,
    @Query('status') status: string,
    @Res() res: Response,
  ) {
    if (!collectRequestId || !status) {
      throw new BadRequestException('Missing EdvironCollectRequestId or status');
    }

    if (!['success', 'failed', 'pending'].includes(status.toLowerCase())) {
      throw new BadRequestException('Invalid status value');
    }

    const updated = await this.webhookService.updateTransaction(collectRequestId, status);
    if (!updated) {
      throw new BadRequestException('paymentId not found');
    }

    if (!process.env.FRONTEND_URL) {
      throw new InternalServerErrorException('Frontend URL not configured');
    }

    try {
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment-status?transactionId=${updated._id}`
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to redirect');
    }
  }
}
