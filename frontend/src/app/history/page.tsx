'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { historyService, NegotiationHistory } from '@/lib/history';

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<NegotiationHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHistory, setFilteredHistory] = useState<NegotiationHistory[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredHistory(historyService.search(searchQuery));
    } else {
      setFilteredHistory(history);
    }
  }, [searchQuery, history]);

  const loadHistory = () => {
    const data = historyService.getAll();
    const statsData = historyService.getStats();
    setHistory(data);
    setFilteredHistory(data);
    setStats(statsData);
  };

  const handleView = (item: NegotiationHistory) => {
    sessionStorage.setItem('simulationResult', JSON.stringify(item.response));
    sessionStorage.setItem('simulationRequest', JSON.stringify(item.request));
    router.push('/results');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this negotiation?')) {
      historyService.delete(id);
      loadHistory();
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all history? This cannot be undone.')) {
      historyService.clearAll();
      loadHistory();
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Negotiation History
          </h2>
          <p className="text-lg text-gray-600">
            View and manage your past negotiation simulations
          </p>
        </div>

        {/* Statistics */}
        {stats && stats.total > 0 && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center">
              <div className="text-3xl font-bold text-primary-600">{stats.total}</div>
              <div className="text-sm text-gray-600 mt-1">Total Simulations</div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.averages.economic}</div>
              <div className="text-sm text-gray-600 mt-1">Avg Economic Score</div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.averages.social}</div>
              <div className="text-sm text-gray-600 mt-1">Avg Social Score</div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-emerald-600">{stats.averages.environmental}</div>
              <div className="text-sm text-gray-600 mt-1">Avg Environmental</div>
            </Card>
          </div>
        )}

        {/* Search and Actions */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search negotiations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {history.length > 0 && (
            <Button variant="outline" onClick={handleClearAll}>
              Clear All History
            </Button>
          )}
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchQuery ? 'No results found' : 'No negotiations yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? 'Try a different search term'
                : 'Start by creating your first negotiation simulation'}
            </p>
            {!searchQuery && (
              <Button onClick={() => router.push('/setup')}>
                Create New Simulation
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <Card key={item.id} className="hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {item.name}
                    </h3>
                    <div className="text-sm text-gray-600 mb-3">
                      <span className="font-semibold">{item.request.partyA.name}</span>
                      {' vs '}
                      <span className="font-semibold">{item.request.partyB.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm mb-3">
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">📅</span>
                        <span>{formatDate(item.timestamp)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center">
                          <span className="text-blue-600 font-semibold mr-1">
                            {item.response.scores.economic}
                          </span>
                          <span className="text-gray-500">Econ</span>
                        </span>
                        <span className="flex items-center">
                          <span className="text-green-600 font-semibold mr-1">
                            {item.response.scores.social}
                          </span>
                          <span className="text-gray-500">Social</span>
                        </span>
                        <span className="flex items-center">
                          <span className="text-emerald-600 font-semibold mr-1">
                            {item.response.scores.environmental}
                          </span>
                          <span className="text-gray-500">Env</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded">
                        ESG: E{item.request.esg.environmental} S{item.request.esg.social} G{item.request.esg.governance}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm" onClick={() => handleView(item)}>
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
