import { SimulationRequest, SimulationResponse } from '@/types/negotiation';

export interface NegotiationHistory {
  id: string;
  timestamp: number;
  request: SimulationRequest;
  response: SimulationResponse;
  name?: string;
  tags?: string[];
}

const STORAGE_KEY = 'negotiation_history';
const MAX_HISTORY_ITEMS = 50;

export const historyService = {
  // Save a new negotiation to history
  save: (
    request: SimulationRequest,
    response: SimulationResponse,
    name?: string
  ): NegotiationHistory => {
    const history = historyService.getAll();
    const newItem: NegotiationHistory = {
      id: `neg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      request,
      response,
      name: name || `${request.partyA.name} vs ${request.partyB.name}`,
      tags: [],
    };

    history.unshift(newItem);

    // Keep only the most recent items
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
    return newItem;
  },

  // Get all history items
  getAll: (): NegotiationHistory[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  },

  // Get a single item by ID
  getById: (id: string): NegotiationHistory | null => {
    const history = historyService.getAll();
    return history.find((item) => item.id === id) || null;
  },

  // Delete an item
  delete: (id: string): void => {
    const history = historyService.getAll();
    const filtered = history.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  // Update an item
  update: (id: string, updates: Partial<NegotiationHistory>): void => {
    const history = historyService.getAll();
    const index = history.findIndex((item) => item.id === id);
    
    if (index !== -1) {
      history[index] = { ...history[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  },

  // Clear all history
  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Search history
  search: (query: string): NegotiationHistory[] => {
    const history = historyService.getAll();
    const lowerQuery = query.toLowerCase();

    return history.filter(
      (item) =>
        item.name?.toLowerCase().includes(lowerQuery) ||
        item.request.partyA.name.toLowerCase().includes(lowerQuery) ||
        item.request.partyB.name.toLowerCase().includes(lowerQuery) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  },

  // Get statistics
  getStats: () => {
    const history = historyService.getAll();
    
    const avgScores = history.reduce(
      (acc, item) => ({
        economic: acc.economic + item.response.scores.economic,
        social: acc.social + item.response.scores.social,
        environmental: acc.environmental + item.response.scores.environmental,
      }),
      { economic: 0, social: 0, environmental: 0 }
    );

    const count = history.length;
    
    return {
      total: count,
      averages: count > 0 ? {
        economic: Math.round(avgScores.economic / count),
        social: Math.round(avgScores.social / count),
        environmental: Math.round(avgScores.environmental / count),
      } : { economic: 0, social: 0, environmental: 0 },
      mostRecent: history[0] || null,
      oldest: history[history.length - 1] || null,
    };
  },
};
