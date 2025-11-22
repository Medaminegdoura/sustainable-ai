export class ScoresDto {
  economic: number;
  social: number;
  environmental: number;
}

export class SimulationResponseDto {
  economic_compromise: string;
  social_compromise: string;
  balanced_compromise: string;
  scores: ScoresDto;
}
