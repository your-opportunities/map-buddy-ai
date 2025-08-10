import React, { useState } from 'react';
import Map, { Event } from '@/components/Map';
import EventDetail from '@/components/EventDetail';
import AIAssistant from '@/components/AIAssistant';

const Index = () => {
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

  const handleEventHighlight = (eventIds: string[]) => {
    setHighlightedEvents(eventIds);
    // Clear highlights after 5 seconds
    setTimeout(() => {
      setHighlightedEvents([]);
    }, 5000);
  };

  return (
    <div className="h-screen w-full bg-background overflow-hidden">
      {/* Main Map View */}
      <Map 
        onEventSelect={handleEventSelect}
        highlightedEvents={highlightedEvents}
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
