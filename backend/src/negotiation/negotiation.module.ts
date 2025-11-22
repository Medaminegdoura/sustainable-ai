import { Module } from '@nestjs/common';
import { NegotiationController } from './negotiation.controller';
import { NegotiationService } from './services/negotiation.service';
import { OpenAiService } from './services/openai.service';

@Module({
  controllers: [NegotiationController],
  providers: [NegotiationService, OpenAiService],
})
export class NegotiationModule {}
