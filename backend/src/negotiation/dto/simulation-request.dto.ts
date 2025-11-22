import { IsString, IsNotEmpty, IsNumber, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PartyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  goals: string;

  @IsString()
  @IsNotEmpty()
  constraints: string;
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

export class SimulationRequestDto {
  @ValidateNested()
  @Type(() => PartyDto)
  partyA: PartyDto;

  @ValidateNested()
  @Type(() => PartyDto)
  partyB: PartyDto;

  @ValidateNested()
  @Type(() => EsgDto)
  esg: EsgDto;
}
