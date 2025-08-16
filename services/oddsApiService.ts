import { ODDS_API_URL } from '../constants';
import type { Sport, GameOdds, GameEvent } from '../types';

// A helper to make API calls with query parameters.
async function fetchFromApi<T,>(endpoint: string, apiKey: string, options: { params?: Record<string, string> } = {}): Promise<T> {
  if (!apiKey) {
    throw new Error("API-sleutel is niet opgegeven.");
  }
  
  const url = new URL(`${ODDS_API_URL}${endpoint}`);
  
  url.searchParams.append('apiKey', apiKey);

  if (options.params) {
    for (const key in options.params) {
      url.searchParams.append(key, options.params[key]);
    }
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    // Try to parse error message from API, otherwise use status text.
    const errorData = await response.json().catch(() => ({ message: `Request mislukt met status: ${response.status} ${response.statusText}` }));
    throw new Error(errorData.message || `Er is een onbekende API-fout opgetreden.`);
  }
  return response.json();
}

export const getSports = async (apiKey: string): Promise<Sport[]> => {
  return await fetchFromApi<Sport[]>('/sports', apiKey);
};

export const getEvents = async (sportKey: string, apiKey: string): Promise<GameEvent[]> => {
  return await fetchFromApi<GameEvent[]>(`/sports/${sportKey}/events`, apiKey);
};

export const getOdds = async (sportKey: string, apiKey: string, eventIds?: string[], regions: string = 'eu,uk'): Promise<GameOdds[]> => {
  const params: Record<string, string> = {
      regions: regions,
      markets: 'h2h',
  };

  if (eventIds && eventIds.length > 0) {
    params.eventIds = eventIds.join(',');
  }
  
  return await fetchFromApi<GameOdds[]>(`/sports/${sportKey}/odds`, apiKey, { params });
};