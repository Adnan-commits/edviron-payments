import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../schemas/user.schema';
import { JwtStrategy } from './jwt.strategy'; // 👈 add this

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ensures .env is loaded
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn:
            configService.get<string>('JWT_EXPIRES_IN') || '3600s',
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy], // 👈 add JwtStrategy here
  controllers: [AuthController],
  exports: [AuthService], // 👈 optional, makes AuthService usable elsewhere
})
export class AuthModule {}
