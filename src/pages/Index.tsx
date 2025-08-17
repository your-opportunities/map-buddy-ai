import React, { useState, useEffect } from 'react';
import { Bot, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Map, { Event } from '@/components/Map';
import EventDetail from '@/components/EventDetail';
import AIAssistant from '@/components/AIAssistant';
import SearchMode from '@/components/SearchMode';
import TokenInput from '@/components/TokenInput';
import ViewModeSelector from '@/components/ViewModeSelector';
import ListView from '@/components/ListView';
import LoadingScreen from '@/components/LoadingScreen';
import { getEventById } from '@/lib/events';

const Index = () => {
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isTokenLoaded, setIsTokenLoaded] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [highlightedEvents, setHighlightedEvents] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'map' | 'list' | null>(null);
  const [hasShownSelector, setHasShownSelector] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  // Load token and view mode from localStorage on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('mapboxToken');
    const savedViewMode = localStorage.getItem('viewMode') as 'map' | 'list' | null;
    const hasSeenLoading = localStorage.getItem('hasSeenLoading');
    
    if (savedToken) {
      setMapboxToken(savedToken);
    }
    
    if (savedViewMode) {
      setViewMode(savedViewMode);
      setHasShownSelector(true);
    }
    
    // Skip loading screen if user has seen it before
    if (hasSeenLoading) {
      setShowLoadingScreen(false);
    }
    
    setIsTokenLoaded(true);
  }, []);

  const handleLoadingComplete = () => {
    setShowLoadingScreen(false);
    localStorage.setItem('hasSeenLoading', 'true');
  };



  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseEventDetail = () => {
    setSelectedEvent(null);
  };

  const handleToggleAssistant = () => {
    setIsAssistantOpen(!isAssistantOpen);
  };

  const handleToggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleTokenSubmit = (token: string) => {
    setMapboxToken(token);
    // Save token to localStorage for persistence
    localStorage.setItem('mapboxToken', token);
  };

  const handleEventHighlight = (eventIds: string[]) => {
    setHighlightedEvents(eventIds);
    // Clear highlights after 8 seconds to give users more time to see the blinking effect
    setTimeout(() => {
      setHighlightedEvents([]);
    }, 8000);
  };

  const handleEventClickFromAI = (eventId: string) => {
    const event = getEventById(eventId);
    if (event) {
      setSelectedEvent(event);
    }
  };

  const handleViewModeSelect = (mode: 'map' | 'list') => {
    setViewMode(mode);
    setHasShownSelector(true);
    localStorage.setItem('viewMode', mode);
  };

  const handleSwitchToMap = () => {
    setViewMode('map');
    localStorage.setItem('viewMode', 'map');
  };

  const handleReturnToHome = () => {
    setViewMode(null);
    setHasShownSelector(false);
    localStorage.removeItem('viewMode');
  };

  // Show loading screen on first visit
  if (showLoadingScreen) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  // Show token input if no token is provided and token loading is complete
  if (!mapboxToken && isTokenLoaded) {
    return <TokenInput onTokenSubmit={handleTokenSubmit} />;
  }

  // Show loading state while checking for saved token
  if (!isTokenLoaded) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <div className="bg-gradient-glass backdrop-blur-md rounded-2xl p-8 text-center border border-white/10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show view mode selector if user hasn't chosen a mode yet
  if (!hasShownSelector) {
    return <ViewModeSelector onSelectMode={handleViewModeSelect} onOpenProfile={() => {}} />;
  }

  // Show list view if user selected list mode
  if (viewMode === 'list') {
    return (
      <>
        <ListView 
          onEventSelect={handleEventSelect}
          onSwitchToMap={handleSwitchToMap}
          onReturnToHome={handleReturnToHome}
        />
        <EventDetail 
          event={selectedEvent}
          onClose={handleCloseEventDetail}
        />
      </>
    );
  }

  // Show map view (default)
  return (
    <div className="h-screen w-full bg-background overflow-hidden relative">
      {/* Main Map View */}
      <Map 
        onEventSelect={handleEventSelect}
        highlightedEvents={highlightedEvents}
        mapboxToken={mapboxToken}
        onReturnToHome={handleReturnToHome}
      />

      {/* Floating Action Buttons - hide when AI assistant is expanded */}
      {!isAssistantExpanded && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          <Button
            onClick={handleToggleSearch}
            className="bg-gradient-secondary hover:bg-gradient-secondary/90 text-primary-foreground rounded-full p-4 shadow-glow"
          >
            <Search className="w-6 h-6" />
          </Button>
          <Button
            onClick={handleToggleAssistant}
            className="bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground rounded-full p-4 shadow-glow"
          >
            <Bot className="w-6 h-6" />
          </Button>
        </div>
      )}

      {/* Event Detail Modal */}
      <EventDetail 
        event={selectedEvent}
        onClose={handleCloseEventDetail}
      />

      {/* Search Mode */}
      <SearchMode
        isOpen={isSearchOpen}
        onClose={handleToggleSearch}
        onEventSelect={handleEventSelect}
      />

      {/* AI Assistant */}
      <AIAssistant 
        isOpen={isAssistantOpen}
        onToggle={handleToggleAssistant}
        onEventHighlight={handleEventHighlight}
        onExpandedChange={setIsAssistantExpanded}
        onEventClick={handleEventClickFromAI}
      />


    </div>
  );
};

export default Index;
