'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Slider } from '@/components/ui/Slider';
import { Card } from '@/components/ui/Card';
import { negotiationApi } from '@/lib/api';
import { historyService } from '@/lib/history';
import type { SimulationRequest, SimulationResponse } from '@/types/negotiation';

export default function SetupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<SimulationRequest>({
    partyA: {
      name: '',
      goals: '',
      constraints: '',
    },
    partyB: {
      name: '',
      goals: '',
      constraints: '',
    },
    esg: {
      environmental: 50,
      social: 50,
      governance: 50,
    },
  });

  // Load template data if available
  useEffect(() => {
    const templateData = sessionStorage.getItem('templateData');
    if (templateData) {
      setFormData(JSON.parse(templateData));
      sessionStorage.removeItem('templateData');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate form
      if (!formData.partyA.name || !formData.partyA.goals || !formData.partyA.constraints) {
        throw new Error('Please fill in all Party A fields');
      }
      if (!formData.partyB.name || !formData.partyB.goals || !formData.partyB.constraints) {
        throw new Error('Please fill in all Party B fields');
      }

      // Call API
      const result = await negotiationApi.simulate(formData);

      // Save to history
      historyService.save(formData, result);

      // Store result in sessionStorage and navigate
      sessionStorage.setItem('simulationResult', JSON.stringify(result));
      sessionStorage.setItem('simulationRequest', JSON.stringify(formData));
      router.push('/results');
    } catch (err: any) {
      console.error('Simulation error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to run simulation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Setup Negotiation Parameters
          </h2>
          <p className="text-lg text-gray-600">
            Define the parties involved, their objectives, and sustainability priorities.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Party A */}
          <Card title="Party A" className="mb-8">
            <Input
              label="Party Name"
              placeholder="e.g., Tech Corp"
              value={formData.partyA.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  partyA: { ...formData.partyA, name: e.target.value },
                })
              }
              required
            />
            <TextArea
              label="Goals & Objectives"
              placeholder="What does this party want to achieve?"
              value={formData.partyA.goals}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  partyA: { ...formData.partyA, goals: e.target.value },
                })
              }
              required
            />
            <TextArea
              label="Constraints & Limitations"
              placeholder="What are the non-negotiables or limitations?"
              value={formData.partyA.constraints}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  partyA: { ...formData.partyA, constraints: e.target.value },
                })
              }
              required
            />
          </Card>

          {/* Party B */}
          <Card title="Party B" className="mb-8">
            <Input
              label="Party Name"
              placeholder="e.g., Green Alliance"
              value={formData.partyB.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  partyB: { ...formData.partyB, name: e.target.value },
                })
              }
              required
            />
            <TextArea
              label="Goals & Objectives"
              placeholder="What does this party want to achieve?"
              value={formData.partyB.goals}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  partyB: { ...formData.partyB, goals: e.target.value },
                })
              }
              required
            />
            <TextArea
              label="Constraints & Limitations"
              placeholder="What are the non-negotiables or limitations?"
              value={formData.partyB.constraints}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  partyB: { ...formData.partyB, constraints: e.target.value },
                })
              }
              required
            />
          </Card>

          {/* ESG Priorities */}
          <Card title="ESG Priorities (0-100)" className="mb-8">
            <p className="text-sm text-gray-600 mb-6">
              Set the importance level for each sustainability factor. Higher values indicate greater priority.
            </p>
            <Slider
              label="🌍 Environmental Priority"
              value={formData.esg.environmental}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  esg: { ...formData.esg, environmental: value },
                })
              }
            />
            <Slider
              label="🤝 Social Priority"
              value={formData.esg.social}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  esg: { ...formData.esg, social: value },
                })
              }
            />
            <Slider
              label="⚖️ Governance Priority"
              value={formData.esg.governance}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  esg: { ...formData.esg, governance: value },
                })
              }
            />
          </Card>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/')}
              disabled={isLoading}
            >
              ← Back
            </Button>
            <Button type="submit" size="lg" isLoading={isLoading}>
              Run Sustainable Negotiation AI
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
