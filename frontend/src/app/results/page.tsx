'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { exportService } from '@/lib/export';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import type { SimulationResponse, SimulationRequest } from '@/types/negotiation';

// Register Chart.js components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<SimulationResponse | null>(null);
  const [request, setRequest] = useState<SimulationRequest | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    // Load results from sessionStorage
    const resultData = sessionStorage.getItem('simulationResult');
    const requestData = sessionStorage.getItem('simulationRequest');

    if (!resultData || !requestData) {
      router.push('/setup');
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
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: ['Economic', 'Social', 'Environmental'],
    datasets: [
      {
        label: 'Sustainability Scores',
        data: [result.scores.economic, result.scores.social, result.scores.environmental],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(34, 197, 94, 1)',
      },
    ],
  };

  const chartOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const handleRunAgain = () => {
    sessionStorage.removeItem('simulationResult');
    sessionStorage.removeItem('simulationRequest');
    router.push('/setup');
  };

  const handleExportJSON = () => {
    if (result && request) {
      exportService.exportJSON(request, result);
      setShowExportMenu(false);
    }
  };

  const handleExportText = () => {
    if (result && request) {
      exportService.exportText(request, result);
      setShowExportMenu(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (result && request) {
      const success = await exportService.copyToClipboard(request, result);
      if (success) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
      setShowExportMenu(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Negotiation Results
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            AI-generated compromise proposals for {request.partyA.name} and {request.partyB.name}
          </p>
        </div>

        {/* Scores Chart */}
        <Card title="Impact Scores" className="mb-8">
          <div className="max-w-md mx-auto">
            <Radar data={chartData} options={chartOptions} />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{result.scores.economic}</div>
              <div className="text-sm text-gray-600">Economic</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{result.scores.social}</div>
              <div className="text-sm text-gray-600">Social</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{result.scores.environmental}</div>
              <div className="text-sm text-gray-600">Environmental</div>
            </div>
          </div>
        </Card>

        {/* Compromise Proposals */}
        <div className="space-y-6 mb-8">
          {/* Economic Compromise */}
          <Card className="border-l-4 border-blue-500">
            <div className="flex items-start">
              <div className="text-3xl mr-4">💰</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Economic-Optimized Compromise
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {result.economic_compromise}
                </p>
              </div>
            </div>
          </Card>

          {/* Social Compromise */}
          <Card className="border-l-4 border-green-500">
            <div className="flex items-start">
              <div className="text-3xl mr-4">🤝</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Social-Optimized Compromise
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {result.social_compromise}
                </p>
              </div>
            </div>
          </Card>

          {/* Balanced Compromise */}
          <Card className="border-l-4 border-primary-600">
            <div className="flex items-start">
              <div className="text-3xl mr-4">🌍</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Balanced Sustainable Compromise
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {result.balanced_compromise}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Button variant="outline" onClick={() => router.push('/')}>
            ← Home
          </Button>
          <div className="relative">
            <Button variant="outline" onClick={() => setShowExportMenu(!showExportMenu)}>
              📥 Export
            </Button>
            {showExportMenu && (
              <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px] z-10">
                <button
                  onClick={handleExportJSON}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                >
                  Export as JSON
                </button>
                <button
                  onClick={handleExportText}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                >
                  Export as Text
                </button>
                <button
                  onClick={handleCopyToClipboard}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                >
                  {copySuccess ? '✓ Copied!' : 'Copy to Clipboard'}
                </button>
              </div>
            )}
          </div>
          <Button onClick={handleRunAgain}>
            Run Another Simulation
          </Button>
        </div>
      </main>
    </div>
  );
}
