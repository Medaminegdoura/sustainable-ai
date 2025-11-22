'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { historyService } from '@/lib/history';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    calculateAnalytics();
  }, []);

  const calculateAnalytics = () => {
    const history = historyService.getAll();
    const stats = historyService.getStats();

    if (history.length === 0) {
      setAnalytics(null);
      return;
    }

    // Score distribution over time
    const timelineData = history.reverse().map((item, index) => ({
      negotiation: `#${index + 1}`,
      economic: item.response.scores.economic,
      social: item.response.scores.social,
      environmental: item.response.scores.environmental,
      date: new Date(item.timestamp).toLocaleDateString(),
    }));

    // ESG priority distribution
    const esgDistribution = history.reduce(
      (acc, item) => ({
        environmental: acc.environmental + item.request.esg.environmental,
        social: acc.social + item.request.esg.social,
        governance: acc.governance + item.request.esg.governance,
      }),
      { environmental: 0, social: 0, governance: 0 }
    );

    // Score ranges
    const scoreRanges = {
      high: history.filter(h => 
        (h.response.scores.economic + h.response.scores.social + h.response.scores.environmental) / 3 >= 75
      ).length,
      medium: history.filter(h => {
        const avg = (h.response.scores.economic + h.response.scores.social + h.response.scores.environmental) / 3;
        return avg >= 50 && avg < 75;
      }).length,
      low: history.filter(h => 
        (h.response.scores.economic + h.response.scores.social + h.response.scores.environmental) / 3 < 50
      ).length,
    };

    setAnalytics({
      stats,
      timelineData,
      esgDistribution,
      scoreRanges,
      totalNegotiations: history.length,
    });
  };

  if (!analytics || analytics.totalNegotiations === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No Analytics Data Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create some negotiations to see detailed analytics and insights
            </p>
            <Button size="lg" onClick={() => router.push('/setup')}>
              Create Your First Negotiation
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  // Timeline Chart Data
  const timelineChartData = {
    labels: analytics.timelineData.map((d: any) => d.negotiation),
    datasets: [
      {
        label: 'Economic Score',
        data: analytics.timelineData.map((d: any) => d.economic),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Social Score',
        data: analytics.timelineData.map((d: any) => d.social),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Environmental Score',
        data: analytics.timelineData.map((d: any) => d.environmental),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.4,
      },
    ],
  };

  // Score Distribution Chart
  const scoreDistributionData = {
    labels: ['High (75-100)', 'Medium (50-74)', 'Low (0-49)'],
    datasets: [
      {
        data: [analytics.scoreRanges.high, analytics.scoreRanges.medium, analytics.scoreRanges.low],
        backgroundColor: ['#10b981', '#3b82f6', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  // ESG Priority Chart
  const esgPriorityData = {
    labels: ['Environmental', 'Social', 'Governance'],
    datasets: [
      {
        label: 'Average ESG Priorities',
        data: [
          analytics.esgDistribution.environmental / analytics.totalNegotiations,
          analytics.esgDistribution.social / analytics.totalNegotiations,
          analytics.esgDistribution.governance / analytics.totalNegotiations,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.6)',
          'rgba(59, 130, 246, 0.6)',
          'rgba(139, 92, 246, 0.6)',
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(59, 130, 246)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Average Scores Radar
  const avgScoresData = {
    labels: ['Economic', 'Social', 'Environmental'],
    datasets: [
      {
        label: 'Average Scores',
        data: [
          analytics.stats.averages.economic,
          analytics.stats.averages.social,
          analytics.stats.averages.environmental,
        ],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgb(34, 197, 94)',
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(34, 197, 94)',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Analytics Dashboard
          </h2>
          <p className="text-lg text-gray-600">
            Insights and trends from your negotiation simulations
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="text-4xl mb-2">🔢</div>
            <div className="text-3xl font-bold text-primary-600">
              {analytics.totalNegotiations}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Negotiations</div>
          </Card>
          <Card className="text-center">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-3xl font-bold text-blue-600">
              {analytics.stats.averages.economic}
            </div>
            <div className="text-sm text-gray-600 mt-1">Avg Economic Score</div>
          </Card>
          <Card className="text-center">
            <div className="text-4xl mb-2">🤝</div>
            <div className="text-3xl font-bold text-green-600">
              {analytics.stats.averages.social}
            </div>
            <div className="text-sm text-gray-600 mt-1">Avg Social Score</div>
          </Card>
          <Card className="text-center">
            <div className="text-4xl mb-2">🌍</div>
            <div className="text-3xl font-bold text-emerald-600">
              {analytics.stats.averages.environmental}
            </div>
            <div className="text-sm text-gray-600 mt-1">Avg Environmental</div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Timeline Chart */}
          <Card title="Score Trends Over Time">
            <Line
              data={timelineChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                },
                scales: {
                  y: { beginAtZero: true, max: 100 },
                },
              }}
            />
          </Card>

          {/* Score Distribution */}
          <Card title="Overall Score Distribution">
            <div className="max-w-sm mx-auto">
              <Doughnut
                data={scoreDistributionData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'bottom' },
                  },
                }}
              />
            </div>
          </Card>

          {/* ESG Priorities */}
          <Card title="Average ESG Priority Settings">
            <Bar
              data={esgPriorityData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: { beginAtZero: true, max: 100 },
                },
              }}
            />
          </Card>

          {/* Average Scores Radar */}
          <Card title="Average Performance Across Dimensions">
            <div className="max-w-sm mx-auto">
              <Radar
                data={avgScoresData}
                options={{
                  responsive: true,
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100,
                    },
                  },
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </div>
          </Card>
        </div>

        {/* Insights */}
        <Card title="📈 Key Insights" className="mb-8">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="text-2xl mr-3">✅</div>
              <div>
                <h4 className="font-semibold text-gray-800">Performance Summary</h4>
                <p className="text-gray-600">
                  You've completed {analytics.totalNegotiations} negotiations with an average
                  score of{' '}
                  {Math.round(
                    (analytics.stats.averages.economic +
                      analytics.stats.averages.social +
                      analytics.stats.averages.environmental) /
                      3
                  )}
                  /100 across all dimensions.
                </p>
              </div>
            </div>

            {analytics.stats.averages.environmental > analytics.stats.averages.economic && (
              <div className="flex items-start">
                <div className="text-2xl mr-3">🌱</div>
                <div>
                  <h4 className="font-semibold text-gray-800">Strong Environmental Focus</h4>
                  <p className="text-gray-600">
                    Your negotiations show a strong emphasis on environmental sustainability,
                    with an average environmental score of {analytics.stats.averages.environmental}.
                  </p>
                </div>
              </div>
            )}

            {analytics.scoreRanges.high > analytics.totalNegotiations / 2 && (
              <div className="flex items-start">
                <div className="text-2xl mr-3">🎯</div>
                <div>
                  <h4 className="font-semibold text-gray-800">High Quality Outcomes</h4>
                  <p className="text-gray-600">
                    {Math.round((analytics.scoreRanges.high / analytics.totalNegotiations) * 100)}% of
                    your negotiations achieved high scores (75+), indicating consistently strong
                    compromises.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Actions */}
        <div className="text-center">
          <Button size="lg" onClick={() => router.push('/setup')}>
            Create New Negotiation
          </Button>
        </div>
      </main>
    </div>
  );
}
