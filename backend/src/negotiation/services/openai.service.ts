import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SimulationRequestDto } from '../dto/simulation-request.dto';

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

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly model = 'gpt-4o-mini'; // Using cost-effective model

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!this.apiKey) {
      this.logger.warn('OPENAI_API_KEY not found in environment variables');
    }
  }

  /**
   * Generate economic-optimized compromise
   */
  async generateEconomicCompromise(data: SimulationRequestDto): Promise<string> {
    const systemPrompt = `You are an expert negotiation AI specialized in finding economically optimal solutions. 
Your goal is to maximize financial efficiency, cost reduction, and revenue generation while maintaining fairness.`;

    const userPrompt = this.buildUserPrompt(data, 'economic');

    return this.callOpenAI(systemPrompt, userPrompt, 'economic');
  }

  /**
   * Generate social-optimized compromise
   */
  async generateSocialCompromise(data: SimulationRequestDto): Promise<string> {
    const systemPrompt = `You are an expert negotiation AI specialized in socially responsible solutions.
Your goal is to maximize social impact, fairness, worker welfare, community benefit, and ethical considerations.`;

    const userPrompt = this.buildUserPrompt(data, 'social');

    return this.callOpenAI(systemPrompt, userPrompt, 'social');
  }

  /**
   * Generate balanced sustainable compromise
   */
  async generateBalancedCompromise(data: SimulationRequestDto): Promise<string> {
    const systemPrompt = `You are an expert negotiation AI specialized in sustainable, balanced solutions.
Your goal is to find compromises that harmonize economic viability, social responsibility, and environmental sustainability (ESG principles).`;

    const userPrompt = this.buildBalancedPrompt(data);

    return this.callOpenAI(systemPrompt, userPrompt, 'balanced');
  }

  /**
   * Build user prompt for economic or social optimization
   */
  private buildUserPrompt(data: SimulationRequestDto, focus: 'economic' | 'social'): string {
    const focusDescription = focus === 'economic' 
      ? 'economic efficiency and financial optimization'
      : 'social impact, fairness, and ethical considerations';

    return `Analyze this negotiation between two parties and provide a ${focus}-optimized compromise proposal.

**Party A: ${data.partyA.name}**
- Goals: ${data.partyA.goals}
- Constraints: ${data.partyA.constraints}

**Party B: ${data.partyB.name}**
- Goals: ${data.partyB.goals}
- Constraints: ${data.partyB.constraints}

**ESG Priorities (0-100 scale):**
- Environmental: ${data.esg.environmental}
- Social: ${data.esg.social}
- Governance: ${data.esg.governance}

Provide a concise compromise proposal (3-5 sentences) that prioritizes ${focusDescription} while respecting both parties' constraints. Be specific and actionable.`;
  }

  /**
   * Build user prompt for balanced compromise
   */
  private buildBalancedPrompt(data: SimulationRequestDto): string {
    return `Analyze this negotiation between two parties and provide a balanced, sustainable compromise proposal.

**Party A: ${data.partyA.name}**
- Goals: ${data.partyA.goals}
- Constraints: ${data.partyA.constraints}

**Party B: ${data.partyB.name}**
- Goals: ${data.partyB.goals}
- Constraints: ${data.partyB.constraints}

**ESG Priorities (0-100 scale):**
- Environmental: ${data.esg.environmental}
- Social: ${data.esg.social}
- Governance: ${data.esg.governance}

Provide a concise compromise proposal (3-5 sentences) that balances economic, social, and environmental factors according to the ESG priorities. The proposal should be sustainable and fair to both parties. Be specific and actionable.`;
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(
    systemPrompt: string,
    userPrompt: string,
    type: 'economic' | 'social' | 'balanced',
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

      const response = await axios.post<OpenAIResponse>(
        this.apiUrl,
        {
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 300,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          timeout: 30000, // 30 second timeout
        },
      );

      const content = response.data.choices[0]?.message?.content;
      
      if (!content) {
        this.logger.error('Empty response from OpenAI');
        return this.getFallbackResponse(type);
      }

      return content.trim();
    } catch (error) {
      this.logger.error(`OpenAI API error for ${type} compromise:`, error.message);
      return this.getFallbackResponse(type);
    }
  }

  /**
   * Fallback responses when API fails
   */
  private getFallbackResponse(type: 'economic' | 'social' | 'balanced'): string {
    const fallbacks = {
      economic: 'Economic compromise: Allocate resources based on ROI projections, implement cost-sharing mechanisms, and establish performance-based incentives to maximize financial efficiency for both parties.',
      social: 'Social compromise: Prioritize fair labor practices, ensure equitable benefit distribution, invest in community development programs, and establish transparent governance structures that benefit all stakeholders.',
      balanced: 'Balanced sustainable compromise: Implement a phased approach that balances immediate economic needs with long-term sustainability goals, ensuring environmental protection, social equity, and good governance practices throughout the agreement.',
    };

    return fallbacks[type];
  }
}
