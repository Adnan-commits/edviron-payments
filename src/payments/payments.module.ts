import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Transaction, TransactionSchema } from '../schemas/transaction.schema';

@Module({
  imports: [
    JwtModule.register({}), // uses global config
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
