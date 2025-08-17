import React, { useState } from 'react';
import { Search, Filter, MapPin, Clock, Users, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from '@/components/Map';
import { mockEvents } from '@/lib/events';

interface ListViewProps {
  onEventSelect: (event: Event) => void;
  onSwitchToMap: () => void;
  onReturnToHome: () => void;
}

const ListView: React.FC<ListViewProps> = ({ onEventSelect, onSwitchToMap, onReturnToHome }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const filters = [
    { id: 'event', label: 'Events', color: 'bg-marker-event' },
    { id: 'person', label: 'People', color: 'bg-marker-person' },
    { id: 'today', label: 'Today', color: 'bg-yellow-500' },
    { id: 'free', label: 'Free', color: 'bg-green-500' },
    { id: 'paid', label: 'Paid', color: 'bg-blue-500' },
    { id: 'music', label: 'Music', color: 'bg-purple-500' },
    { id: 'food', label: 'Food', color: 'bg-orange-500' },
    { id: 'tech', label: 'Tech', color: 'bg-cyan-500' },
    { id: 'art', label: 'Art', color: 'bg-pink-500' },
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  // Filter events based on selected date
  const getFilteredEvents = () => {
    if (!selectedDate) return mockEvents;
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const thisWeekend = new Date(today);
    const daysUntilWeekend = 6 - today.getDay(); // Saturday is 6
    thisWeekend.setDate(today.getDate() + daysUntilWeekend);
    
    return mockEvents.filter(event => {
      if (!event.date) return true; // Show events without dates
      
      const eventDate = event.date.toLowerCase();
      
      // Check if event is for today
      if (eventDate === 'today' || eventDate === 'daily') {
        return true;
      }
      
      // Check if event is for tomorrow
      if (eventDate === 'tomorrow') {
        return selectedDate.toDateString() === tomorrow.toDateString();
      }
      
      // Check if event is for this weekend
      if (eventDate === 'this weekend' || eventDate === 'friday & saturday') {
        const selectedDay = selectedDate.getDay();
        return selectedDay === 5 || selectedDay === 6; // Friday or Saturday
      }
      
      // Check for specific days of the week
      if (eventDate.includes('wednesday')) {
        return selectedDate.getDay() === 3; // Wednesday
      }
      if (eventDate.includes('thursday')) {
        return selectedDate.getDay() === 4; // Thursday
      }
      if (eventDate.includes('friday')) {
        return selectedDate.getDay() === 5; // Friday
      }
      if (eventDate.includes('saturday')) {
        return selectedDate.getDay() === 6; // Saturday
      }
      
      // For events that happen every week on specific days
      if (eventDate.includes('every')) {
        const dayMatch = eventDate.match(/every\s+(\w+)/i);
        if (dayMatch) {
          const dayName = dayMatch[1].toLowerCase();
          const dayMap: { [key: string]: number } = {
            'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
            'friday': 5, 'saturday': 6, 'sunday': 0
          };
          return selectedDate.getDay() === dayMap[dayName];
        }
      }
      
      return true; // Show events that don't match specific patterns
    });
  };

  const filteredEvents = getFilteredEvents().filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilters.length === 0 || selectedFilters.includes(event.type);
    return matchesSearch && matchesFilter;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'person':
        return <User className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-screen w-full bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-glass backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-xl">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Events & People</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSwitchToMap}
            className="border-white/20 text-foreground hover:bg-white/10"
          >
            Switch to Map
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onReturnToHome}
            className="border-white/20 text-foreground hover:bg-white/10"
          >
            Return to Home
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 space-y-4 border-b border-white/10 bg-gradient-glass backdrop-blur-md">
        <div className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, people, or places..."
            className="flex-1 bg-secondary/50 border-white/20 text-foreground"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="border-white/20 text-foreground hover:bg-white/10"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Date Picker */}
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-foreground hover:bg-white/10"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Filter Tags */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 animate-fade-in">
            {filters.map(filter => (
              <Badge
                key={filter.id}
                variant={selectedFilters.includes(filter.id) ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  selectedFilters.includes(filter.id)
                    ? `${filter.color} text-white border-transparent`
                    : 'border-white/20 text-foreground hover:bg-white/10'
                }`}
                onClick={() => toggleFilter(filter.id)}
              >
                <div className={`w-2 h-2 rounded-full mr-2 ${filter.color}`}></div>
                {filter.label}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div
              key={event.id}
              onClick={() => onEventSelect(event)}
              className="bg-gradient-glass backdrop-blur-md rounded-2xl p-4 border border-white/10 cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-start gap-3">
                <div className={`
                  p-2 rounded-xl flex-shrink-0
                  ${event.type === 'event' ? 'bg-marker-event/20 text-marker-event' : 
                    'bg-marker-person/20 text-marker-person'}
                `}>
                  {getEventIcon(event.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground truncate">{event.name}</h3>
                    <Badge 
                      variant="outline"
                      className="ml-2 border-white/20 text-xs capitalize"
                    >
                      {event.type}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {event.date && (
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        <span>{event.date}</span>
                      </div>
                    )}
                    {event.time && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    {event.attendees && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{event.attendees}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Floating AI Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          className="bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground rounded-full p-4 shadow-glow"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default ListView;
