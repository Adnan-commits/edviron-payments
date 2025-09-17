import { IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount: number;
}
