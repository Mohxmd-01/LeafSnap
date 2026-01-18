import { getToken } from '@/utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface PredictionResponse {
  disease: string;
  confidence: number;
}

export interface PredictionHistoryItem {
  id: number;
  imageName: string;
  disease: string;
  confidence: number;
  createdAt: string;
}

export async function predictDisease(file: File): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Prediction failed: ${response.statusText}`);
  }

  return response.json();
}

export async function getPredictionHistory(): Promise<PredictionHistoryItem[]> {
  const response = await fetch(`${API_BASE_URL}/predictions`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch history: ${response.statusText}`);
  }

  return response.json();
}
