import { SimulationRequest } from '@/types/negotiation';

export interface NegotiationTemplate {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'environmental' | 'social' | 'technology' | 'government';
  icon: string;
  data: SimulationRequest;
}

export const templates: NegotiationTemplate[] = [
  {
    id: 'tech-expansion',
    name: 'Tech Company Expansion',
    description: 'Data center expansion vs environmental protection',
    category: 'technology',
    icon: '💻',
    data: {
      partyA: {
        name: 'TechGlobal Inc.',
        goals: 'Build a new data center to support 50% business growth over next 2 years. Maximize operational efficiency and minimize construction costs.',
        constraints: 'Budget limited to $15 million. Must complete within 18 months. Need to maintain 99.9% uptime SLA.',
      },
      partyB: {
        name: 'Green Future Alliance',
        goals: 'Ensure the data center uses 100% renewable energy and has zero carbon emissions. Protect local wildlife habitats.',
        constraints: 'Cannot accept carbon offset programs as a substitute for real emissions reduction. Water usage must not exceed regional sustainability limits.',
      },
      esg: {
        environmental: 85,
        social: 50,
        governance: 65,
      },
    },
  },
  {
    id: 'manufacturing-community',
    name: 'Manufacturing & Community',
    description: 'Factory expansion with community concerns',
    category: 'business',
    icon: '🏭',
    data: {
      partyA: {
        name: 'Industrial Manufacturing Corp',
        goals: 'Increase production capacity by 30% to meet rising demand. Minimize disruption to current operations.',
        constraints: 'Maximum expansion budget of $5 million. Cannot relocate facility. Need to maintain competitive pricing.',
      },
      partyB: {
        name: 'Riverside Community Board',
        goals: 'Prevent increase in noise pollution, air quality degradation, and traffic congestion. Preserve quality of life for 5,000 residents.',
        constraints: 'Noise levels cannot exceed current EPA standards. No expansion into the adjacent park area. Working hours restricted to 7 AM - 7 PM.',
      },
      esg: {
        environmental: 70,
        social: 90,
        governance: 60,
      },
    },
  },
  {
    id: 'supply-chain',
    name: 'Sustainable Supply Chain',
    description: 'Retail chain negotiating with sustainable textile supplier',
    category: 'business',
    icon: '🛍️',
    data: {
      partyA: {
        name: 'Global Retail Chain',
        goals: 'Secure 20% cost reduction on textile supplies while maintaining quality. Improve supply chain reliability and reduce lead times.',
        constraints: 'Cannot compromise on product quality standards. Need flexible order quantities. Payment terms must remain at 60 days.',
      },
      partyB: {
        name: 'Sustainable Textiles Ltd',
        goals: 'Maintain fair wages for workers, use only organic materials, achieve B-Corp certification. Grow business by 15%.',
        constraints: 'Cannot reduce worker wages below living wage standards. Organic certification requirements are non-negotiable. Minimum order quantities of 10,000 units.',
      },
      esg: {
        environmental: 75,
        social: 80,
        governance: 70,
      },
    },
  },
  {
    id: 'renewable-energy',
    name: 'Solar Farm Development',
    description: 'Renewable energy project on agricultural land',
    category: 'environmental',
    icon: '☀️',
    data: {
      partyA: {
        name: 'SolarWind Energy Co',
        goals: 'Install 50MW solar farm to supply clean energy to 15,000 homes. Achieve project profitability within 7 years through government incentives and energy sales.',
        constraints: 'Land lease budget $200,000/year. Grid connection costs capped at $2 million. Needs regulatory approval within 12 months.',
      },
      partyB: {
        name: 'Agricultural Landowners Association',
        goals: 'Maintain agricultural productivity, protect farmland value, ensure fair compensation. Allow continued farming activities where possible.',
        constraints: 'Cannot remove more than 40% of arable land from production. Solar panels must allow for dual-use (agrivoltaics). Lease payments must match or exceed agricultural income.',
      },
      esg: {
        environmental: 95,
        social: 70,
        governance: 80,
      },
    },
  },
  {
    id: 'real-estate',
    name: 'Historic Preservation',
    description: 'Urban development respecting historic district',
    category: 'social',
    icon: '🏛️',
    data: {
      partyA: {
        name: 'Urban Developers LLC',
        goals: 'Develop mixed-use building with 200 residential units and commercial space. Achieve 18% ROI within 5 years.',
        constraints: 'Site acquisition cost already $8 million. Zoning allows maximum 12 floors. Must break ground within 6 months.',
      },
      partyB: {
        name: 'Historic Preservation Society',
        goals: 'Preserve the architectural character of historic downtown district. Maintain cultural heritage and community identity.',
        constraints: 'Building facade of existing 1920s structure must be preserved. Height cannot exceed neighboring historic buildings. Modern materials must complement historic aesthetics.',
      },
      esg: {
        environmental: 60,
        social: 85,
        governance: 75,
      },
    },
  },
  {
    id: 'corporate-merger',
    name: 'Corporate Acquisition',
    description: 'Tech startup acquisition by enterprise company',
    category: 'business',
    icon: '🤝',
    data: {
      partyA: {
        name: 'Innovate AI (Startup)',
        goals: 'Secure acquisition deal that values company at $50 million. Retain key team members for 3 years. Maintain product autonomy.',
        constraints: 'Founders must retain advisory roles. Employee stock options must be honored. Cannot relocate team from current city.',
      },
      partyB: {
        name: 'Enterprise Corp Solutions',
        goals: 'Acquire innovative AI technology and talent. Achieve synergies within 18 months. Integrate products into existing platform.',
        constraints: 'Maximum acquisition budget $40 million. Need full IP transfer. Integration must complete within 2 years.',
      },
      esg: {
        environmental: 40,
        social: 75,
        governance: 85,
      },
    },
  },
];

export const getTemplateById = (id: string): NegotiationTemplate | undefined => {
  return templates.find((t) => t.id === id);
};

export const getTemplatesByCategory = (category: string): NegotiationTemplate[] => {
  return templates.filter((t) => t.category === category);
};

export const categories = [
  { value: 'all', label: 'All Categories', icon: '📋' },
  { value: 'business', label: 'Business', icon: '💼' },
  { value: 'environmental', label: 'Environmental', icon: '🌍' },
  { value: 'social', label: 'Social', icon: '👥' },
  { value: 'technology', label: 'Technology', icon: '💻' },
  { value: 'government', label: 'Government', icon: '🏛️' },
];
