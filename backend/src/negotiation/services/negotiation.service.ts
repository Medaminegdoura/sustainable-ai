import { Injectable, Logger } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { SimulationRequestDto } from '../dto/simulation-request.dto';
import { SimulationResponseDto } from '../dto/simulation-response.dto';

@Injectable()
export class NegotiationService {
  private readonly logger = new Logger(NegotiationService.name);

  constructor(private readonly openAiService: OpenAiService) {}

  /**
   * Main simulation method that generates all three compromises
   */
  async simulate(data: SimulationRequestDto): Promise<SimulationResponseDto> {
    this.logger.log(
      `Starting negotiation simulation for ${data.partyA.name} vs ${data.partyB.name}`,
    );

    try {
      // Generate all three compromises in parallel for speed
      const [economicCompromise, socialCompromise, balancedCompromise] =
        await Promise.all([
          this.openAiService.generateEconomicCompromise(data),
          this.openAiService.generateSocialCompromise(data),
          this.openAiService.generateBalancedCompromise(data),
        ]);

      // Calculate scores based on ESG priorities
      const scores = this.calculateScores(data);

      return {
        economic_compromise: economicCompromise,
        social_compromise: socialCompromise,
        balanced_compromise: balancedCompromise,
        scores,
      };
    } catch (error) {
      this.logger.error('Error during simulation:', error);
      throw error;
    }
  }

  /**
   * Calculate scores based on ESG priorities
   * Simple deterministic calculation for prototype
   */
  private calculateScores(data: SimulationRequestDto): {
    economic: number;
    social: number;
    environmental: number;
  } {
    // Normalize ESG values (0-100) to scores
    const total = data.esg.environmental + data.esg.social + data.esg.governance;
    
    // If no priorities set, use balanced scores
    if (total === 0) {
      return {
        economic: 70,
        social: 70,
        environmental: 70,
      };
    }

    // Calculate weighted scores
    // Economic score inversely correlates with ESG priorities (higher ESG = lower pure economic focus)
    const economicScore = Math.max(50, 100 - (total / 3));
    
    // Social score directly correlates with social and governance priorities
    const socialScore = Math.min(95, ((data.esg.social + data.esg.governance) / 2) * 0.9 + 20);
    
    // Environmental score directly correlates with environmental priority
    const environmentalScore = Math.min(95, data.esg.environmental * 0.9 + 10);

    return {
      economic: Math.round(economicScore),
      social: Math.round(socialScore),
      environmental: Math.round(environmentalScore),
    };
  }
}
