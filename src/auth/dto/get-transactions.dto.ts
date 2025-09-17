import { IsString, IsNotEmpty } from 'class-validator';

export class GetTransactionsDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;
}
