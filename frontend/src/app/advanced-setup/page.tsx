'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Slider } from '@/components/ui/Slider';
import axios from 'axios';
import type { AdvancedSimulationRequest, AIModel, ToneType, IndustryType } from '@/types/advanced-negotiation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function AdvancedSetupPage() {
  const router = useRouter();
  const [numParties, setNumParties] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Party data
  const [parties, setParties] = useState([
    {
      name: '',
      goals: '',
      constraints: '',
      dealBreakers: [''],
      budgetMax: undefined as number | undefined,
      timelineMonths: undefined as number | undefined,
      regulatoryRequirements: '',
      individualEsgPriorities: { environmental: 50, social: 50, governance: 50 },
    },
    {
      name: '',
      goals: '',
      constraints: '',
      dealBreakers: [''],
      budgetMax: undefined as number | undefined,
      timelineMonths: undefined as number | undefined,
      regulatoryRequirements: '',
      individualEsgPriorities: { environmental: 50, social: 50, governance: 50 },
    },
  ]);

  // Global ESG
  const [esg, setEsg] = useState({
    environmental: 50,
    social: 50,
    governance: 50,
  });

  // AI Configuration
  const [aiConfig, setAiConfig] = useState({
    model: 'gpt-4o-mini' as AIModel,
    creativity: 70,
    tone: 'diplomatic' as ToneType,
    maxTokens: 500,
  });

  // Advanced options
  const [industry, setIndustry] = useState<IndustryType>('general');
  const [includeRiskAnalysis, setIncludeRiskAnalysis] = useState(true);
  const [includeMitigationStrategies, setIncludeMitigationStrategies] = useState(true);
  const [negotiationRound, setNegotiationRound] = useState(1);

  // Custom metrics
  const [customMetrics, setCustomMetrics] = useState([
    { name: '', priority: 50, description: '' },
  ]);

  const handleAddParty = () => {
    if (numParties < 5) {
      setNumParties(numParties + 1);
      setParties([
        ...parties,
        {
          name: '',
          goals: '',
          constraints: '',
          dealBreakers: [''],
          budgetMax: undefined,
          timelineMonths: undefined,
          regulatoryRequirements: '',
          individualEsgPriorities: { environmental: 50, social: 50, governance: 50 },
        },
      ]);
    }
  };

  const handleRemoveParty = (index: number) => {
    if (numParties > 2) {
      setNumParties(numParties - 1);
      setParties(parties.filter((_, i) => i !== index));
    }
  };

  const handlePartyChange = (index: number, field: string, value: any) => {
    const newParties = [...parties];
    (newParties[index] as any)[field] = value;
    setParties(newParties);
  };

  const handleAddDealBreaker = (partyIndex: number) => {
    const newParties = [...parties];
    newParties[partyIndex].dealBreakers.push('');
    setParties(newParties);
  };

  const handleDealBreakerChange = (partyIndex: number, dbIndex: number, value: string) => {
    const newParties = [...parties];
    newParties[partyIndex].dealBreakers[dbIndex] = value;
    setParties(newParties);
  };

  const handleAddCustomMetric = () => {
    setCustomMetrics([...customMetrics, { name: '', priority: 50, description: '' }]);
  };

  const handleCustomMetricChange = (index: number, field: string, value: any) => {
    const newMetrics = [...customMetrics];
    (newMetrics[index] as any)[field] = value;
    setCustomMetrics(newMetrics);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Build request
      const requestData: AdvancedSimulationRequest = {
        parties: parties.slice(0, numParties).map((p) => ({
          name: p.name,
          goals: p.goals,
          constraints: p.constraints,
          advancedConstraints: {
            dealBreakers: p.dealBreakers.filter((db) => db.trim() !== ''),
            budgetMax: p.budgetMax,
            timelineMonths: p.timelineMonths,
            regulatoryRequirements: p.regulatoryRequirements,
          },
          individualEsgPriorities: p.individualEsgPriorities,
        })),
        esg,
        aiConfig: {
          model: aiConfig.model,
          creativity: aiConfig.creativity,
          tone: aiConfig.tone,
          maxTokens: aiConfig.maxTokens,
        },
        industry,
        customMetrics: customMetrics.filter((m) => m.name.trim() !== ''),
        includeRiskAnalysis,
        includeMitigationStrategies,
        negotiationRound,
      };

      const response = await axios.post(`${API_URL}/simulate/advanced`, requestData, {
        timeout: 90000,
      });

      // Store results
      sessionStorage.setItem('advancedSimulationResult', JSON.stringify(response.data));
      sessionStorage.setItem('advancedSimulationRequest', JSON.stringify(requestData));

      router.push('/advanced-results');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Simulation failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            🚀 Advanced Negotiation Simulator
          </h1>
          <p className="text-xl text-gray-600">
            Configure multi-party negotiations with advanced AI, custom metrics, and risk analysis
          </p>
        </div>

        {error && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <div className="text-red-700">
              <strong>Error:</strong> {error}
            </div>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* AI Configuration */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🤖 AI Configuration</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Model
                </label>
                <select
                  value={aiConfig.model}
                  onChange={(e) => setAiConfig({ ...aiConfig, model: e.target.value as AIModel })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="gpt-4o-mini">GPT-4o Mini (Fast & Cost-Effective)</option>
                  <option value="gpt-4">GPT-4 (Most Capable)</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Budget Option)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response Tone
                </label>
                <select
                  value={aiConfig.tone}
                  onChange={(e) => setAiConfig({ ...aiConfig, tone: e.target.value as ToneType })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="diplomatic">Diplomatic (Balanced & Tactful)</option>
                  <option value="formal">Formal (Corporate & Professional)</option>
                  <option value="technical">Technical (Precise & Data-Driven)</option>
                  <option value="casual">Casual (Clear & Conversational)</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Creativity Level: {aiConfig.creativity}%
              </label>
              <Slider
                value={aiConfig.creativity}
                onChange={(value) => setAiConfig({ ...aiConfig, creativity: value })}
                min={0}
                max={100}
              />
              <p className="text-sm text-gray-500 mt-1">
                Higher creativity = more innovative solutions, Lower = more conservative approaches
              </p>
            </div>
          </Card>

          {/* Industry & Context */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🏭 Industry Context</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry Type
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as IndustryType)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="general">General</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="government">Government</option>
                  <option value="retail">Retail</option>
                  <option value="energy">Energy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Negotiation Round
                </label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={negotiationRound}
                  onChange={(e) => setNegotiationRound(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeRiskAnalysis}
                  onChange={(e) => setIncludeRiskAnalysis(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Include Risk Assessment
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeMitigationStrategies}
                  onChange={(e) => setIncludeMitigationStrategies(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Include Mitigation Strategies
                </span>
              </label>
            </div>
          </Card>

          {/* Parties */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                👥 Negotiating Parties ({numParties})
              </h2>
              <div className="space-x-2">
                {numParties < 5 && (
                  <Button type="button" onClick={handleAddParty} variant="outline" size="sm">
                    + Add Party
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-8">
              {parties.slice(0, numParties).map((party, index) => (
                <div key={index} className="border-t pt-6 first:border-t-0 first:pt-0">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Party {String.fromCharCode(65 + index)}
                    </h3>
                    {numParties > 2 && (
                      <Button
                        type="button"
                        onClick={() => handleRemoveParty(index)}
                        variant="outline"
                        size="sm"
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Party Name *
                      </label>
                      <Input
                        required
                        value={party.name}
                        onChange={(e) => handlePartyChange(index, 'name', e.target.value)}
                        placeholder={`e.g., TechCorp ${index === 0 ? '' : index === 1 ? '/ City Council' : '/ Community Group'}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Goals & Objectives *
                      </label>
                      <TextArea
                        required
                        value={party.goals}
                        onChange={(e) => handlePartyChange(index, 'goals', e.target.value)}
                        placeholder="What does this party want to achieve?"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Constraints
                      </label>
                      <TextArea
                        value={party.constraints}
                        onChange={(e) => handlePartyChange(index, 'constraints', e.target.value)}
                        placeholder="Budget limits, timelines, legal restrictions, etc."
                        rows={2}
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Budget Maximum ($)
                        </label>
                        <Input
                          type="number"
                          value={party.budgetMax || ''}
                          onChange={(e) =>
                            handlePartyChange(index, 'budgetMax', parseFloat(e.target.value) || undefined)
                          }
                          placeholder="e.g., 1000000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timeline (months)
                        </label>
                        <Input
                          type="number"
                          value={party.timelineMonths || ''}
                          onChange={(e) =>
                            handlePartyChange(index, 'timelineMonths', parseInt(e.target.value) || undefined)
                          }
                          placeholder="e.g., 12"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Regulatory Requirements
                        </label>
                        <Input
                          value={party.regulatoryRequirements}
                          onChange={(e) =>
                            handlePartyChange(index, 'regulatoryRequirements', e.target.value)
                          }
                          placeholder="e.g., EPA compliance"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deal Breakers (Non-Negotiable Items)
                      </label>
                      {party.dealBreakers.map((db, dbIndex) => (
                        <div key={dbIndex} className="flex gap-2 mb-2">
                          <Input
                            value={db}
                            onChange={(e) => handleDealBreakerChange(index, dbIndex, e.target.value)}
                            placeholder="e.g., Must maintain 100% job security"
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={() => handleAddDealBreaker(index)}
                        variant="outline"
                        size="sm"
                      >
                        + Add Deal Breaker
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Global ESG Priorities */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🌍 Global ESG Priorities</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Environmental: {esg.environmental}%
                </label>
                <Slider
                  value={esg.environmental}
                  onChange={(value) => setEsg({ ...esg, environmental: value })}
                  min={0}
                  max={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Social: {esg.social}%
                </label>
                <Slider
                  value={esg.social}
                  onChange={(value) => setEsg({ ...esg, social: value })}
                  min={0}
                  max={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Governance: {esg.governance}%
                </label>
                <Slider
                  value={esg.governance}
                  onChange={(value) => setEsg({ ...esg, governance: value })}
                  min={0}
                  max={100}
                />
              </div>
            </div>
          </Card>

          {/* Custom Metrics */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                📈 Custom Success Metrics (Optional)
              </h2>
              <Button type="button" onClick={handleAddCustomMetric} variant="outline" size="sm">
                + Add Metric
              </Button>
            </div>

            <div className="space-y-6">
              {customMetrics.map((metric, index) => (
                <div key={index} className="border-t pt-4 first:border-t-0 first:pt-0">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Metric Name
                      </label>
                      <Input
                        value={metric.name}
                        onChange={(e) => handleCustomMetricChange(index, 'name', e.target.value)}
                        placeholder="e.g., ROI, Innovation Score"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority: {metric.priority}%
                      </label>
                      <Slider
                        value={metric.priority}
                        onChange={(value) => handleCustomMetricChange(index, 'priority', value)}
                        min={0}
                        max={100}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <Input
                        value={metric.description}
                        onChange={(e) => handleCustomMetricChange(index, 'description', e.target.value)}
                        placeholder="What this measures"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Submit */}
          <div className="flex justify-center gap-4">
            <Button type="button" variant="outline" onClick={() => router.push('/')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                'Run Advanced Simulation'
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
