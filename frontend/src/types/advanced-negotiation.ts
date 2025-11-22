export interface AdvancedConstraint {
  dealBreakers?: string[];
  budgetMax?: number;
  timelineMonths?: number;
  regulatoryRequirements?: string;
}

export interface CustomMetric {
  name: string;
  priority: number;
  description: string;
}

export interface AdvancedParty {
  name: string;
  goals: string;
  constraints: string;
  advancedConstraints?: AdvancedConstraint;
  individualEsgPriorities?: ESG;
}

export interface Party {
  name: string;
  goals: string;
  constraints: string;
}

export interface ESG {
  environmental: number;
  social: number;
  governance: number;
}

export type AIModel = 'gpt-4' | 'gpt-4o-mini' | 'gpt-3.5-turbo';
export type ToneType = 'formal' | 'casual' | 'technical' | 'diplomatic';
export type IndustryType = 'technology' | 'healthcare' | 'finance' | 'real-estate' | 'manufacturing' | 'government' | 'retail' | 'energy' | 'general';

export interface AIConfig {
  model?: AIModel;
  temperature?: number;
  creativity?: number;
  tone?: ToneType;
  maxTokens?: number;
}

export interface SimulationRequest {
  partyA: Party;
  partyB: Party;
  esg: ESG;
}

export interface AdvancedSimulationRequest {
  parties: AdvancedParty[];
  esg: ESG;
  aiConfig?: AIConfig;
  industry?: IndustryType;
  customMetrics?: CustomMetric[];
  includeRiskAnalysis?: boolean;
  includeMitigationStrategies?: boolean;
  negotiationRound?: number;
  previousRoundFeedback?: string;
}

export interface RiskAssessment {
  riskLevel: 'low' | 'medium' | 'high';
  potentialRisks: string[];
  mitigationStrategies: string[];
  confidenceScore: number;
}

export interface Scores {
  economic: number;
  social: number;
  environmental: number;
}

export interface CustomMetricScore {
  name: string;
  score: number;
  explanation: string;
}

export interface SimulationResponse {
  economic_compromise: string;
  social_compromise: string;
  balanced_compromise: string;
  scores: Scores;
}

export interface AdvancedSimulationResponse extends SimulationResponse {
  riskAssessment?: RiskAssessment;
  customMetricScores?: CustomMetricScore[];
  implementationPhases?: string[];
  alternativeOptions?: string[];
  negotiationRoundNumber?: number;
  improvementSuggestions?: string[];
}
