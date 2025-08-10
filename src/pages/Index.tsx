import React, { useState } from 'react';
import Map, { Event } from '@/components/Map';
import EventDetail from '@/components/EventDetail';
import AIAssistant from '@/components/AIAssistant';
import TokenInput from '@/components/TokenInput';

const Index = () => {
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
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
    <div className="h-screen w-full bg-background overflow-hidden">
      {/* Main Map View */}
      <Map 
        onEventSelect={handleEventSelect}
        highlightedEvents={highlightedEvents}
        mapboxToken={mapboxToken}
      />

      {/* Event Detail Modal */}
      <EventDetail 
        event={selectedEvent}
        onClose={handleCloseEventDetail}
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
