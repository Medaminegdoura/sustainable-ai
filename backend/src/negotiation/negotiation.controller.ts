import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { NegotiationService } from './services/negotiation.service';
import { AdvancedNegotiationService } from './services/advanced-negotiation.service';
import { SimulationRequestDto } from './dto/simulation-request.dto';
import { AdvancedSimulationRequestDto } from './dto/advanced-simulation-request.dto';
import { SimulationResponseDto } from './dto/simulation-response.dto';

@Controller('simulate')
export class NegotiationController {
  private readonly logger = new Logger(NegotiationController.name);

  constructor(
    private readonly negotiationService: NegotiationService,
    private readonly advancedNegotiationService: AdvancedNegotiationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async simulate(@Body() data: SimulationRequestDto): Promise<SimulationResponseDto> {
    this.logger.log('Received simulation request');
    return await this.negotiationService.simulate(data);
  }

  @Post('advanced')
  @HttpCode(HttpStatus.OK)
  async simulateAdvanced(@Body() data: AdvancedSimulationRequestDto): Promise<any> {
    this.logger.log('Received advanced simulation request');
    return await this.advancedNegotiationService.runAdvancedSimulation(data);
  }
}
