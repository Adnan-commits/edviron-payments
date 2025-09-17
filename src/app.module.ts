import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module'; // 👈 add this
import { TransactionsModule } from './transactions/transactions.module';
import { WebhookModule } from './webhook/webhook.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    AuthModule,
    OrdersModule,
    TransactionsModule,
    WebhookModule,
    PaymentsModule, // 👈 also add here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
