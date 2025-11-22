import { IsString, IsNotEmpty, IsNumber, Min, Max, ValidateNested, IsOptional, IsEnum, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export enum AIModel {
  GPT_4 = 'gpt-4',
  GPT_4O_MINI = 'gpt-4o-mini',
  GPT_35_TURBO = 'gpt-3.5-turbo',
}

export enum ToneType {
  FORMAL = 'formal',
  CASUAL = 'casual',
  TECHNICAL = 'technical',
  DIPLOMATIC = 'diplomatic',
}

export enum IndustryType {
  TECHNOLOGY = 'technology',
  HEALTHCARE = 'healthcare',
  FINANCE = 'finance',
  REAL_ESTATE = 'real-estate',
  MANUFACTURING = 'manufacturing',
  GOVERNMENT = 'government',
  RETAIL = 'retail',
  ENERGY = 'energy',
  GENERAL = 'general',
}

export enum EmotionalState {
  COLLABORATIVE = 'collaborative',
  DEFENSIVE = 'defensive',
  AGGRESSIVE = 'aggressive',
  ANXIOUS = 'anxious',
  OPTIMISTIC = 'optimistic',
  SKEPTICAL = 'skeptical',
  DESPERATE = 'desperate',
  CONFIDENT = 'confident',
}

export enum PowerDynamic {
  EQUAL = 'equal',
  DOMINANT = 'dominant',
  SUBORDINATE = 'subordinate',
  DEPENDENT = 'dependent',
  INDEPENDENT = 'independent',
}

export enum NegotiationStyle {
  COMPETING = 'competing',
  COLLABORATING = 'collaborating',
  COMPROMISING = 'compromising',
  AVOIDING = 'avoiding',
  ACCOMMODATING = 'accommodating',
}

export enum CulturalContext {
  WESTERN_DIRECT = 'western-direct',
  EASTERN_INDIRECT = 'eastern-indirect',
  MIDDLE_EASTERN = 'middle-eastern',
  LATIN_AMERICAN = 'latin-american',
  AFRICAN = 'african',
  SCANDINAVIAN = 'scandinavian',
  MULTICULTURAL = 'multicultural',
}

export class ConstraintDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dealBreakers?: string[]; // Non-negotiable items

  @IsOptional()
  @IsNumber()
  @Min(0)
  budgetMax?: number; // Maximum budget

  @IsOptional()
  @IsNumber()
  @Min(0)
  timelineMonths?: number; // Timeline in months

  @IsOptional()
  @IsString()
  regulatoryRequirements?: string; // Legal/regulatory constraints
}

export class CustomMetricDto {
  @IsString()
  @IsNotEmpty()
  name: string; // e.g., "ROI", "Innovation Score", "Quality"

  @IsNumber()
  @Min(0)
  @Max(100)
  priority: number; // Priority weight (0-100)

  @IsString()
  @IsNotEmpty()
  description: string; // What this metric measures
}

export class EsgDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  environmental: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  social: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  governance: number;
}

export class EmpathyProfileDto {
  @IsOptional()
  @IsEnum(EmotionalState)
  emotionalState?: EmotionalState;

  @IsOptional()
  @IsEnum(PowerDynamic)
  powerDynamic?: PowerDynamic;

  @IsOptional()
  @IsEnum(NegotiationStyle)
  negotiationStyle?: NegotiationStyle;

  @IsOptional()
  @IsEnum(CulturalContext)
  culturalContext?: CulturalContext;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  emotionalTriggers?: string[]; // Things that upset/motivate this party

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  coreValues?: string[]; // Fundamental beliefs (e.g., "fairness", "tradition", "innovation")

  @IsOptional()
  @IsString()
  pastExperiences?: string; // Relevant history that shapes their perspective

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  trustLevel?: number; // Trust in other parties (0-100)

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  stressLevel?: number; // Current stress/pressure (0-100)
}

export class AdvancedPartyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  goals: string;

  @IsString()
  @IsNotEmpty()
  constraints: string;

  @ValidateNested()
  @Type(() => ConstraintDto)
  @IsOptional()
  advancedConstraints?: ConstraintDto;

  @ValidateNested()
  @Type(() => EsgDto)
  @IsOptional()
  individualEsgPriorities?: EsgDto; // Each party can have different ESG priorities

  @ValidateNested()
  @Type(() => EmpathyProfileDto)
  @IsOptional()
  empathyProfile?: EmpathyProfileDto; // INNOVATIVE: Emotional intelligence profile
}


export class AIConfigDto {
  @IsOptional()
  @IsEnum(AIModel)
  model?: AIModel; // Default: gpt-4o-mini

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number; // 0 = deterministic, 2 = very creative (default: 0.7)

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  creativity?: number; // User-friendly creativity slider (0-100, maps to temperature)

  @IsOptional()
  @IsEnum(ToneType)
  tone?: ToneType; // Response tone (default: diplomatic)

  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(2000)
  maxTokens?: number; // Response length (default: 300)
}

export class AdvancedSimulationRequestDto {
  @ValidateNested({ each: true })
  @Type(() => AdvancedPartyDto)
  @IsArray()
  parties: AdvancedPartyDto[]; // Support 2-5 parties

  @ValidateNested()
  @Type(() => EsgDto)
  esg: EsgDto; // Global ESG priorities

  @ValidateNested()
  @Type(() => AIConfigDto)
  @IsOptional()
  aiConfig?: AIConfigDto;

  @IsOptional()
  @IsEnum(IndustryType)
  industry?: IndustryType; // Industry context for better proposals

  @ValidateNested({ each: true })
  @Type(() => CustomMetricDto)
  @IsOptional()
  customMetrics?: CustomMetricDto[]; // User-defined KPIs

  @IsOptional()
  @IsBoolean()
  includeRiskAnalysis?: boolean; // Generate risk assessment (default: false)

  @IsOptional()
  @IsBoolean()
  includeMitigationStrategies?: boolean; // Generate risk mitigation (default: false)

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  negotiationRound?: number; // Support iterative rounds (default: 1)

  @IsOptional()
  @IsString()
  previousRoundFeedback?: string; // Feedback from previous round

  @IsOptional()
  @IsBoolean()
  enableEmpathyMapping?: boolean; // INNOVATIVE: Enable emotional intelligence analysis

  @IsOptional()
  @IsBoolean()
  enableSentimentAnalysis?: boolean; // Analyze emotional tone of proposals

  @IsOptional()
  @IsBoolean()
  enablePowerBalancing?: boolean; // Suggest ways to balance power dynamics

  @IsOptional()
  @IsBoolean()
  enableCulturalBridging?: boolean; // Bridge cultural communication differences

  @IsOptional()
  @IsBoolean()
  trackCarbonFootprint?: boolean; // INNOVATIVE: Track carbon footprint and provide green AI recommendations
}
