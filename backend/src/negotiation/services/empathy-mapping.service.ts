import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AdvancedSimulationRequestDto, EmotionalState, PowerDynamic, NegotiationStyle, CulturalContext } from '../dto/advanced-simulation-request.dto';

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

interface EmpathyInsight {
  partyName: string;
  emotionalNeeds: string[];
  communicationRecommendations: string[];
  conflictRisks: string[];
  bridgingStrategies: string[];
}

interface SentimentAnalysis {
  overallSentiment: 'positive' | 'neutral' | 'negative';
  emotionalTone: string;
  empathyScore: number;
  inclusivityScore: number;
  recommendations: string[];
}

interface PowerBalanceReport {
  currentDynamics: string;
  imbalances: string[];
  balancingStrategies: string[];
  equityScore: number;
}

interface CulturalBridge {
  culturalTensions: string[];
  communicationAdjustments: string[];
  protocolRecommendations: string[];
  successFactors: string[];
}

@Injectable()
export class EmpathyMappingService {
  private readonly logger = new Logger(EmpathyMappingService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
  }

  /**
   * INNOVATIVE: Generate empathy insights for each party
   * This analyzes emotional intelligence, psychological factors, and interpersonal dynamics
   */
  async generateEmpathyInsights(data: AdvancedSimulationRequestDto): Promise<EmpathyInsight[]> {
    this.logger.log('Generating empathy insights for all parties...');

    const insights: EmpathyInsight[] = [];

    for (const party of data.parties) {
      if (!party.empathyProfile) {
        // Skip parties without empathy profiles
        insights.push({
          partyName: party.name,
          emotionalNeeds: ['Not specified'],
          communicationRecommendations: ['Use standard professional communication'],
          conflictRisks: ['Unknown - no empathy profile provided'],
          bridgingStrategies: ['Establish rapport through open dialogue'],
        });
        continue;
      }

      const systemPrompt = `You are an expert negotiation psychologist and emotional intelligence consultant. 
Your specialty is understanding human motivations, emotional dynamics, and interpersonal psychology in high-stakes negotiations.
Analyze the emotional and psychological profile provided and give actionable insights.`;

      const userPrompt = this.buildEmpathyPrompt(party, data);

      try {
        const response = await this.callOpenAI(systemPrompt, userPrompt, 'gpt-4o-mini', 0.8, 400);
        const parsed = this.parseEmpathyInsight(response, party.name);
        insights.push(parsed);
      } catch (error) {
        this.logger.error(`Failed to generate empathy insight for ${party.name}:`, error.message);
        insights.push(this.getFallbackEmpathyInsight(party.name));
      }
    }

    return insights;
  }

  /**
   * INNOVATIVE: Analyze sentiment and emotional tone of proposals
   */
  async analyzeSentiment(
    proposal: string,
    data: AdvancedSimulationRequestDto,
  ): Promise<SentimentAnalysis> {
    const systemPrompt = `You are an expert in emotional intelligence and communication analysis.
Analyze the sentiment, emotional tone, empathy level, and inclusivity of negotiation proposals.
Your goal is to ensure proposals are emotionally intelligent and considerate of all parties' feelings.`;

    const userPrompt = this.buildSentimentPrompt(proposal, data);

    try {
      const response = await this.callOpenAI(systemPrompt, userPrompt, 'gpt-4o-mini', 0.6, 300);
      return this.parseSentimentAnalysis(response);
    } catch (error) {
      this.logger.error('Sentiment analysis failed:', error.message);
      return this.getFallbackSentiment();
    }
  }

  /**
   * INNOVATIVE: Analyze and balance power dynamics
   */
  async analyzePowerBalance(data: AdvancedSimulationRequestDto): Promise<PowerBalanceReport> {
    const systemPrompt = `You are an expert in organizational psychology and power dynamics in negotiations.
Analyze power imbalances, dependencies, and suggest strategies to create more equitable negotiations.
Focus on empowering disadvantaged parties while maintaining productive dialogue.`;

    const userPrompt = this.buildPowerBalancePrompt(data);

    try {
      const response = await this.callOpenAI(systemPrompt, userPrompt, 'gpt-4o-mini', 0.7, 400);
      return this.parsePowerBalanceReport(response);
    } catch (error) {
      this.logger.error('Power balance analysis failed:', error.message);
      return this.getFallbackPowerBalance();
    }
  }

  /**
   * INNOVATIVE: Bridge cultural communication differences
   */
  async generateCulturalBridge(data: AdvancedSimulationRequestDto): Promise<CulturalBridge> {
    const systemPrompt = `You are an expert in cross-cultural communication and international negotiations.
Identify cultural tensions, communication style differences, and provide specific recommendations 
for bridging cultural gaps to ensure mutual understanding and respect.`;

    const userPrompt = this.buildCulturalBridgePrompt(data);

    try {
      const response = await this.callOpenAI(systemPrompt, userPrompt, 'gpt-4o-mini', 0.7, 400);
      return this.parseCulturalBridge(response);
    } catch (error) {
      this.logger.error('Cultural bridge generation failed:', error.message);
      return this.getFallbackCulturalBridge();
    }
  }

  /**
   * Build empathy-focused prompt
   */
  private buildEmpathyPrompt(party: any, data: AdvancedSimulationRequestDto): string {
    const profile = party.empathyProfile;
    
    let prompt = `Analyze the emotional and psychological profile of this negotiating party:\n\n`;
    prompt += `**Party: ${party.name}**\n`;
    prompt += `Goals: ${party.goals}\n\n`;

    if (profile.emotionalState) {
      prompt += `Emotional State: ${profile.emotionalState}\n`;
    }
    if (profile.powerDynamic) {
      prompt += `Power Dynamic: ${profile.powerDynamic}\n`;
    }
    if (profile.negotiationStyle) {
      prompt += `Negotiation Style: ${profile.negotiationStyle}\n`;
    }
    if (profile.culturalContext) {
      prompt += `Cultural Context: ${profile.culturalContext}\n`;
    }
    if (profile.trustLevel !== undefined) {
      prompt += `Trust Level: ${profile.trustLevel}/100\n`;
    }
    if (profile.stressLevel !== undefined) {
      prompt += `Stress Level: ${profile.stressLevel}/100\n`;
    }
    if (profile.emotionalTriggers && profile.emotionalTriggers.length > 0) {
      prompt += `Emotional Triggers: ${profile.emotionalTriggers.join(', ')}\n`;
    }
    if (profile.coreValues && profile.coreValues.length > 0) {
      prompt += `Core Values: ${profile.coreValues.join(', ')}\n`;
    }
    if (profile.pastExperiences) {
      prompt += `Past Experiences: ${profile.pastExperiences}\n`;
    }

    prompt += `\nProvide your analysis in JSON format:
{
  "emotionalNeeds": ["need1", "need2", "need3"],
  "communicationRecommendations": ["recommendation1", "recommendation2"],
  "conflictRisks": ["risk1", "risk2"],
  "bridgingStrategies": ["strategy1", "strategy2", "strategy3"]
}

Be specific and actionable. Consider their emotional state, power position, and cultural context.`;

    return prompt;
  }

  /**
   * Build sentiment analysis prompt
   */
  private buildSentimentPrompt(proposal: string, data: AdvancedSimulationRequestDto): string {
    let prompt = `Analyze the emotional intelligence and sentiment of this negotiation proposal:\n\n`;
    prompt += `"${proposal}"\n\n`;
    prompt += `Consider the negotiating parties:\n`;
    
    data.parties.forEach((party, i) => {
      prompt += `- ${party.name}`;
      if (party.empathyProfile?.emotionalState) {
        prompt += ` (${party.empathyProfile.emotionalState})`;
      }
      prompt += '\n';
    });

    prompt += `\nProvide analysis in JSON format:
{
  "overallSentiment": "positive|neutral|negative",
  "emotionalTone": "brief description of tone",
  "empathyScore": 85,
  "inclusivityScore": 78,
  "recommendations": ["recommendation1", "recommendation2"]
}

Rate empathy (how well it considers feelings) and inclusivity (how well it addresses all parties) on 0-100 scale.`;

    return prompt;
  }

  /**
   * Build power balance analysis prompt
   */
  private buildPowerBalancePrompt(data: AdvancedSimulationRequestDto): string {
    let prompt = `Analyze the power dynamics in this ${data.parties.length}-party negotiation:\n\n`;

    data.parties.forEach((party, i) => {
      prompt += `**Party ${String.fromCharCode(65 + i)}: ${party.name}**\n`;
      prompt += `Goals: ${party.goals}\n`;
      
      if (party.empathyProfile?.powerDynamic) {
        prompt += `Power Dynamic: ${party.empathyProfile.powerDynamic}\n`;
      }
      if (party.empathyProfile?.negotiationStyle) {
        prompt += `Negotiation Style: ${party.empathyProfile.negotiationStyle}\n`;
      }
      if (party.advancedConstraints?.budgetMax) {
        prompt += `Budget: $${party.advancedConstraints.budgetMax.toLocaleString()}\n`;
      }
      prompt += '\n';
    });

    prompt += `Provide analysis in JSON format:
{
  "currentDynamics": "description of power distribution",
  "imbalances": ["imbalance1", "imbalance2"],
  "balancingStrategies": ["strategy1", "strategy2", "strategy3"],
  "equityScore": 75
}

Rate equity (fairness of power distribution) on 0-100 scale. Suggest concrete strategies to balance power.`;

    return prompt;
  }

  /**
   * Build cultural bridge prompt
   */
  private buildCulturalBridgePrompt(data: AdvancedSimulationRequestDto): string {
    let prompt = `Analyze cultural communication differences in this negotiation:\n\n`;

    const cultures = data.parties
      .filter(p => p.empathyProfile?.culturalContext)
      .map(p => `${p.name}: ${p.empathyProfile!.culturalContext}`);

    if (cultures.length === 0) {
      prompt += 'No specific cultural contexts provided. Assume multicultural business setting.\n\n';
    } else {
      prompt += 'Cultural Contexts:\n';
      cultures.forEach(c => prompt += `- ${c}\n`);
      prompt += '\n';
    }

    prompt += `Provide analysis in JSON format:
{
  "culturalTensions": ["tension1", "tension2"],
  "communicationAdjustments": ["adjustment1", "adjustment2"],
  "protocolRecommendations": ["protocol1", "protocol2"],
  "successFactors": ["factor1", "factor2", "factor3"]
}

Identify potential misunderstandings and provide specific communication adaptations.`;

    return prompt;
  }

  /**
   * Parse empathy insight from AI response
   */
  private parseEmpathyInsight(response: string, partyName: string): EmpathyInsight {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          partyName,
          emotionalNeeds: parsed.emotionalNeeds || [],
          communicationRecommendations: parsed.communicationRecommendations || [],
          conflictRisks: parsed.conflictRisks || [],
          bridgingStrategies: parsed.bridgingStrategies || [],
        };
      }
    } catch (error) {
      this.logger.warn('Failed to parse empathy insight JSON');
    }
    return this.getFallbackEmpathyInsight(partyName);
  }

  /**
   * Parse sentiment analysis
   */
  private parseSentimentAnalysis(response: string): SentimentAnalysis {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          overallSentiment: parsed.overallSentiment || 'neutral',
          emotionalTone: parsed.emotionalTone || 'Professional and balanced',
          empathyScore: parsed.empathyScore || 70,
          inclusivityScore: parsed.inclusivityScore || 70,
          recommendations: parsed.recommendations || [],
        };
      }
    } catch (error) {
      this.logger.warn('Failed to parse sentiment analysis JSON');
    }
    return this.getFallbackSentiment();
  }

  /**
   * Parse power balance report
   */
  private parsePowerBalanceReport(response: string): PowerBalanceReport {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          currentDynamics: parsed.currentDynamics || 'Mixed power distribution',
          imbalances: parsed.imbalances || [],
          balancingStrategies: parsed.balancingStrategies || [],
          equityScore: parsed.equityScore || 70,
        };
      }
    } catch (error) {
      this.logger.warn('Failed to parse power balance JSON');
    }
    return this.getFallbackPowerBalance();
  }

  /**
   * Parse cultural bridge
   */
  private parseCulturalBridge(response: string): CulturalBridge {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          culturalTensions: parsed.culturalTensions || [],
          communicationAdjustments: parsed.communicationAdjustments || [],
          protocolRecommendations: parsed.protocolRecommendations || [],
          successFactors: parsed.successFactors || [],
        };
      }
    } catch (error) {
      this.logger.warn('Failed to parse cultural bridge JSON');
    }
    return this.getFallbackCulturalBridge();
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(
    systemPrompt: string,
    userPrompt: string,
    model: string,
    temperature: number,
    maxTokens: number,
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const messages: OpenAIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

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
        timeout: 60000,
      },
    );

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    return content.trim();
  }

  /**
   * Fallback responses
   */
  private getFallbackEmpathyInsight(partyName: string): EmpathyInsight {
    return {
      partyName,
      emotionalNeeds: [
        'Recognition and respect',
        'Clear communication',
        'Fair treatment',
      ],
      communicationRecommendations: [
        'Use active listening techniques',
        'Acknowledge their perspective',
        'Be transparent about constraints',
      ],
      conflictRisks: [
        'Misalignment of expectations',
        'Communication breakdowns',
        'Trust issues',
      ],
      bridgingStrategies: [
        'Establish common ground early',
        'Create safe space for concerns',
        'Use collaborative problem-solving',
      ],
    };
  }

  private getFallbackSentiment(): SentimentAnalysis {
    return {
      overallSentiment: 'neutral',
      emotionalTone: 'Professional and balanced',
      empathyScore: 70,
      inclusivityScore: 70,
      recommendations: [
        'Consider acknowledging emotional stakes',
        'Ensure all parties feel heard',
        'Use inclusive language',
      ],
    };
  }

  private getFallbackPowerBalance(): PowerBalanceReport {
    return {
      currentDynamics: 'Power distribution appears relatively balanced',
      imbalances: [
        'Some parties may have more resources',
        'Experience levels may vary',
      ],
      balancingStrategies: [
        'Ensure equal voice in discussions',
        'Provide information access to all parties',
        'Use neutral facilitation',
      ],
      equityScore: 70,
    };
  }

  private getFallbackCulturalBridge(): CulturalBridge {
    return {
      culturalTensions: [
        'Different communication styles',
        'Varying decision-making norms',
      ],
      communicationAdjustments: [
        'Be explicit about expectations',
        'Allow time for consensus building',
        'Respect cultural protocols',
      ],
      protocolRecommendations: [
        'Establish clear meeting structures',
        'Use culturally neutral language',
        'Build personal relationships',
      ],
      successFactors: [
        'Mutual respect and understanding',
        'Patience with different styles',
        'Focus on shared goals',
      ],
    };
  }
}
