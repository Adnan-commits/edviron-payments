// src/transactions/transactions.controller.ts
import { Controller, Post, Get, Body, UseGuards, Param, NotFoundException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(dto.orderId, dto.amount);
  }

  @UseGuards(JwtAuthGuard)
  @Post('by-order')
  async findAllByOrder(@Body() dto: GetTransactionsDto) {
    return this.transactionsService.findAllByOrder(dto.orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.transactionsService.findAll();
  }

  // ✅ New endpoint for frontend `/payment-status`
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const transaction = await this.transactionsService.findById(id);
    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }
}
