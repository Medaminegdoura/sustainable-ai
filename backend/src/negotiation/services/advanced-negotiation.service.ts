import { Injectable, Logger } from '@nestjs/common';
import { AdvancedOpenAiService } from './advanced-openai.service';
import { AdvancedSimulationRequestDto } from '../dto/advanced-simulation-request.dto';

interface Scores {
  economic: number;
  social: number;
  environmental: number;
}

interface CustomMetricScore {
  name: string;
  score: number;
  explanation: string;
}

interface RiskAssessment {
  riskLevel: 'low' | 'medium' | 'high';
  potentialRisks: string[];
  mitigationStrategies: string[];
  confidenceScore: number;
}

interface AdvancedSimulationResponse {
  economic_compromise: string;
  social_compromise: string;
  balanced_compromise: string;
  scores: Scores;
  riskAssessment?: RiskAssessment;
  customMetricScores?: CustomMetricScore[];
  implementationPhases?: string[];
  alternativeOptions?: string[];
  negotiationRoundNumber?: number;
  improvementSuggestions?: string[];
}

@Injectable()
export class AdvancedNegotiationService {
  private readonly logger = new Logger(AdvancedNegotiationService.name);

  constructor(private advancedOpenAiService: AdvancedOpenAiService) {}

  async runAdvancedSimulation(
    data: AdvancedSimulationRequestDto,
  ): Promise<AdvancedSimulationResponse> {
    this.logger.log('Starting advanced simulation with enhanced features...');

    try {
      // Generate all three compromise types in parallel
      const [economicCompromise, socialCompromise, balancedCompromise] = await Promise.all([
        this.advancedOpenAiService.generateEconomicCompromise(data),
        this.advancedOpenAiService.generateSocialCompromise(data),
        this.advancedOpenAiService.generateBalancedCompromise(data),
      ]);

      // Calculate sustainability scores
      const scores = this.calculateEnhancedScores(data, {
        economicCompromise,
        socialCompromise,
        balancedCompromise,
      });

      const response: AdvancedSimulationResponse = {
        economic_compromise: economicCompromise,
        social_compromise: socialCompromise,
        balanced_compromise: balancedCompromise,
        scores,
      };

      // Add risk assessment if requested
      if (data.includeRiskAnalysis || data.includeMitigationStrategies) {
        response.riskAssessment = await this.advancedOpenAiService.generateRiskAssessment(data);
      }

      // Calculate custom metric scores if provided
      if (data.customMetrics && data.customMetrics.length > 0) {
        response.customMetricScores = this.calculateCustomMetricScores(data);
      }

      // Add implementation phases
      response.implementationPhases = this.generateImplementationPhases(data);

      // Add negotiation round info
      if (data.negotiationRound) {
        response.negotiationRoundNumber = data.negotiationRound;
        if (data.negotiationRound > 1 && data.previousRoundFeedback) {
          response.improvementSuggestions = this.generateImprovementSuggestions(data);
        }
      }

      // Add alternative options for flexibility
      response.alternativeOptions = this.generateAlternativeOptions(data, response);

      this.logger.log('Advanced simulation completed successfully');
      return response;
    } catch (error) {
      this.logger.error('Advanced simulation failed:', error.message);
      throw error;
    }
  }

  /**
   * Calculate enhanced sustainability scores with custom metrics consideration
   */
  private calculateEnhancedScores(
    data: AdvancedSimulationRequestDto,
    compromises: any,
  ): Scores {
    const baseScores = {
      economic: data.esg.governance * 0.6 + data.esg.environmental * 0.2 + data.esg.social * 0.2,
      social: data.esg.social * 0.7 + data.esg.governance * 0.2 + data.esg.environmental * 0.1,
      environmental: data.esg.environmental * 0.7 + data.esg.social * 0.2 + data.esg.governance * 0.1,
    };

    // Adjust scores based on number of parties (more complex = slightly lower scores)
    const complexityFactor = 1 - (data.parties.length - 2) * 0.05;

    // Adjust based on constraints
    const constraintFactor = this.calculateConstraintComplexity(data);

    // Apply adjustments
    const scores: Scores = {
      economic: Math.min(100, Math.max(0, baseScores.economic * complexityFactor * constraintFactor + this.getRandomAdjustment())),
      social: Math.min(100, Math.max(0, baseScores.social * complexityFactor * constraintFactor + this.getRandomAdjustment())),
      environmental: Math.min(100, Math.max(0, baseScores.environmental * complexityFactor * constraintFactor + this.getRandomAdjustment())),
    };

    return {
      economic: Math.round(scores.economic),
      social: Math.round(scores.social),
      environmental: Math.round(scores.environmental),
    };
  }

  /**
   * Calculate constraint complexity factor
   */
  private calculateConstraintComplexity(data: AdvancedSimulationRequestDto): number {
    let complexity = 1.0;

    data.parties.forEach(party => {
      if (party.advancedConstraints) {
        if (party.advancedConstraints.dealBreakers && party.advancedConstraints.dealBreakers.length > 0) {
          complexity *= 0.95; // Deal breakers make it slightly harder
        }
        if (party.advancedConstraints.budgetMax) {
          complexity *= 0.97; // Budget constraints add difficulty
        }
        if (party.advancedConstraints.timelineMonths && party.advancedConstraints.timelineMonths < 12) {
          complexity *= 0.96; // Tight timelines add pressure
        }
      }
    });

    return Math.max(0.8, complexity); // Don't reduce too much
  }

  /**
   * Calculate custom metric scores
   */
  private calculateCustomMetricScores(data: AdvancedSimulationRequestDto): CustomMetricScore[] {
    if (!data.customMetrics) return [];

    return data.customMetrics.map(metric => {
      // Generate score based on priority and ESG alignment
      const baseScore = 50 + (metric.priority / 2);
      const esgInfluence = (data.esg.environmental + data.esg.social + data.esg.governance) / 6;
      const finalScore = Math.min(100, Math.round(baseScore + esgInfluence + this.getRandomAdjustment(10)));

      return {
        name: metric.name,
        score: finalScore,
        explanation: this.generateMetricExplanation(metric, finalScore, data),
      };
    });
  }

  /**
   * Generate explanation for custom metric score
   */
  private generateMetricExplanation(metric: any, score: number, data: AdvancedSimulationRequestDto): string {
    const performance = score >= 80 ? 'Strong' : score >= 60 ? 'Moderate' : 'Needs improvement';
    return `${performance} alignment with ${metric.name} goals across all ${data.parties.length} parties. Priority weight of ${metric.priority}/100 considered.`;
  }

  /**
   * Generate implementation phases
   */
  private generateImplementationPhases(data: AdvancedSimulationRequestDto): string[] {
    const phases: string[] = [];

    phases.push('Phase 1: Stakeholder alignment and agreement finalization (Weeks 1-2)');
    phases.push('Phase 2: Resource allocation and infrastructure setup (Weeks 3-6)');
    
    if (data.esg.environmental > 60) {
      phases.push('Phase 3: Environmental impact assessment and sustainability measures (Weeks 7-10)');
    }
    
    if (data.esg.social > 60) {
      phases.push(`Phase ${phases.length + 1}: Social programs and community engagement initiatives (Weeks ${phases.length * 4 + 3}-${phases.length * 4 + 6})`);
    }

    phases.push(`Phase ${phases.length + 1}: Pilot program launch and initial monitoring (Month ${Math.ceil(phases.length * 1.5)})`);
    phases.push(`Phase ${phases.length + 1}: Full-scale implementation and ongoing evaluation (Month ${Math.ceil(phases.length * 1.5) + 2} onwards)`);

    return phases.slice(0, 5); // Max 5 phases
  }

  /**
   * Generate alternative options
   */
  private generateAlternativeOptions(data: AdvancedSimulationRequestDto, response: AdvancedSimulationResponse): string[] {
    const alternatives: string[] = [];

    if (data.parties.length > 2) {
      alternatives.push('Consider bilateral sub-agreements between specific parties before full multi-party agreement');
    }

    if (data.customMetrics && data.customMetrics.length > 0) {
      alternatives.push('Adjust custom metric priorities to explore different optimization paths');
    }

    if (data.esg.environmental > 70) {
      alternatives.push('Explore carbon offset programs or renewable energy partnerships');
    }

    if (data.esg.social > 70) {
      alternatives.push('Implement pilot social programs with selected communities before full rollout');
    }

    if (response.riskAssessment && response.riskAssessment.riskLevel === 'high') {
      alternatives.push('Break negotiation into smaller, lower-risk phases with go/no-go decision points');
    }

    return alternatives.slice(0, 3); // Max 3 alternatives
  }

  /**
   * Generate improvement suggestions for iterative rounds
   */
  private generateImprovementSuggestions(data: AdvancedSimulationRequestDto): string[] {
    const suggestions: string[] = [];

    suggestions.push('Consider feedback from previous round and adjust party priorities accordingly');
    
    if (data.customMetrics && data.customMetrics.length > 0) {
      suggestions.push('Fine-tune custom metric weights based on stakeholder input');
    }

    suggestions.push('Explore additional compromise options that address unresolved concerns');
    suggestions.push('Strengthen risk mitigation strategies for identified high-priority risks');

    return suggestions;
  }

  /**
   * Get random adjustment for score variation
   */
  private getRandomAdjustment(range: number = 15): number {
    return (Math.random() - 0.5) * range;
  }
}
