import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount: number;
}
