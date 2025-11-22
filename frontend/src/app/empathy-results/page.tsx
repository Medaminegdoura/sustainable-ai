'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import type { AdvancedSimulationResponse } from '@/types/advanced-negotiation';

export default function EmpathyResultsPage() {
  const [results, setResults] = useState<AdvancedSimulationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get data from sessionStorage
    const storedResults = sessionStorage.getItem('empathySimulationResult');
    if (storedResults) {
      try {
        const parsed = JSON.parse(storedResults);
        setResults(parsed);
      } catch (error) {
        console.error('Failed to parse results:', error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading empathy analysis...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto mt-20" title="No Results Found">
            <p className="text-gray-600 mb-4">
              No empathy analysis results were found. Please run a simulation first.
            </p>
            <Link href="/empathy-mapping">
              <Button className="w-full">Start New Empathy Simulation</Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-300';
    if (score >= 60) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'positive') return 'text-green-600 bg-green-50';
    if (sentiment === 'neutral') return 'text-gray-600 bg-gray-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🧠💙 Empathy Analysis Results
          </h1>
          <p className="text-lg text-gray-600">
            Emotional Intelligence Insights for Your Negotiation
          </p>
        </div>

        {/* Empathy Insights Section */}
        {results.empathyInsights && results.empathyInsights.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-purple-800 mb-6">💜 Empathy Insights</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              {results.empathyInsights.map((insight, idx) => (
                <Card key={idx} className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-purple-800 flex items-center gap-2">
                      <span>🎭</span>
                      {insight.partyName}
                    </h3>
                  </div>

                  {/* Emotional Needs */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                      <span>❤️</span> Emotional Needs
                    </h4>
                    <ul className="space-y-1">
                      {insight.emotionalNeeds.map((need, i) => (
                        <li key={i} className="text-sm text-gray-700 pl-4 border-l-2 border-pink-300">
                          {need}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Communication Recommendations */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                      <span>💬</span> Communication Tips
                    </h4>
                    <ul className="space-y-1">
                      {insight.communicationRecommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-gray-700 pl-4 border-l-2 border-blue-300">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Conflict Risks */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                      <span>⚠️</span> Conflict Risks
                    </h4>
                    <ul className="space-y-1">
                      {insight.conflictRisks.map((risk, i) => (
                        <li key={i} className="text-sm text-gray-700 pl-4 border-l-2 border-red-300">
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bridging Strategies */}
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                      <span>🌉</span> Bridging Strategies
                    </h4>
                    <ul className="space-y-1">
                      {insight.bridgingStrategies.map((strategy, i) => (
                        <li key={i} className="text-sm text-gray-700 pl-4 border-l-2 border-green-300">
                          {strategy}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Sentiment Analysis Section */}
        {results.sentimentAnalysis && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-blue-800 mb-6">😊 Sentiment Analysis</h2>

            <Card className="border-2 border-blue-200 shadow-lg">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column: Scores */}
                <div className="space-y-6">
                  {/* Overall Sentiment */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Overall Sentiment</h4>
                    <div className={`inline-block px-4 py-2 rounded-full font-semibold ${getSentimentColor(results.sentimentAnalysis.overallSentiment)}`}>
                      {results.sentimentAnalysis.overallSentiment.toUpperCase()}
                    </div>
                  </div>

                  {/* Emotional Tone */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Emotional Tone</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      {results.sentimentAnalysis.emotionalTone}
                    </p>
                  </div>

                  {/* Empathy Score */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Empathy Score</h4>
                    <div className="flex items-center gap-4">
                      <div className={`text-5xl font-bold ${getScoreColor(results.sentimentAnalysis.empathyScore)}`}>
                        {results.sentimentAnalysis.empathyScore}
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div 
                            className={`h-4 rounded-full transition-all ${
                              results.sentimentAnalysis.empathyScore >= 80 ? 'bg-green-500' :
                              results.sentimentAnalysis.empathyScore >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${results.sentimentAnalysis.empathyScore}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {results.sentimentAnalysis.empathyScore >= 80 ? 'Exceptional' :
                           results.sentimentAnalysis.empathyScore >= 60 ? 'Good' : 'Needs Improvement'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Inclusivity Score */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Inclusivity Score</h4>
                    <div className="flex items-center gap-4">
                      <div className={`text-5xl font-bold ${getScoreColor(results.sentimentAnalysis.inclusivityScore)}`}>
                        {results.sentimentAnalysis.inclusivityScore}
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div 
                            className={`h-4 rounded-full transition-all ${
                              results.sentimentAnalysis.inclusivityScore >= 80 ? 'bg-green-500' :
                              results.sentimentAnalysis.inclusivityScore >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${results.sentimentAnalysis.inclusivityScore}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {results.sentimentAnalysis.inclusivityScore >= 80 ? 'Highly Inclusive' :
                           results.sentimentAnalysis.inclusivityScore >= 60 ? 'Moderately Inclusive' : 'Needs Improvement'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Recommendations */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span>💡</span> Recommendations
                  </h4>
                  <div className="space-y-2">
                    {results.sentimentAnalysis.recommendations.map((rec, i) => (
                      <div key={i} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-gray-700">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Power Balance Section */}
        {results.powerBalanceReport && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-orange-800 mb-6">⚖️ Power Balance Report</h2>

            <Card className="border-2 border-orange-200 shadow-lg">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                {/* Equity Score */}
                <div className={`text-center p-6 rounded-lg border-2 ${getScoreBgColor(results.powerBalanceReport.equityScore)}`}>
                  <h4 className="font-semibold text-gray-700 mb-2">Equity Score</h4>
                  <div className={`text-6xl font-bold ${getScoreColor(results.powerBalanceReport.equityScore)}`}>
                    {results.powerBalanceReport.equityScore}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {results.powerBalanceReport.equityScore >= 80 ? 'Well Balanced' :
                     results.powerBalanceReport.equityScore >= 60 ? 'Moderate Balance' : 'Imbalanced'}
                  </p>
                </div>

                {/* Current Dynamics */}
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-gray-700 mb-3">Current Power Dynamics</h4>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {results.powerBalanceReport.currentDynamics}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Imbalances */}
                <div>
                  <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                    <span>⚠️</span> Identified Imbalances
                  </h4>
                  <ul className="space-y-2">
                    {results.powerBalanceReport.imbalances.map((imbalance, i) => (
                      <li key={i} className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-gray-700">{imbalance}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Balancing Strategies */}
                <div>
                  <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <span>✅</span> Balancing Strategies
                  </h4>
                  <ul className="space-y-2">
                    {results.powerBalanceReport.balancingStrategies.map((strategy, i) => (
                      <li key={i} className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-gray-700">{strategy}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Cultural Bridge Section */}
        {results.culturalBridge && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-teal-800 mb-6">🌍 Cultural Bridge</h2>

            <Card className="border-2 border-teal-200 shadow-lg">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Cultural Tensions */}
                <div>
                  <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                    <span>⚡</span> Cultural Tensions
                  </h4>
                  <ul className="space-y-2">
                    {results.culturalBridge.culturalTensions.map((tension, i) => (
                      <li key={i} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <p className="text-sm text-gray-700">{tension}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Communication Adjustments */}
                <div>
                  <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                    <span>🗣️</span> Communication Adjustments
                  </h4>
                  <ul className="space-y-2">
                    {results.culturalBridge.communicationAdjustments.map((adjustment, i) => (
                      <li key={i} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-gray-700">{adjustment}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Protocol Recommendations */}
                <div>
                  <h4 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                    <span>📋</span> Protocol Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {results.culturalBridge.protocolRecommendations.map((protocol, i) => (
                      <li key={i} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <p className="text-sm text-gray-700">{protocol}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Success Factors */}
                <div>
                  <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <span>🎯</span> Success Factors
                  </h4>
                  <ul className="space-y-2">
                    {results.culturalBridge.successFactors.map((factor, i) => (
                      <li key={i} className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-gray-700">{factor}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Standard Proposals Section */}
        {results.proposals && results.proposals.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-indigo-800 mb-6">📋 AI-Generated Proposals</h2>

            <div className="space-y-4">
              {results.proposals.map((proposal, idx) => (
                <Card key={idx} className="border-2 border-indigo-200 shadow-lg">
                  <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                    <span>💡</span>
                    Proposal {idx + 1}
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{proposal}</p>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-12">
          <Link href="/empathy-mapping">
            <Button className="bg-purple-600 hover:bg-purple-700">
              🔄 Run Another Simulation
            </Button>
          </Link>
          <Button 
            variant="secondary"
            onClick={() => {
              const data = JSON.stringify(results, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `empathy-analysis-${Date.now()}.json`;
              a.click();
            }}
          >
            💾 Export Results
          </Button>
        </div>
      </main>
    </div>
  );
}
