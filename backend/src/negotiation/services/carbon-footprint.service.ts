import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface CarbonMetrics {
  totalCO2Grams: number;
  energyKWh: number;
  tokenCount: number;
  modelUsed: string;
  executionTimeMs: number;
  greenScore: number; // 0-100, higher is better
  equivalentMetrics: {
    treeHoursNeeded: number; // Hours a tree needs to absorb this CO2
    drivingMeters: number; // Equivalent car driving distance
    smartphoneCharges: number; // Equivalent phone charges
    lightBulbHours: number; // Hours a 60W bulb could run
  };
  recommendations: string[];
  carbonSavingsVsTraditional: number; // grams saved vs in-person meeting
}

export interface CarbonHistoryEntry {
  timestamp: Date;
  co2Grams: number;
  energyKWh: number;
  modelUsed: string;
  simulationType: string;
  greenScore: number;
}

export interface GreenAIRecommendation {
  category: 'model-selection' | 'optimization' | 'caching' | 'timing' | 'offset';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  potentialSavingsCO2Grams: number;
  implementationDifficulty: 'easy' | 'medium' | 'hard';
}

@Injectable()
export class CarbonFootprintService {
  // CO2 emissions per 1000 tokens (in grams) - based on research
  private readonly MODEL_CARBON_INTENSITY = {
    'gpt-4': 0.0052, // Most carbon-intensive
    'gpt-4o-mini': 0.0028, // More efficient
    'gpt-3.5-turbo': 0.0015, // Most efficient
  };

  // Energy consumption per 1000 tokens (in kWh)
  private readonly MODEL_ENERGY_CONSUMPTION = {
    'gpt-4': 0.0047,
    'gpt-4o-mini': 0.0025,
    'gpt-3.5-turbo': 0.0013,
  };

  // Average CO2 per kWh (global average: 475g CO2/kWh)
  private readonly CO2_PER_KWH = 475;

  // Traditional in-person meeting carbon footprint (per participant per hour)
  private readonly TRADITIONAL_MEETING_CO2 = 5000; // 5kg CO2 (travel, venue, etc.)

  constructor(private configService: ConfigService) {}

  /**
   * Calculate carbon footprint for an API call
   */
  calculateCarbonFootprint(
    modelUsed: string,
    tokenCount: number,
    executionTimeMs: number,
    participantCount: number = 2,
  ): CarbonMetrics {
    const model = modelUsed as keyof typeof this.MODEL_CARBON_INTENSITY;
    const carbonIntensity = this.MODEL_CARBON_INTENSITY[model] || this.MODEL_CARBON_INTENSITY['gpt-4o-mini'];
    const energyPerToken = this.MODEL_ENERGY_CONSUMPTION[model] || this.MODEL_ENERGY_CONSUMPTION['gpt-4o-mini'];

    // Calculate base emissions from tokens
    const tokenCO2 = (tokenCount / 1000) * carbonIntensity;

    // Calculate energy consumption
    const energyKWh = (tokenCount / 1000) * energyPerToken;

    // Add overhead for API calls, data transfer (estimated 0.5g per call)
    const overheadCO2 = 0.5;

    // Total CO2
    const totalCO2Grams = tokenCO2 + overheadCO2;

    // Green score (0-100, based on efficiency)
    const greenScore = this.calculateGreenScore(modelUsed, tokenCount, executionTimeMs);

    // Carbon savings vs traditional meeting (2 hours average)
    const traditionalMeetingCO2 = this.TRADITIONAL_MEETING_CO2 * participantCount;
    const carbonSavingsVsTraditional = traditionalMeetingCO2 - totalCO2Grams;

    // Equivalent metrics
    const equivalentMetrics = {
      treeHoursNeeded: totalCO2Grams / 21, // A tree absorbs ~21g CO2/hour
      drivingMeters: totalCO2Grams / 0.12, // Car emits ~120g CO2/km = 0.12g/m
      smartphoneCharges: totalCO2Grams / 8, // Charging phone = ~8g CO2
      lightBulbHours: (energyKWh * 1000) / 60, // 60W bulb
    };

    // Generate recommendations
    const recommendations = this.generateRecommendations(modelUsed, tokenCount, greenScore);

    return {
      totalCO2Grams,
      energyKWh,
      tokenCount,
      modelUsed,
      executionTimeMs,
      greenScore,
      equivalentMetrics,
      recommendations,
      carbonSavingsVsTraditional,
    };
  }

  /**
   * Calculate Green AI Score (0-100)
   */
  private calculateGreenScore(modelUsed: string, tokenCount: number, executionTimeMs: number): number {
    let score = 100;

    // Deduct points for model choice
    if (modelUsed === 'gpt-4') {
      score -= 20; // Most carbon-intensive
    } else if (modelUsed === 'gpt-4o-mini') {
      score -= 10; // Medium efficiency
    } else {
      score -= 5; // Most efficient
    }

    // Deduct points for token usage (higher = worse)
    if (tokenCount > 2000) {
      score -= 30;
    } else if (tokenCount > 1000) {
      score -= 15;
    } else if (tokenCount > 500) {
      score -= 5;
    }

    // Deduct points for execution time (longer = worse optimization)
    if (executionTimeMs > 60000) {
      score -= 20;
    } else if (executionTimeMs > 30000) {
      score -= 10;
    } else if (executionTimeMs > 10000) {
      score -= 5;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate green AI recommendations
   */
  private generateRecommendations(modelUsed: string, tokenCount: number, greenScore: number): string[] {
    const recommendations: string[] = [];

    // Model selection recommendations
    if (modelUsed === 'gpt-4') {
      recommendations.push(
        '🌱 Switch to gpt-4o-mini to reduce CO2 emissions by 46% with similar quality',
      );
      recommendations.push(
        '💡 Use gpt-3.5-turbo for simple negotiations to reduce emissions by 71%',
      );
    } else if (modelUsed === 'gpt-4o-mini') {
      recommendations.push(
        '✅ Good choice! Consider gpt-3.5-turbo for simpler scenarios to save 46% more CO2',
      );
    } else {
      recommendations.push(
        '🌟 Excellent! You\'re using the most carbon-efficient model',
      );
    }

    // Token optimization
    if (tokenCount > 1500) {
      recommendations.push(
        '📉 Reduce token usage by being more concise in prompts and limiting response length',
      );
      recommendations.push(
        '⚡ Consider caching repeated analyses to avoid redundant API calls',
      );
    } else if (tokenCount > 800) {
      recommendations.push(
        '👍 Reasonable token usage. Fine-tune prompts to optimize further',
      );
    } else {
      recommendations.push(
        '🎯 Excellent token efficiency!',
      );
    }

    // General green AI tips
    if (greenScore < 70) {
      recommendations.push(
        '🌍 Run simulations during off-peak hours when renewable energy is more available',
      );
      recommendations.push(
        '♻️ Batch multiple simulations together to reduce overhead',
      );
    }

    // Carbon offset suggestion
    recommendations.push(
      `🌳 Plant ${Math.ceil(tokenCount / 10000)} tree(s) to offset your AI carbon footprint`,
    );

    return recommendations;
  }

  /**
   * Get detailed Green AI recommendations
   */
  getDetailedRecommendations(metrics: CarbonMetrics): GreenAIRecommendation[] {
    const recommendations: GreenAIRecommendation[] = [];

    // Model selection
    if (metrics.modelUsed === 'gpt-4') {
      recommendations.push({
        category: 'model-selection',
        priority: 'high',
        title: 'Switch to More Efficient Model',
        description: 'Use gpt-4o-mini for 46% carbon reduction or gpt-3.5-turbo for 71% reduction',
        potentialSavingsCO2Grams: metrics.totalCO2Grams * 0.46,
        implementationDifficulty: 'easy',
      });
    }

    // Token optimization
    if (metrics.tokenCount > 1000) {
      recommendations.push({
        category: 'optimization',
        priority: 'medium',
        title: 'Optimize Prompt Length',
        description: 'Reduce token usage by writing more concise prompts and limiting max_tokens',
        potentialSavingsCO2Grams: metrics.totalCO2Grams * 0.3,
        implementationDifficulty: 'easy',
      });
    }

    // Caching
    recommendations.push({
      category: 'caching',
      priority: 'medium',
      title: 'Implement Response Caching',
      description: 'Cache similar negotiations to avoid redundant API calls',
      potentialSavingsCO2Grams: metrics.totalCO2Grams * 0.5,
      implementationDifficulty: 'medium',
    });

    // Timing optimization
    recommendations.push({
      category: 'timing',
      priority: 'low',
      title: 'Use Renewable Energy Hours',
      description: 'Schedule batch operations during peak renewable energy production (10am-4pm)',
      potentialSavingsCO2Grams: metrics.totalCO2Grams * 0.2,
      implementationDifficulty: 'easy',
    });

    // Carbon offset
    recommendations.push({
      category: 'offset',
      priority: 'high',
      title: 'Purchase Carbon Offsets',
      description: `Offset ${metrics.totalCO2Grams.toFixed(2)}g CO2 through verified carbon credit programs`,
      potentialSavingsCO2Grams: metrics.totalCO2Grams,
      implementationDifficulty: 'easy',
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  /**
   * Calculate cumulative carbon footprint
   */
  calculateCumulativeFootprint(history: CarbonHistoryEntry[]): {
    totalCO2Kg: number;
    totalEnergyKWh: number;
    totalSimulations: number;
    averageGreenScore: number;
    trend: 'improving' | 'stable' | 'worsening';
    comparisonToTraditional: {
      traditionalCO2Kg: number;
      aiCO2Kg: number;
      savingsPercentage: number;
    };
  } {
    const totalCO2Grams = history.reduce((sum, entry) => sum + entry.co2Grams, 0);
    const totalEnergyKWh = history.reduce((sum, entry) => sum + entry.energyKWh, 0);
    const averageGreenScore = history.reduce((sum, entry) => sum + entry.greenScore, 0) / history.length;

    // Calculate trend (compare recent 30% vs older 30%)
    const recentThird = Math.floor(history.length * 0.3);
    const recentEntries = history.slice(-recentThird);
    const oldEntries = history.slice(0, recentThird);

    const recentAvg = recentEntries.reduce((sum, e) => sum + e.co2Grams, 0) / recentThird;
    const oldAvg = oldEntries.reduce((sum, e) => sum + e.co2Grams, 0) / recentThird;

    let trend: 'improving' | 'stable' | 'worsening';
    if (recentAvg < oldAvg * 0.9) {
      trend = 'improving';
    } else if (recentAvg > oldAvg * 1.1) {
      trend = 'worsening';
    } else {
      trend = 'stable';
    }

    // Comparison to traditional
    const traditionalCO2Kg = (history.length * this.TRADITIONAL_MEETING_CO2 * 2) / 1000; // 2 participants
    const aiCO2Kg = totalCO2Grams / 1000;
    const savingsPercentage = ((traditionalCO2Kg - aiCO2Kg) / traditionalCO2Kg) * 100;

    return {
      totalCO2Kg: totalCO2Grams / 1000,
      totalEnergyKWh,
      totalSimulations: history.length,
      averageGreenScore,
      trend,
      comparisonToTraditional: {
        traditionalCO2Kg,
        aiCO2Kg,
        savingsPercentage,
      },
    };
  }

  /**
   * Get carbon offset options
   */
  getCarbonOffsetOptions(co2Grams: number): {
    treePlanting: {
      trees: number;
      costUSD: number;
      description: string;
    };
    renewableEnergy: {
      kWh: number;
      costUSD: number;
      description: string;
    };
    directCapture: {
      grams: number;
      costUSD: number;
      description: string;
    };
  } {
    const co2Kg = co2Grams / 1000;

    return {
      treePlanting: {
        trees: Math.ceil(co2Kg / 20), // A tree absorbs ~20kg CO2/year
        costUSD: Math.ceil(co2Kg / 20) * 1.5, // $1.50 per tree
        description: 'Plant trees through verified reforestation programs',
      },
      renewableEnergy: {
        kWh: co2Kg / 0.475, // Convert back to kWh
        costUSD: (co2Kg / 0.475) * 0.05, // $0.05 per kWh renewable credit
        description: 'Fund renewable energy projects (solar, wind)',
      },
      directCapture: {
        grams: co2Grams,
        costUSD: co2Kg * 0.6, // $600 per ton = $0.60 per kg
        description: 'Support direct air capture technology',
      },
    };
  }

  /**
   * Get green AI badges/achievements
   */
  getGreenBadges(cumulativeData: ReturnType<typeof this.calculateCumulativeFootprint>): {
    badge: string;
    title: string;
    description: string;
    level: number;
  }[] {
    const badges: any[] = [];

    // Savings badge
    if (cumulativeData.comparisonToTraditional.savingsPercentage > 99) {
      badges.push({
        badge: '🌍',
        title: 'Planet Protector',
        description: `Saved ${cumulativeData.comparisonToTraditional.savingsPercentage.toFixed(1)}% CO2 vs traditional meetings`,
        level: 5,
      });
    } else if (cumulativeData.comparisonToTraditional.savingsPercentage > 95) {
      badges.push({
        badge: '🌿',
        title: 'Eco Warrior',
        description: `Saved ${cumulativeData.comparisonToTraditional.savingsPercentage.toFixed(1)}% CO2 vs traditional meetings`,
        level: 4,
      });
    }

    // Green score badge
    if (cumulativeData.averageGreenScore > 90) {
      badges.push({
        badge: '⭐',
        title: 'Green AI Master',
        description: `Average Green Score: ${cumulativeData.averageGreenScore.toFixed(1)}`,
        level: 5,
      });
    } else if (cumulativeData.averageGreenScore > 80) {
      badges.push({
        badge: '✨',
        title: 'Green AI Expert',
        description: `Average Green Score: ${cumulativeData.averageGreenScore.toFixed(1)}`,
        level: 4,
      });
    }

    // Trend badge
    if (cumulativeData.trend === 'improving') {
      badges.push({
        badge: '📈',
        title: 'Continuous Improver',
        description: 'Your carbon footprint is decreasing over time',
        level: 3,
      });
    }

    // Volume badge
    if (cumulativeData.totalSimulations > 100) {
      badges.push({
        badge: '🏆',
        title: 'Green AI Champion',
        description: `${cumulativeData.totalSimulations} sustainable simulations completed`,
        level: 4,
      });
    } else if (cumulativeData.totalSimulations > 50) {
      badges.push({
        badge: '🥇',
        title: 'Sustainability Leader',
        description: `${cumulativeData.totalSimulations} sustainable simulations completed`,
        level: 3,
      });
    }

    return badges;
  }
}
