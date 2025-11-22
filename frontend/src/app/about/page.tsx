'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What is Sustainable Negotiation AI?',
    answer:
      'Sustainable Negotiation AI is an AI-powered platform that helps organizations reach fair, balanced, and environmentally responsible agreements. It analyzes goals, constraints, and ESG priorities to generate optimized compromise proposals.',
  },
  {
    question: 'How does the AI generate compromises?',
    answer:
      'We use OpenAI GPT-4o-mini model with specialized prompts designed for negotiation analysis. The AI considers party goals, constraints, and ESG priorities to generate three types of compromises: economic-optimized, social-optimized, and balanced sustainable.',
  },
  {
    question: 'What are ESG priorities?',
    answer:
      'ESG stands for Environmental, Social, and Governance factors. These are sustainability metrics that help evaluate the ethical impact and sustainability practices of a negotiation. You can adjust each factor from 0-100 to influence how the AI weighs different considerations.',
  },
  {
    question: 'How accurate are the AI-generated compromises?',
    answer:
      'The AI provides suggestions based on the input data and trained patterns. While the suggestions are contextually relevant and thoughtful, they should be viewed as starting points for negotiation rather than final solutions. Always review and adapt recommendations to your specific situation.',
  },
  {
    question: 'Is my negotiation data stored?',
    answer:
      'Your negotiation history is stored locally in your browser using localStorage. Data is not sent to any external servers except for the AI API call during simulation. You can clear your history at any time from the History page.',
  },
  {
    question: 'Can I export my results?',
    answer:
      'Yes! From the results page, you can export your negotiation outcomes in multiple formats including PDF, JSON, and shareable links (coming soon in future updates).',
  },
  {
    question: 'What makes a "good" compromise?',
    answer:
      'A good compromise balances the needs of all parties while considering sustainability factors. The platform provides three perspectives (economic, social, balanced) to help you understand different approaches. The best compromise depends on your specific priorities and context.',
  },
  {
    question: 'Can I customize the AI prompts?',
    answer:
      'The current prototype uses pre-configured prompts optimized for sustainable negotiations. Advanced customization options for prompt engineering and AI model selection are planned for future versions.',
  },
  {
    question: 'How do I interpret the impact scores?',
    answer:
      'Impact scores (0-100) represent the estimated strength of outcomes in each dimension: Economic (financial efficiency), Social (fairness and social impact), and Environmental (sustainability). Higher scores indicate better performance in that dimension.',
  },
  {
    question: 'Is this suitable for real negotiations?',
    answer:
      'This is a prototype tool designed to demonstrate AI-powered negotiation support. While it provides valuable insights, it should complement—not replace—human judgment, legal counsel, and domain expertise in real-world negotiations.',
  },
];

export default function AboutPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* About Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            About Sustainable Negotiation AI
          </h2>
          
          <Card className="mb-8">
            <div className="prose prose-lg max-w-none">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
              <p className="text-gray-700 mb-4">
                To democratize access to AI-powered negotiation tools that promote sustainable,
                fair, and balanced outcomes for all parties involved in complex agreements.
              </p>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-8">How It Works</h3>
              <p className="text-gray-700 mb-4">
                Our platform leverages advanced AI to analyze negotiation scenarios through
                multiple lenses:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>
                  <strong>Economic Analysis:</strong> Focuses on financial efficiency, cost
                  reduction, and ROI maximization
                </li>
                <li>
                  <strong>Social Analysis:</strong> Emphasizes fairness, equity, worker welfare,
                  and community benefit
                </li>
                <li>
                  <strong>Balanced Sustainability:</strong> Harmonizes economic, social, and
                  environmental factors (ESG)
                </li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-8">Key Features</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-primary-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">🤖</div>
                  <h4 className="font-semibold text-gray-800 mb-1">AI-Powered</h4>
                  <p className="text-sm text-gray-600">
                    Uses GPT-4o-mini for intelligent compromise generation
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">📊</div>
                  <h4 className="font-semibold text-gray-800 mb-1">Data-Driven</h4>
                  <p className="text-sm text-gray-600">
                    Visual analytics and historical tracking
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">🌱</div>
                  <h4 className="font-semibold text-gray-800 mb-1">ESG-Focused</h4>
                  <p className="text-sm text-gray-600">
                    Built-in sustainability considerations
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">⚡</div>
                  <h4 className="font-semibold text-gray-800 mb-1">Fast & Easy</h4>
                  <p className="text-sm text-gray-600">
                    Get results in seconds with intuitive interface
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-8">Technology Stack</h3>
              <p className="text-gray-700 mb-4">
                Built with modern, industry-standard technologies:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                <li>Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS</li>
                <li>Backend: NestJS, Node.js, TypeScript</li>
                <li>AI: OpenAI GPT-4o-mini API</li>
                <li>Visualization: Chart.js, React-Chartjs-2</li>
              </ul>
            </div>
          </Card>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="cursor-pointer" onClick={() => toggleFAQ(index)}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {faq.question}
                    </h3>
                    {openFAQ === index && (
                      <p className="text-gray-600 mt-2">{faq.answer}</p>
                    )}
                  </div>
                  <button className="ml-4 text-2xl text-primary-600 flex-shrink-0">
                    {openFAQ === index ? '−' : '+'}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact/Feedback Section */}
        <Card className="mt-12 bg-gradient-to-r from-primary-50 to-blue-50 border-2 border-primary-200">
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Have More Questions?
            </h3>
            <p className="text-gray-600 mb-6">
              This is a prototype demo. For production use or custom implementations, reach out to
              discuss your needs.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => window.open('https://github.com', '_blank')}>
                View on GitHub
              </Button>
              <Button onClick={() => window.location.href = 'mailto:contact@example.com'}>
                Contact Us
              </Button>
            </div>
          </div>
        </Card>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            ⚠️ <strong>Prototype Disclaimer:</strong> This is a demonstration project and not
            intended for production use without proper security, testing, and compliance measures.
          </p>
        </div>
      </main>
    </div>
  );
}
