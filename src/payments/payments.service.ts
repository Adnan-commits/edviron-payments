// src/payments/payments.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';

import { Transaction, TransactionDocument } from '../schemas/transaction.schema';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  private extractCollectInfo(respData: any): { id?: string; url?: string } {
    if (!respData) return {};

    // Try multiple common variants / nesting
    const id =
      respData.collect_request_id ||
      respData.collectRequestId ||
      respData.id ||
      respData.data?.collect_request_id ||
      respData.data?.collectRequestId;

    const url =
      respData.collect_request_url ||
      respData.collectRequestUrl ||
      respData.collect_requestUrl ||
      respData.data?.collect_request_url ||
      respData.data?.collectRequestUrl ||
      respData.data?.collect_requestUrl;

    return { id, url };
  }

  async createPayment(orderId: string, amount: number) {
    try {
      // Build sign payload - use BACKEND_URL env so callback hits the running backend
      const signPayload = {
        school_id: process.env.SCHOOL_ID,
        amount: String(amount),
        callback_url: `${process.env.BACKEND_URL}/webhook/payment`,
        order_id: orderId,
      };

      // Sign using PG secret
      const sign = this.jwtService.sign(signPayload, {
        secret: process.env.PG_SECRET,
        expiresIn: '5m',
      });

      const payload = { ...signPayload, sign };

      // Ensure env var name matches your .env
      const baseUrl = process.env.PG_BASE_URL;
      const apiKey = process.env.PG_API_KEY;
      if (!baseUrl || !apiKey) {
        throw new Error('PG_BASE_URL or PG_API_KEY not set in env');
      }

      const response = await axios.post(
        `${baseUrl}/create-collect-request`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        },
      );

      // Debug: log raw response body so we can see exactly what the gateway returns
      console.log(
        'Edviron create-collect-request response:',
        JSON.stringify(response.data),
      );

      const { id: collect_request_id, url: collect_request_url } =
        this.extractCollectInfo(response.data);

      // If API didn't return id/url, show informative error
      if (!collect_request_id && !collect_request_url) {
        console.error('Unexpected Edviron response shape:', response.data);
        throw new Error(
          'Payment gateway response missing collect_request_id / collect_request_url',
        );
      }

      // Save transaction to DB
      const transaction = new this.transactionModel({
        orderId,
        amount,
        paymentId: collect_request_id || undefined,
        status: 'initiated',
      });
      await transaction.save();

      // Build a convenient frontend status URL fallback
      const frontendBase = process.env.FRONTEND_URL || 'http://localhost:3001';
      const paymentStatusUrl = `${frontendBase}/payment-status?transactionId=${transaction._id}`;

      return {
        message: 'Payment created successfully',
        paymentId: collect_request_id,
        paymentUrl: collect_request_url,
        transactionId: transaction._id,
        paymentStatusUrl,
      };
    } catch (err: any) {
      console.error(
        'Payment API Error:',
        err.response?.data ?? err.message ?? err,
      );

      // If axios returned error data, prefer that, otherwise generic
      const message = err.response?.data ?? err.message ?? 'Payment creation failed';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }
}
