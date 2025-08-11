import React, { useState } from 'react';
import { Bot, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Map, { Event } from '@/components/Map';
import EventDetail from '@/components/EventDetail';
import AIAssistant from '@/components/AIAssistant';
import SearchMode from '@/components/SearchMode';
import TokenInput from '@/components/TokenInput';

const Index = () => {
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [highlightedEvents, setHighlightedEvents] = useState<string[]>([]);

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
  };

  const handleEventHighlight = (eventIds: string[]) => {
    setHighlightedEvents(eventIds);
    // Clear highlights after 5 seconds
    setTimeout(() => {
      setHighlightedEvents([]);
    }, 5000);
  };

  // Show token input if no token is provided
  if (!mapboxToken) {
    return <TokenInput onTokenSubmit={handleTokenSubmit} />;
  }

  return (
    <div className="h-screen w-full bg-background overflow-hidden relative">
      {/* Main Map View */}
      <Map 
        onEventSelect={handleEventSelect}
        highlightedEvents={highlightedEvents}
        mapboxToken={mapboxToken}
      />

      {/* Floating Action Buttons */}
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
      />
    </div>
  );
};

export default Index;
