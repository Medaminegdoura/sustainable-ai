import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NegotiationModule } from './negotiation/negotiation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NegotiationModule,
  ],
})
export class AppModule {}
