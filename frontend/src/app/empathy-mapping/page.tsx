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
import type { AdvancedSimulationRequest, EmotionalState, PowerDynamic, NegotiationStyle, CulturalContextType, EmpathyProfile } from '@/types/advanced-negotiation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function EmpathyMappingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [numParties, setNumParties] = useState(2);
  const [parties, setParties] = useState([
    createEmptyParty(),
    createEmptyParty(),
  ]);

  const [esg, setEsg] = useState({
    environmental: 50,
    social: 50,
    governance: 50,
  });

  function createEmptyParty() {
    return {
      name: '',
      goals: '',
      constraints: '',
      empathyProfile: {
        emotionalState: 'collaborative' as EmotionalState,
        powerDynamic: 'equal' as PowerDynamic,
        negotiationStyle: 'collaborating' as NegotiationStyle,
        culturalContext: 'multicultural' as CulturalContextType,
        emotionalTriggers: [''],
        coreValues: [''],
        pastExperiences: '',
        trustLevel: 50,
        stressLevel: 50,
      },
    };
  }

  const handleAddParty = () => {
    if (numParties < 5) {
      setNumParties(numParties + 1);
      setParties([...parties, createEmptyParty()]);
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

  const handleEmpathyProfileChange = (index: number, field: string, value: any) => {
    const newParties = [...parties];
    (newParties[index].empathyProfile as any)[field] = value;
    setParties(newParties);
  };

  const handleArrayFieldChange = (partyIndex: number, field: 'emotionalTriggers' | 'coreValues', arrayIndex: number, value: string) => {
    const newParties = [...parties];
    (newParties[partyIndex].empathyProfile as any)[field][arrayIndex] = value;
    setParties(newParties);
  };

  const handleAddArrayField = (partyIndex: number, field: 'emotionalTriggers' | 'coreValues') => {
    const newParties = [...parties];
    (newParties[partyIndex].empathyProfile as any)[field].push('');
    setParties(newParties);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const requestData: AdvancedSimulationRequest = {
        parties: parties.slice(0, numParties).map((p) => ({
          name: p.name,
          goals: p.goals,
          constraints: p.constraints,
          empathyProfile: {
            ...p.empathyProfile,
            emotionalTriggers: p.empathyProfile.emotionalTriggers?.filter(t => t.trim() !== ''),
            coreValues: p.empathyProfile.coreValues?.filter(v => v.trim() !== ''),
          },
        })),
        esg,
        aiConfig: {
          model: 'gpt-4o-mini',
          creativity: 75,
          tone: 'diplomatic',
          maxTokens: 600,
        },
        industry: 'general',
        includeRiskAnalysis: true,
        enableEmpathyMapping: true,
        enableSentimentAnalysis: true,
        enablePowerBalancing: true,
        enableCulturalBridging: true,
        negotiationRound: 1,
      };

      const response = await axios.post(`${API_URL}/simulate/advanced`, requestData, {
        timeout: 120000, // 2 minutes for empathy analysis
      });

      sessionStorage.setItem('empathySimulationResult', JSON.stringify(response.data));
      sessionStorage.setItem('empathySimulationRequest', JSON.stringify(requestData));

      router.push('/empathy-results');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Simulation failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <span className="text-6xl">🧠💙</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Empathy Mapping AI
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-6">
            Revolutionary emotional intelligence system that analyzes psychological factors, power dynamics, 
            and cultural contexts to create emotionally-aware negotiation solutions
          </p>
          <div className="flex gap-4 justify-center text-sm text-gray-600 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎭</span>
              <span>Emotional State Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚖️</span>
              <span>Power Dynamics</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌏</span>
              <span>Cultural Bridging</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💬</span>
              <span>Sentiment Analysis</span>
            </div>
          </div>
        </div>

        {error && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <div className="text-red-700">
              <strong>Error:</strong> {error}
            </div>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Parties with Empathy Profiles */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  👥 Negotiating Parties with Empathy Profiles ({numParties})
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Define emotional intelligence profiles for each party
                </p>
              </div>
              {numParties < 5 && (
                <Button type="button" onClick={handleAddParty} variant="outline" size="sm">
                  + Add Party
                </Button>
              )}
            </div>

            <div className="space-y-12">
              {parties.slice(0, numParties).map((party, index) => (
                <div key={index} className="border-2 border-purple-200 rounded-lg p-6 bg-purple-50/30">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-purple-900">
                      Party {String.fromCharCode(65 + index)}: Empathy Profile
                    </h3>
                    {numParties > 2 && (
                      <Button type="button" onClick={() => handleRemoveParty(index)} variant="outline" size="sm">
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Basic Info */}
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Basic Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Party Name *</label>
                        <Input
                          required
                          value={party.name}
                          onChange={(e) => handlePartyChange(index, 'name', e.target.value)}
                          placeholder="e.g., TechCorp"
                          label=""
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Goals *</label>
                        <TextArea
                          required
                          value={party.goals}
                          onChange={(e) => handlePartyChange(index, 'goals', e.target.value)}
                          placeholder="What they want to achieve..."
                          rows={2}
                          label=""
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Constraints</label>
                        <TextArea
                          value={party.constraints}
                          onChange={(e) => handlePartyChange(index, 'constraints', e.target.value)}
                          placeholder="Limitations and boundaries..."
                          rows={2}
                          label=""
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emotional & Psychological Profile */}
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-800 mb-3">🎭 Emotional & Psychological State</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Emotional State</label>
                        <select
                          value={party.empathyProfile.emotionalState}
                          onChange={(e) => handleEmpathyProfileChange(index, 'emotionalState', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="collaborative">Collaborative</option>
                          <option value="defensive">Defensive</option>
                          <option value="aggressive">Aggressive</option>
                          <option value="anxious">Anxious</option>
                          <option value="optimistic">Optimistic</option>
                          <option value="skeptical">Skeptical</option>
                          <option value="desperate">Desperate</option>
                          <option value="confident">Confident</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Negotiation Style</label>
                        <select
                          value={party.empathyProfile.negotiationStyle}
                          onChange={(e) => handleEmpathyProfileChange(index, 'negotiationStyle', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="competing">Competing (Win-Lose)</option>
                          <option value="collaborating">Collaborating (Win-Win)</option>
                          <option value="compromising">Compromising (Give & Take)</option>
                          <option value="avoiding">Avoiding (Withdraw)</option>
                          <option value="accommodating">Accommodating (Yield)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trust Level: {party.empathyProfile.trustLevel}%</label>
                        <Slider
                          value={party.empathyProfile.trustLevel || 50}
                          onChange={(value) => handleEmpathyProfileChange(index, 'trustLevel', value)}
                          min={0}
                          max={100}
                          label=""
                        />
                        <p className="text-xs text-gray-500 mt-1">Trust in other parties</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stress Level: {party.empathyProfile.stressLevel}%</label>
                        <Slider
                          value={party.empathyProfile.stressLevel || 50}
                          onChange={(value) => handleEmpathyProfileChange(index, 'stressLevel', value)}
                          min={0}
                          max={100}
                          label=""
                        />
                        <p className="text-xs text-gray-500 mt-1">Current pressure and anxiety</p>
                      </div>
                    </div>
                  </div>

                  {/* Power & Cultural Context */}
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-800 mb-3">⚖️ Power & Cultural Context</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Power Dynamic</label>
                        <select
                          value={party.empathyProfile.powerDynamic}
                          onChange={(e) => handleEmpathyProfileChange(index, 'powerDynamic', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="equal">Equal (Balanced power)</option>
                          <option value="dominant">Dominant (Strong position)</option>
                          <option value="subordinate">Subordinate (Weak position)</option>
                          <option value="dependent">Dependent (Reliant on others)</option>
                          <option value="independent">Independent (Self-sufficient)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cultural Context</label>
                        <select
                          value={party.empathyProfile.culturalContext}
                          onChange={(e) => handleEmpathyProfileChange(index, 'culturalContext', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="western-direct">Western (Direct communication)</option>
                          <option value="eastern-indirect">Eastern (Indirect, harmony-focused)</option>
                          <option value="middle-eastern">Middle Eastern (Relationship-based)</option>
                          <option value="latin-american">Latin American (Personal connection)</option>
                          <option value="african">African (Community-oriented)</option>
                          <option value="scandinavian">Scandinavian (Consensus-driven)</option>
                          <option value="multicultural">Multicultural (Mixed background)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Emotional Triggers & Core Values */}
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">💭 Deep Psychological Profile</h4>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Emotional Triggers</label>
                      <p className="text-xs text-gray-500 mb-2">Things that upset or strongly motivate this party</p>
                      {party.empathyProfile.emotionalTriggers?.map((trigger, tIndex) => (
                        <div key={tIndex} className="mb-2">
                          <Input
                            value={trigger}
                            onChange={(e) => handleArrayFieldChange(index, 'emotionalTriggers', tIndex, e.target.value)}
                            placeholder="e.g., Being rushed, Unfairness, Disrespect"
                            label=""
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={() => handleAddArrayField(index, 'emotionalTriggers')}
                        variant="outline"
                        size="sm"
                      >
                        + Add Trigger
                      </Button>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Core Values</label>
                      <p className="text-xs text-gray-500 mb-2">Fundamental beliefs that drive their decisions</p>
                      {party.empathyProfile.coreValues?.map((value, vIndex) => (
                        <div key={vIndex} className="mb-2">
                          <Input
                            value={value}
                            onChange={(e) => handleArrayFieldChange(index, 'coreValues', vIndex, e.target.value)}
                            placeholder="e.g., Fairness, Innovation, Tradition, Sustainability"
                            label=""
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={() => handleAddArrayField(index, 'coreValues')}
                        variant="outline"
                        size="sm"
                      >
                        + Add Value
                      </Button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Past Experiences</label>
                      <TextArea
                        value={party.empathyProfile.pastExperiences || ''}
                        onChange={(e) => handleEmpathyProfileChange(index, 'pastExperiences', e.target.value)}
                        placeholder="Relevant history that shapes their perspective (e.g., previous failed negotiations, personal losses, past successes)"
                        rows={3}
                        label=""
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Global ESG */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🌍 Global ESG Priorities</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Environmental: {esg.environmental}%
                </label>
                <Slider
                  value={esg.environmental}
                  onChange={(value) => setEsg({ ...esg, environmental: value })}
                  min={0}
                  max={100}
                  label=""
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
                  label=""
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
                  label=""
                />
              </div>
            </div>
          </Card>

          {/* What You'll Get */}
          <Card className="bg-gradient-to-r from-purple-100 to-blue-100 border-purple-300">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🎁 What You'll Receive:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎭</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Empathy Insights</h4>
                  <p className="text-sm text-gray-600">Emotional needs, communication strategies for each party</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">💬</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Sentiment Analysis</h4>
                  <p className="text-sm text-gray-600">Emotional tone, empathy & inclusivity scores</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚖️</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Power Balance Report</h4>
                  <p className="text-sm text-gray-600">Power dynamics analysis with balancing strategies</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🌏</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Cultural Bridge</h4>
                  <p className="text-sm text-gray-600">Cross-cultural communication recommendations</p>
                </div>
              </div>
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
                  Analyzing Empathy...
                </>
              ) : (
                '🧠 Generate Empathy-Aware Solutions'
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
