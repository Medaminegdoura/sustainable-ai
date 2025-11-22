'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import type { CarbonMetrics, GreenAIRecommendation } from '@/types/advanced-negotiation';

export default function CarbonDashboardPage() {
  const [carbonData, setCarbonData] = useState<CarbonMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<GreenAIRecommendation[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  useEffect(() => {
    // Load carbon data from last simulation
    const lastResult = sessionStorage.getItem('empathySimulationResult') || 
                       sessionStorage.getItem('advancedSimulationResult');
    
    if (lastResult) {
      try {
        const parsed = JSON.parse(lastResult);
        if (parsed.carbonFootprint) {
          setCarbonData(parsed.carbonFootprint);
        }
        if (parsed.greenAIRecommendations) {
          setRecommendations(parsed.greenAIRecommendations);
        }
      } catch (error) {
        console.error('Failed to parse carbon data:', error);
      }
    }

    // Load historical data from localStorage
    const stored = localStorage.getItem('carbonHistory');
    if (stored) {
      try {
        setHistoricalData(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    }
  }, []);

  const getGreenScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-300';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-300';
    return 'text-red-600 bg-red-50 border-red-300';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'bg-red-100 text-red-800 border-red-300';
    if (priority === 'medium') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  const getDifficultyIcon = (difficulty: string) => {
    if (difficulty === 'easy') return '✅';
    if (difficulty === 'medium') return '⚙️';
    return '🔧';
  };

  if (!carbonData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto mt-20" title="No Carbon Data Available">
            <p className="text-gray-600 mb-4">
              Run a simulation with carbon tracking enabled to see your environmental impact.
            </p>
            <Link href="/advanced-setup">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                🌱 Start Green AI Simulation
              </Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  const savingsPercentage = (carbonData.carbonSavingsVsTraditional / 5000) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🌱 Carbon Footprint Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Track and optimize your AI's environmental impact
          </p>
        </div>

        {/* Green Score Card */}
        <Card className={`mb-8 border-4 ${getGreenScoreColor(carbonData.greenScore)}`}>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Green AI Score</h2>
            <div className="text-7xl font-bold mb-2">
              {carbonData.greenScore}
            </div>
            <p className="text-lg font-semibold">
              {carbonData.greenScore >= 80 ? '🌟 Excellent!' :
               carbonData.greenScore >= 60 ? '👍 Good' : '⚠️ Needs Improvement'}
            </p>
          </div>
        </Card>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* CO2 Emissions */}
          <Card className="border-2 border-emerald-200">
            <div className="text-center">
              <div className="text-4xl mb-2">🌍</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">CO₂ Emissions</h3>
              <div className="text-3xl font-bold text-emerald-600 mb-1">
                {carbonData.totalCO2Grams.toFixed(2)}g
              </div>
              <p className="text-sm text-gray-600">
                Energy: {carbonData.energyKWh.toFixed(4)} kWh
              </p>
            </div>
          </Card>

          {/* Tokens Used */}
          <Card className="border-2 border-blue-200">
            <div className="text-center">
              <div className="text-4xl mb-2">🔤</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Tokens Used</h3>
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {carbonData.tokenCount.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">
                Model: {carbonData.modelUsed}
              </p>
            </div>
          </Card>

          {/* Carbon Savings */}
          <Card className="border-2 border-green-200">
            <div className="text-center">
              <div className="text-4xl mb-2">💚</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Carbon Saved</h3>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {savingsPercentage.toFixed(1)}%
              </div>
              <p className="text-sm text-gray-600">
                vs. Traditional Meeting
              </p>
            </div>
          </Card>
        </div>

        {/* Equivalent Metrics */}
        <Card className="mb-8" title="🌳 Environmental Equivalents">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-3xl">🌲</span>
              <div>
                <h4 className="font-semibold text-gray-800">Tree Absorption Time</h4>
                <p className="text-sm text-gray-600">
                  {carbonData.equivalentMetrics.treeHoursNeeded.toFixed(1)} hours needed for a tree to absorb this CO₂
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-3xl">🚗</span>
              <div>
                <h4 className="font-semibold text-gray-800">Driving Distance</h4>
                <p className="text-sm text-gray-600">
                  Equivalent to driving {(carbonData.equivalentMetrics.drivingMeters / 1000).toFixed(2)} km by car
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <span className="text-3xl">📱</span>
              <div>
                <h4 className="font-semibold text-gray-800">Smartphone Charges</h4>
                <p className="text-sm text-gray-600">
                  Equivalent to {carbonData.equivalentMetrics.smartphoneCharges.toFixed(1)} full phone charges
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <span className="text-3xl">💡</span>
              <div>
                <h4 className="font-semibold text-gray-800">Light Bulb Hours</h4>
                <p className="text-sm text-gray-600">
                  Could power a 60W bulb for {carbonData.equivalentMetrics.lightBulbHours.toFixed(1)} hours
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Tips */}
        {carbonData.recommendations && carbonData.recommendations.length > 0 && (
          <Card className="mb-8" title="💡 Quick Green AI Tips">
            <div className="space-y-2">
              {carbonData.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-xl flex-shrink-0">✨</span>
                  <p className="text-sm text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Detailed Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <Card className="mb-8" title="🎯 Detailed Recommendations">
            <div className="space-y-4">
              {recommendations.map((rec, idx) => (
                <div key={idx} className={`p-4 rounded-lg border-2 ${getPriorityColor(rec.priority)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getDifficultyIcon(rec.implementationDifficulty)}</span>
                      <h4 className="font-bold text-lg">{rec.title}</h4>
                    </div>
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold uppercase">
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm mb-3">{rec.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="font-semibold">
                      💰 Potential Savings: {rec.potentialSavingsCO2Grams.toFixed(2)}g CO₂
                    </span>
                    <span className="font-semibold">
                      🔧 Difficulty: {rec.implementationDifficulty}
                    </span>
                    <span className="font-semibold">
                      📂 Category: {rec.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Carbon Offset Options */}
        <Card className="mb-8" title="🌳 Carbon Offset Options">
          <p className="text-gray-600 mb-4">
            Take action to neutralize your AI's carbon footprint:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
              <div className="text-3xl mb-2">🌲</div>
              <h4 className="font-semibold text-gray-800 mb-2">Tree Planting</h4>
              <p className="text-sm text-gray-600 mb-2">
                Plant {Math.ceil(carbonData.totalCO2Grams / 20000)} tree(s)
              </p>
              <p className="text-xs text-gray-500">
                Estimated cost: ${(Math.ceil(carbonData.totalCO2Grams / 20000) * 1.5).toFixed(2)}
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-semibold text-gray-800 mb-2">Renewable Energy</h4>
              <p className="text-sm text-gray-600 mb-2">
                Fund {carbonData.energyKWh.toFixed(2)} kWh renewable credits
              </p>
              <p className="text-xs text-gray-500">
                Estimated cost: ${(carbonData.energyKWh * 0.05).toFixed(2)}
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-300">
              <div className="text-3xl mb-2">🏭</div>
              <h4 className="font-semibold text-gray-800 mb-2">Direct Air Capture</h4>
              <p className="text-sm text-gray-600 mb-2">
                Remove {carbonData.totalCO2Grams.toFixed(2)}g CO₂
              </p>
              <p className="text-xs text-gray-500">
                Estimated cost: ${((carbonData.totalCO2Grams / 1000) * 0.6).toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link href="/advanced">
            <Button className="bg-green-600 hover:bg-green-700">
              🌱 Run Another Green Simulation
            </Button>
          </Link>
          <Button
            variant="secondary"
            onClick={() => {
              const data = JSON.stringify({ carbonData, recommendations }, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `carbon-footprint-${Date.now()}.json`;
              a.click();
            }}
          >
            💾 Export Report
          </Button>
        </div>
      </main>
    </div>
  );
}
