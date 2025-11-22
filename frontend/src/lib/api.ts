import axios from 'axios';
import { SimulationRequest, SimulationResponse } from '@/types/negotiation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds for AI processing
});

export const negotiationApi = {
  simulate: async (data: SimulationRequest): Promise<SimulationResponse> => {
    const response = await apiClient.post<SimulationResponse>('/simulate', data);
    return response.data;
  },
};
