import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';


@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateOrderDto, @Req() req: any) {
    const user = req.user as { sub: string; username: string };
    return this.ordersService.create(user.sub, dto.amount);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: any) {
    const user = req.user as { sub: string; username: string };
    return this.ordersService.findAllByUser(user.sub);
  }
}
