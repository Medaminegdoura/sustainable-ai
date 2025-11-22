import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { NegotiationService } from './services/negotiation.service';
import { SimulationRequestDto } from './dto/simulation-request.dto';
import { SimulationResponseDto } from './dto/simulation-response.dto';

@Controller('simulate')
export class NegotiationController {
  private readonly logger = new Logger(NegotiationController.name);

  constructor(private readonly negotiationService: NegotiationService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async simulate(@Body() data: SimulationRequestDto): Promise<SimulationResponseDto> {
    this.logger.log('Received simulation request');
    return await this.negotiationService.simulate(data);
  }
}
