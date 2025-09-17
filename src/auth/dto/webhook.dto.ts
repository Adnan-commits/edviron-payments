import { IsUUID, IsIn } from 'class-validator';

export class WebhookDto {
  @IsUUID()
  paymentId: string;

  @IsIn(['success', 'failed', 'pending'])
  status: 'success' | 'failed' | 'pending';
}
