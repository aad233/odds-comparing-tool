import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { OddsDisplay } from './components/OddsDisplay';
import { ApiKeyInput } from './components/ApiKeyInput';
import { MatchList } from './components/MatchList';
import { getSports, getEvents, getOdds } from './services/oddsApiService';
import type { Sport, GameEvent, GameOdds } from './types';
import { ErrorMessage } from './components/ErrorMessage';

type View = 'matches' | 'odds';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem('odds_api_key'));
  const [isKeyValidating, setIsKeyValidating] = useState<boolean>(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  
  const [sports, setSports] = useState<Sport[]>([]);
  const [matches, setMatches] = useState<GameEvent[]>([]);
  const [odds, setOdds] = useState<GameOdds[]>([]);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedMatchIds, setSelectedMatchIds] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string>('eu,uk');
  const [view, setView] = useState<View>('matches');

  const [loadingSports, setLoadingSports] = useState<boolean>(true);
  const [loadingMatches, setLoadingMatches] = useState<boolean>(false);
  const [loadingOdds, setLoadingOdds] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiKeySubmit = async (newKey: string) => {
    setIsKeyValidating(true);
    setApiKeyError(null);
    try {
      // Validate key by making a test API call
      await getSports(newKey);
      localStorage.setItem('odds_api_key', newKey);
      setApiKey(newKey);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Onbekende validatiefout.';
      setApiKeyError(`De opgegeven API-sleutel is ongeldig. De API meldt: "${message}"`);
      localStorage.removeItem('odds_api_key');
      setApiKey(null);
    } finally {
      setIsKeyValidating(false);
    }
  };

  const handleResetApiKey = () => {
    localStorage.removeItem('odds_api_key');
    setApiKey(null);
    setSports([]);
    setMatches([]);
    setOdds([]);
    setSelectedSport(null);
    setSelectedMatchIds([]);
    setView('matches');
    setError(null);
    setApiKeyError(null);
  };

  useEffect(() => {
    const fetchSports = async () => {
      if (!apiKey) return;
      try {
        setError(null);
        setLoadingSports(true);
        const sportsData = await getSports(apiKey);
        const soccerLeagues = sportsData.filter(sport => sport.group === 'Soccer' && sport.active);
        setSports(soccerLeagues);
        
        if (soccerLeagues.length > 0) {
            const premierLeague = soccerLeagues.find(s => s.key === 'soccer_epl');
            const initialSport = premierLeague ? premierLeague.key : soccerLeagues[0].key;
            await handleSelectSport(initialSport, true);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Er is een onbekende fout opgetreden.';
        setError(`Laden van sportgegevens mislukt. ${message}`);
        console.error(err);
      } finally {
        setLoadingSports(false);
      }
    };

    fetchSports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  const handleSelectSport = useCallback(async (sportKey: string, isInitialLoad = false) => {
    if (!apiKey) return;
    // Prevent re-fetching if it's not the initial load and the key hasn't changed
    if (!isInitialLoad && selectedSport === sportKey) return;

    setSelectedSport(sportKey);
    setView('matches');
    setLoadingMatches(true);
    setError(null);
    setMatches([]);
    setSelectedMatchIds([]);
    setOdds([]);

    try {
      const eventsData = await getEvents(sportKey, apiKey);
      setMatches(eventsData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Er is een onbekende fout opgetreden.';
      setError(`Laden van wedstrijden voor ${sportKey} mislukt. ${message}`);
      console.error(err);
    } finally {
      setLoadingMatches(false);
    }
  }, [selectedSport, apiKey]);

  const handleToggleMatch = (matchId: string) => {
    setSelectedMatchIds(prev =>
      prev.includes(matchId)
        ? prev.filter(id => id !== matchId)
        : [...prev, matchId]
    );
  };

  const handleCompareOdds = async () => {
    if (!apiKey || !selectedSport || selectedMatchIds.length === 0) return;

    setView('odds');
    setLoadingOdds(true);
    setError(null);
    setOdds([]);

    try {
      const oddsData = await getOdds(selectedSport, apiKey, selectedMatchIds, selectedRegions);
      setOdds(oddsData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Er is een onbekende fout opgetreden.';
      setError(`Laden van odds voor geselecteerde wedstrijden mislukt. ${message}`);
      console.error(err);
    } finally {
      setLoadingOdds(false);
    }
  };
  
  if (!apiKey) {
    return (
      <ApiKeyInput 
        onSubmit={handleApiKeySubmit}
        error={apiKeyError}
        isLoading={isKeyValidating}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-brand-bg">
      <Header onResetApiKey={handleResetApiKey} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {view === 'matches' && !error && (
          <MatchList 
            sports={sports}
            selectedSport={selectedSport}
            onSelectSport={handleSelectSport}
            isLoadingSports={loadingSports}
            matches={matches}
            selectedMatchIds={selectedMatchIds}
            onToggleMatch={handleToggleMatch}
            onCompareOdds={handleCompareOdds}
            isLoadingMatches={loadingMatches}
            selectedRegions={selectedRegions}
            onRegionsChange={setSelectedRegions}
          />
        )}
        {view === 'odds' && (
          <OddsDisplay 
            odds={odds} 
            isLoading={loadingOdds} 
            error={error}
            onBack={() => setView('matches')}
          />
        )}
        {error && view !== 'odds' && <ErrorMessage message={error} />}
      </main>
    </div>
  );
};

export default App;