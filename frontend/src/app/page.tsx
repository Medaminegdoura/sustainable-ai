'use client';

import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            AI-Powered Sustainable Negotiations
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Reach fair, balanced, and environmentally responsible agreements using 
            artificial intelligence. Our platform analyzes ESG priorities and generates 
            optimized compromise proposals that benefit all parties.
          </p>
          <Button
            size="lg"
            onClick={() => router.push('/setup')}
          >
            Start Negotiation Simulation
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Economic Optimization
            </h3>
            <p className="text-gray-600">
              AI-generated compromises that prioritize financial efficiency and 
              maximize ROI for both parties.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Social Impact Focus
            </h3>
            <p className="text-gray-600">
              Solutions that emphasize fairness, equity, and positive social outcomes 
              for all stakeholders.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Balanced Sustainability
            </h3>
            <p className="text-gray-600">
              Harmonized compromises that balance economic, social, and environmental 
              ESG priorities.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            How It Works
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-primary-100 rounded-full w-8 h-8 flex items-center justify-center text-primary-700 font-bold mr-4">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Input Negotiation Parameters</h4>
                <p className="text-gray-600">
                  {`Define both parties' goals, constraints, and ESG priorities`}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-primary-100 rounded-full w-8 h-8 flex items-center justify-center text-primary-700 font-bold mr-4">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">AI Analysis</h4>
                <p className="text-gray-600">
                  Our AI processes the data and simulates multiple negotiation scenarios.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-primary-100 rounded-full w-8 h-8 flex items-center justify-center text-primary-700 font-bold mr-4">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Receive Optimized Proposals</h4>
                <p className="text-gray-600">
                  Get three compromise options: economic-focused, social-focused, and balanced.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Features Highlight */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg p-8 border-2 border-primary-200">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl">🚀</span>
            <h3 className="text-2xl font-bold text-gray-800 ml-3">NEW: Advanced Simulator</h3>
          </div>
          <p className="text-center text-gray-700 mb-6">
            Unlock powerful features: Multi-party negotiations, custom metrics, risk analysis, iterative rounds, and more!
          </p>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/60 rounded-lg p-3">
              <div className="text-2xl mb-1">👥</div>
              <p className="text-sm font-semibold text-gray-700">2-5 Parties</p>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <div className="text-2xl mb-1">🎯</div>
              <p className="text-sm font-semibold text-gray-700">Custom Metrics</p>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <div className="text-2xl mb-1">⚠️</div>
              <p className="text-sm font-semibold text-gray-700">Risk Analysis</p>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <div className="text-2xl mb-1">🔄</div>
              <p className="text-sm font-semibold text-gray-700">Iterative Rounds</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-700 mb-6">
            Ready to experience AI-powered sustainable negotiations?
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              variant="primary"
              onClick={() => router.push('/setup')}
            >
              Quick Start →
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/advanced-setup')}
            >
              🚀 Advanced Mode
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            © 2025 Sustainable Negotiation AI - Prototype Demo
          </p>
        </div>
      </footer>
    </div>
  );
}
