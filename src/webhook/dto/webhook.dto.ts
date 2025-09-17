import { IsMongoId, IsString } from 'class-validator';

export class WebhookDto {
  @IsMongoId()   // 👈 accepts MongoDB ObjectId
  paymentId: string;

  @IsString()
  status: string;
}
