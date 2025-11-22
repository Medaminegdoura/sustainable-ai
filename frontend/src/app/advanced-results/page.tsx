'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Radar, Doughnut, Bar } from 'react-chartjs-2';
import type { AdvancedSimulationResponse, AdvancedSimulationRequest } from '@/types/advanced-negotiation';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

export default function AdvancedResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AdvancedSimulationResponse | null>(null);
  const [request, setRequest] = useState<AdvancedSimulationRequest | null>(null);

  useEffect(() => {
    const resultData = sessionStorage.getItem('advancedSimulationResult');
    const requestData = sessionStorage.getItem('advancedSimulationRequest');

    if (!resultData || !requestData) {
      router.push('/advanced-setup');
      return;
    }

    setResult(JSON.parse(resultData));
    setRequest(JSON.parse(requestData));
  }, [router]);

  if (!result || !request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading advanced results...</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: ['Economic', 'Social', 'Environmental'],
    datasets: [
      {
        label: 'Sustainability Scores',
        data: [result.scores.economic, result.scores.social, result.scores.environmental],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
      },
    ],
  };

  const riskLevelColor = {
    low: 'text-green-700 bg-green-100',
    medium: 'text-yellow-700 bg-yellow-100',
    high: 'text-red-700 bg-red-100',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            🚀 Advanced Negotiation Results
          </h2>
          <p className="text-lg text-gray-600">
            {request.parties.length}-party negotiation • {request.industry} industry
            {result.negotiationRoundNumber && ` • Round ${result.negotiationRoundNumber}`}
          </p>
        </div>

        {/* Configuration Summary */}
        <Card className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">⚙️ Configuration</h3>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">AI Model:</span>
              <p className="text-gray-600">{request.aiConfig?.model || 'gpt-4o-mini'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Tone:</span>
              <p className="text-gray-600">{request.aiConfig?.tone || 'diplomatic'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Creativity:</span>
              <p className="text-gray-600">{request.aiConfig?.creativity || 70}%</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Industry:</span>
              <p className="text-gray-600">{request.industry || 'general'}</p>
            </div>
          </div>
        </Card>

        {/* Sustainability Scores */}
        <Card className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">📊 Sustainability Scores</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-700">Economic</span>
                    <span className="font-bold text-blue-600">{result.scores.economic}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full"
                      style={{ width: `${result.scores.economic}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-700">Social</span>
                    <span className="font-bold text-purple-600">{result.scores.social}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-purple-600 h-3 rounded-full"
                      style={{ width: `${result.scores.social}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-700">Environmental</span>
                    <span className="font-bold text-green-600">{result.scores.environmental}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full"
                      style={{ width: `${result.scores.environmental}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full max-w-sm">
                <Radar data={chartData} options={{ scales: { r: { beginAtZero: true, max: 100 } } }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Risk Assessment */}
        {result.riskAssessment && (
          <Card className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">⚠️ Risk Assessment</h3>
            
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-gray-700 font-medium">Risk Level:</span>
                <span className={`px-4 py-2 rounded-full font-semibold ${riskLevelColor[result.riskAssessment.riskLevel]}`}>
                  {result.riskAssessment.riskLevel.toUpperCase()}
                </span>
                <span className="text-gray-600">
                  Confidence: {result.riskAssessment.confidenceScore}%
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">🚨 Potential Risks</h4>
                <ul className="space-y-2">
                  {result.riskAssessment.potentialRisks.map((risk, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span className="text-gray-700">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">🛡️ Mitigation Strategies</h4>
                <ul className="space-y-2">
                  {result.riskAssessment.mitigationStrategies.map((strategy, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">{strategy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Custom Metrics */}
        {result.customMetricScores && result.customMetricScores.length > 0 && (
          <Card className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">📈 Custom Metric Scores</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {result.customMetricScores.map((metric, index) => (
                <div key={index} className="border-l-4 border-primary-500 pl-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-800">{metric.name}</h4>
                    <span className="text-2xl font-bold text-primary-600">{metric.score}/100</span>
                  </div>
                  <p className="text-sm text-gray-600">{metric.explanation}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Compromise Proposals */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <h3 className="text-xl font-semibold text-blue-600 mb-4">💼 Economic Compromise</h3>
            <p className="text-gray-700 leading-relaxed">{result.economic_compromise}</p>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold text-purple-600 mb-4">🤝 Social Compromise</h3>
            <p className="text-gray-700 leading-relaxed">{result.social_compromise}</p>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold text-green-600 mb-4">🌱 Balanced Compromise</h3>
            <p className="text-gray-700 leading-relaxed">{result.balanced_compromise}</p>
          </Card>
        </div>

        {/* Implementation Phases */}
        {result.implementationPhases && result.implementationPhases.length > 0 && (
          <Card className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">🗓️ Implementation Roadmap</h3>
            
            <div className="space-y-4">
              {result.implementationPhases.map((phase, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700">{phase}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Alternative Options */}
        {result.alternativeOptions && result.alternativeOptions.length > 0 && (
          <Card className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">💡 Alternative Approaches</h3>
            
            <ul className="space-y-3">
              {result.alternativeOptions.map((option, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-500 mr-3 text-xl">→</span>
                  <span className="text-gray-700">{option}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Improvement Suggestions */}
        {result.improvementSuggestions && result.improvementSuggestions.length > 0 && (
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <h3 className="text-xl font-semibold text-blue-900 mb-6">🎯 Improvement Suggestions</h3>
            
            <ul className="space-y-3">
              {result.improvementSuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-3">✨</span>
                  <span className="text-blue-900">{suggestion}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => router.push('/')}>
            ← Home
          </Button>
          <Button variant="outline" onClick={() => router.push('/advanced-setup')}>
            Run New Simulation
          </Button>
          <Button onClick={() => {
            // Increment round and go back
            const nextRoundRequest = {
              ...request,
              negotiationRound: (request.negotiationRound || 1) + 1,
            };
            sessionStorage.setItem('advancedSimulationRequest', JSON.stringify(nextRoundRequest));
            router.push('/advanced-setup');
          }}>
            Next Round →
          </Button>
        </div>
      </main>
    </div>
  );
}
