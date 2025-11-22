import { Module } from '@nestjs/common';
import { NegotiationController } from './negotiation.controller';
import { NegotiationService } from './services/negotiation.service';
import { OpenAiService } from './services/openai.service';
import { AdvancedNegotiationService } from './services/advanced-negotiation.service';
import { AdvancedOpenAiService } from './services/advanced-openai.service';
import { EmpathyMappingService } from './services/empathy-mapping.service';
import { CarbonFootprintService } from './services/carbon-footprint.service';

@Module({
  controllers: [NegotiationController],
  providers: [
    NegotiationService, 
    OpenAiService, 
    AdvancedNegotiationService, 
    AdvancedOpenAiService,
    EmpathyMappingService,
    CarbonFootprintService,
  ],
})
export class NegotiationModule {}
