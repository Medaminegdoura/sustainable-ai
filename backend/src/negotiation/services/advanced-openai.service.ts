import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AdvancedSimulationRequestDto, AIModel, ToneType, IndustryType } from '../dto/advanced-simulation-request.dto';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  id: string;
  choices: Array<{
    message: {
      content: string;
    };
    finish_reason: string;
  }>;
}

interface RiskAssessment {
  riskLevel: 'low' | 'medium' | 'high';
  potentialRisks: string[];
  mitigationStrategies: string[];
  confidenceScore: number;
}

@Injectable()
export class AdvancedOpenAiService {
  private readonly logger = new Logger(AdvancedOpenAiService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!this.apiKey) {
      this.logger.warn('OPENAI_API_KEY not found in environment variables');
    }
  }

  /**
   * Generate economic-optimized compromise with advanced features
   */
  async generateEconomicCompromise(data: AdvancedSimulationRequestDto): Promise<string> {
    const systemPrompt = this.buildSystemPrompt('economic', data);
    const userPrompt = this.buildAdvancedUserPrompt(data, 'economic');

    return this.callOpenAI(systemPrompt, userPrompt, data, 'economic');
  }

  /**
   * Generate social-optimized compromise with advanced features
   */
  async generateSocialCompromise(data: AdvancedSimulationRequestDto): Promise<string> {
    const systemPrompt = this.buildSystemPrompt('social', data);
    const userPrompt = this.buildAdvancedUserPrompt(data, 'social');

    return this.callOpenAI(systemPrompt, userPrompt, data, 'social');
  }

  /**
   * Generate balanced sustainable compromise with advanced features
   */
  async generateBalancedCompromise(data: AdvancedSimulationRequestDto): Promise<string> {
    const systemPrompt = this.buildSystemPrompt('balanced', data);
    const userPrompt = this.buildAdvancedUserPrompt(data, 'balanced');

    return this.callOpenAI(systemPrompt, userPrompt, data, 'balanced');
  }

  /**
   * Generate risk assessment for a negotiation
   */
  async generateRiskAssessment(data: AdvancedSimulationRequestDto): Promise<RiskAssessment> {
    const systemPrompt = `You are an expert risk analyst specializing in negotiation and business strategy. 
Analyze negotiations for potential risks and provide mitigation strategies.`;

    const userPrompt = this.buildRiskAssessmentPrompt(data);

    try {
      const response = await this.callOpenAI(systemPrompt, userPrompt, data, 'risk');
      return this.parseRiskAssessment(response);
    } catch (error) {
      this.logger.error('Risk assessment generation failed:', error.message);
      return this.getFallbackRiskAssessment();
    }
  }

  /**
   * Build system prompt based on focus and configuration
   */
  private buildSystemPrompt(
    focus: 'economic' | 'social' | 'balanced',
    data: AdvancedSimulationRequestDto,
  ): string {
    const tone = this.getToneInstructions(data.aiConfig?.tone || ToneType.DIPLOMATIC);
    const industryContext = this.getIndustryContext(data.industry);

    const basePrompts = {
      economic: `You are an expert negotiation AI specialized in finding economically optimal solutions. 
Your goal is to maximize financial efficiency, cost reduction, and revenue generation while maintaining fairness.`,
      social: `You are an expert negotiation AI specialized in socially responsible solutions.
Your goal is to maximize social impact, fairness, worker welfare, community benefit, and ethical considerations.`,
      balanced: `You are an expert negotiation AI specialized in sustainable, balanced solutions.
Your goal is to find compromises that harmonize economic viability, social responsibility, and environmental sustainability (ESG principles).`,
    };

    let systemPrompt = basePrompts[focus];
    
    if (industryContext) {
      systemPrompt += `\n\n${industryContext}`;
    }
    
    systemPrompt += `\n\n${tone}`;

    if (data.negotiationRound && data.negotiationRound > 1) {
      systemPrompt += `\n\nThis is negotiation round ${data.negotiationRound}. Consider the feedback from previous rounds and show improvement.`;
    }

    return systemPrompt;
  }

  /**
   * Build advanced user prompt with all new features
   */
  private buildAdvancedUserPrompt(
    data: AdvancedSimulationRequestDto,
    focus: 'economic' | 'social' | 'balanced',
  ): string {
    let prompt = `Analyze this ${data.parties.length}-party negotiation and provide a ${focus}-optimized compromise proposal.\n\n`;

    // Add parties information
    data.parties.forEach((party, index) => {
      const partyLabel = String.fromCharCode(65 + index); // A, B, C, D, E
      prompt += `**Party ${partyLabel}: ${party.name}**\n`;
      prompt += `- Goals: ${party.goals}\n`;
      prompt += `- Constraints: ${party.constraints}\n`;

      if (party.advancedConstraints) {
        if (party.advancedConstraints.dealBreakers && party.advancedConstraints.dealBreakers.length > 0) {
          prompt += `- Deal Breakers: ${party.advancedConstraints.dealBreakers.join(', ')}\n`;
        }
        if (party.advancedConstraints.budgetMax) {
          prompt += `- Budget Limit: $${party.advancedConstraints.budgetMax.toLocaleString()}\n`;
        }
        if (party.advancedConstraints.timelineMonths) {
          prompt += `- Timeline: ${party.advancedConstraints.timelineMonths} months\n`;
        }
        if (party.advancedConstraints.regulatoryRequirements) {
          prompt += `- Regulatory: ${party.advancedConstraints.regulatoryRequirements}\n`;
        }
      }

      if (party.individualEsgPriorities) {
        prompt += `- Individual ESG Priorities: Environmental ${party.individualEsgPriorities.environmental}, Social ${party.individualEsgPriorities.social}, Governance ${party.individualEsgPriorities.governance}\n`;
      }

      prompt += '\n';
    });

    // Add global ESG priorities
    prompt += `**Global ESG Priorities (0-100 scale):**\n`;
    prompt += `- Environmental: ${data.esg.environmental}\n`;
    prompt += `- Social: ${data.esg.social}\n`;
    prompt += `- Governance: ${data.esg.governance}\n\n`;

    // Add custom metrics
    if (data.customMetrics && data.customMetrics.length > 0) {
      prompt += `**Custom Success Metrics:**\n`;
      data.customMetrics.forEach((metric) => {
        prompt += `- ${metric.name} (Priority: ${metric.priority}/100): ${metric.description}\n`;
      });
      prompt += '\n';
    }

    // Add industry context
    if (data.industry && data.industry !== 'general') {
      prompt += `**Industry Context:** ${data.industry}\n\n`;
    }

    // Add previous round feedback
    if (data.previousRoundFeedback) {
      prompt += `**Feedback from Previous Round:**\n${data.previousRoundFeedback}\n\n`;
    }

    // Add specific instructions based on focus
    const focusInstructions = {
      economic: 'economic efficiency, cost optimization, and financial sustainability',
      social: 'social impact, fairness, equity, and stakeholder welfare',
      balanced: 'a harmonious balance between economic, social, and environmental factors according to the ESG priorities',
    };

    prompt += `Provide a comprehensive compromise proposal (5-8 sentences) that prioritizes ${focusInstructions[focus]} `;
    prompt += `while respecting all parties' constraints and deal-breakers. `;
    
    if (data.customMetrics && data.customMetrics.length > 0) {
      prompt += `Address the custom metrics in your proposal. `;
    }

    prompt += `Be specific, actionable, and realistic.`;

    if (data.includeMitigationStrategies) {
      prompt += ` Include risk mitigation strategies.`;
    }

    return prompt;
  }

  /**
   * Build risk assessment prompt
   */
  private buildRiskAssessmentPrompt(data: AdvancedSimulationRequestDto): string {
    let prompt = `Analyze the risks in this negotiation and provide a structured risk assessment.\n\n`;

    data.parties.forEach((party, index) => {
      const partyLabel = String.fromCharCode(65 + index);
      prompt += `**Party ${partyLabel}: ${party.name}**\n`;
      prompt += `- Goals: ${party.goals}\n`;
      prompt += `- Constraints: ${party.constraints}\n\n`;
    });

    prompt += `Provide your assessment in the following JSON format:
{
  "riskLevel": "low|medium|high",
  "potentialRisks": ["risk1", "risk2", "risk3"],
  "mitigationStrategies": ["strategy1", "strategy2", "strategy3"],
  "confidenceScore": 85
}

Identify 3-5 key risks and provide practical mitigation strategies for each.`;

    return prompt;
  }

  /**
   * Get tone-specific instructions
   */
  private getToneInstructions(tone: ToneType): string {
    const toneMap = {
      formal: 'Use formal, professional language suitable for corporate or legal contexts. Avoid colloquialisms.',
      casual: 'Use clear, conversational language that is easy to understand. Be friendly but professional.',
      technical: 'Use precise, technical language with specific terminology. Include metrics and data-driven reasoning.',
      diplomatic: 'Use balanced, neutral language that respects all parties. Be tactful and considerate of sensitivities.',
    };

    return toneMap[tone] || toneMap.diplomatic;
  }

  /**
   * Get industry-specific context
   */
  private getIndustryContext(industry?: IndustryType): string {
    if (!industry || industry === 'general') return '';

    const industryMap = {
      technology: 'Consider factors like intellectual property, innovation timelines, scalability, and tech infrastructure.',
      healthcare: 'Consider regulatory compliance (FDA, HIPAA), patient safety, clinical outcomes, and healthcare accessibility.',
      finance: 'Consider risk management, regulatory compliance (SEC, Basel), liquidity, and fiduciary responsibilities.',
      'real-estate': 'Consider property valuation, zoning regulations, environmental assessments, and community impact.',
      manufacturing: 'Consider supply chain efficiency, production capacity, quality standards, and worker safety.',
      government: 'Consider public policy, transparency, accountability, stakeholder engagement, and long-term sustainability.',
      retail: 'Consider customer experience, supply chain, inventory management, and market competition.',
      energy: 'Consider environmental impact, renewable vs. fossil, grid infrastructure, and energy transition timelines.',
    };

    return industryMap[industry] || '';
  }

  /**
   * Call OpenAI API with configuration
   */
  private async callOpenAI(
    systemPrompt: string,
    userPrompt: string,
    data: AdvancedSimulationRequestDto,
    type: string,
  ): Promise<string> {
    try {
      if (!this.apiKey) {
        this.logger.warn('Using fallback response - no API key configured');
        return this.getFallbackResponse(type);
      }

      const messages: OpenAIMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ];

      // Get AI configuration
      const model = data.aiConfig?.model || AIModel.GPT_4O_MINI;
      const temperature = this.getTemperature(data.aiConfig?.creativity, data.aiConfig?.temperature);
      const maxTokens = data.aiConfig?.maxTokens || 500;

      const response = await axios.post<OpenAIResponse>(
        this.apiUrl,
        {
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          timeout: 60000, // 60 second timeout for complex requests
        },
      );

      const content = response.data.choices[0]?.message?.content;
      
      if (!content) {
        this.logger.error('Empty response from OpenAI');
        return this.getFallbackResponse(type);
      }

      return content.trim();
    } catch (error) {
      this.logger.error(`OpenAI API error for ${type}:`, error.message);
      return this.getFallbackResponse(type);
    }
  }

  /**
   * Convert creativity slider (0-100) or use explicit temperature
   */
  private getTemperature(creativity?: number, temperature?: number): number {
    if (temperature !== undefined) {
      return Math.min(Math.max(temperature, 0), 2); // Clamp between 0-2
    }
    
    if (creativity !== undefined) {
      // Map 0-100 to 0-1.5 (avoiding extremely high temperatures)
      return (creativity / 100) * 1.5;
    }

    return 0.7; // Default
  }

  /**
   * Parse risk assessment from AI response
   */
  private parseRiskAssessment(response: string): RiskAssessment {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          riskLevel: parsed.riskLevel || 'medium',
          potentialRisks: parsed.potentialRisks || [],
          mitigationStrategies: parsed.mitigationStrategies || [],
          confidenceScore: parsed.confidenceScore || 70,
        };
      }
    } catch (error) {
      this.logger.warn('Failed to parse risk assessment JSON');
    }

    return this.getFallbackRiskAssessment();
  }

  /**
   * Fallback responses
   */
  private getFallbackResponse(type: string): string {
    const fallbacks = {
      economic: 'Economic compromise: Implement a phased investment approach with clear ROI milestones, establish cost-sharing mechanisms based on benefit distribution, and create performance-based incentives to maximize financial efficiency while ensuring sustainable operations for all parties involved.',
      social: 'Social compromise: Prioritize stakeholder welfare through equitable benefit distribution, establish transparent governance structures with regular community engagement, invest in workforce development and fair labor practices, and ensure that all parties have meaningful representation in decision-making processes.',
      balanced: 'Balanced sustainable compromise: Adopt an integrated approach that phases economic investments to align with environmental protection timelines, implements social equity measures throughout all operations, and establishes multi-stakeholder governance to ensure accountability and long-term sustainability for all parties.',
      risk: '{"riskLevel":"medium","potentialRisks":["Stakeholder misalignment","Resource constraints","Timeline delays"],"mitigationStrategies":["Regular communication and alignment meetings","Contingency budget allocation","Flexible milestone scheduling"],"confidenceScore":75}',
    };

    return fallbacks[type] || fallbacks.balanced;
  }

  /**
   * Fallback risk assessment
   */
  private getFallbackRiskAssessment(): RiskAssessment {
    return {
      riskLevel: 'medium',
      potentialRisks: [
        'Misalignment of stakeholder priorities',
        'Budget or resource constraints',
        'Timeline execution challenges',
        'Regulatory or compliance issues',
      ],
      mitigationStrategies: [
        'Establish regular alignment meetings and clear communication channels',
        'Create contingency budgets and resource buffer pools',
        'Implement flexible milestone scheduling with early warning systems',
        'Conduct thorough regulatory review and engage compliance experts',
      ],
      confidenceScore: 75,
    };
  }
}
