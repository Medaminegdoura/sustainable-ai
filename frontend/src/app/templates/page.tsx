'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { templates, categories, NegotiationTemplate } from '@/lib/templates';

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTemplates =
    selectedCategory === 'all'
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  const handleUseTemplate = (template: NegotiationTemplate) => {
    // Store template data in sessionStorage
    sessionStorage.setItem('templateData', JSON.stringify(template.data));
    router.push('/setup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Negotiation Templates
          </h2>
          <p className="text-lg text-gray-600">
            Start quickly with pre-built scenarios for common negotiation types
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === cat.value
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="flex flex-col h-full">
              <div className="flex-1">
                <div className="text-4xl mb-4">{template.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">{template.description}</p>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Party A:</span>
                    <p className="text-gray-600">{template.data.partyA.name}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Party B:</span>
                    <p className="text-gray-600">{template.data.partyB.name}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      E: {template.data.esg.environmental}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      S: {template.data.esg.social}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                      G: {template.data.esg.governance}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  className="w-full"
                  onClick={() => handleUseTemplate(template)}
                >
                  Use This Template
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No templates in this category
            </h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </Card>
        )}

        {/* Custom Template CTA */}
        <Card className="mt-8 bg-gradient-to-r from-primary-50 to-blue-50 border-2 border-primary-200">
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Need a Custom Scenario?
            </h3>
            <p className="text-gray-600 mb-6">
              Create your own negotiation from scratch with full customization
            </p>
            <Button size="lg" onClick={() => router.push('/setup')}>
              Create Custom Negotiation
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
