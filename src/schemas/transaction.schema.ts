import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, default: 'initiated' })
  status: string;

  @Prop({ required: true })
  paymentId: string;  // 👈 add this

  // inside src/schemas/transaction.schema.ts (field addition)
  @Prop()
  processedAt?: Date;

}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
