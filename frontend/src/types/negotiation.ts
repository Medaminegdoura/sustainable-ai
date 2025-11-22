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

export interface SimulationRequest {
  partyA: Party;
  partyB: Party;
  esg: ESG;
}

export interface Scores {
  economic: number;
  social: number;
  environmental: number;
}

export interface SimulationResponse {
  economic_compromise: string;
  social_compromise: string;
  balanced_compromise: string;
  scores: Scores;
}
