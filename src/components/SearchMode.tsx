import React, { useState } from 'react';
import { X, Search, Filter, MapPin, Clock, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Event } from './Map';

interface SearchModeProps {
  isOpen: boolean;
  onClose: () => void;
  onEventSelect: (event: Event) => void;
}

const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Rooftop Jazz Night',
    type: 'event',
    coordinates: [-73.98, 40.75],
    description: 'Live jazz music under the stars with amazing city views',
    source: 'https://t.me/nycjazzevents',
    time: '8:00 PM',
    attendees: 45
  },
  {
    id: '2',
    name: 'Sarah - Coffee Enthusiast',
    type: 'person',
    coordinates: [-73.985, 40.748],
    description: 'Looking for coffee shop recommendations and travel buddies',
    source: 'https://facebook.com/coffeeenthusiasts'
  },
  {
    id: '3',
    name: 'Art Gallery Opening',
    type: 'popular',
    coordinates: [-73.977, 40.752],
    description: 'Exclusive preview of contemporary digital art collection',
    source: 'https://www.eventbrite.com/artgallery',
    time: '7:00 PM',
    attendees: 120
  },
  {
    id: '4',
    name: 'Food Truck Festival',
    type: 'event',
    coordinates: [-73.983, 40.746],
    description: 'Street food from around the world in one location',
    source: 'https://t.me/nycfoodtrucks',
    time: '12:00 PM - 9:00 PM',
    attendees: 200
  },
  {
    id: '5',
    name: 'Mike - Photographer',
    type: 'person',
    coordinates: [-73.979, 40.754],
    description: 'Street photographer looking to collaborate on projects',
    source: 'https://instagram.com/mikephotographer'
  },
  {
    id: '6',
    name: 'Tech Meetup',
    type: 'event',
    coordinates: [-73.987, 40.744],
    description: 'Weekly networking event for developers and entrepreneurs',
    source: 'https://meetup.com/nyctech',
    time: '7:00 PM',
    attendees: 85
  }
];

const SearchMode: React.FC<SearchModeProps> = ({ isOpen, onClose, onEventSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filters = [
    { id: 'event', label: 'Events', color: 'bg-marker-event' },
    { id: 'person', label: 'People', color: 'bg-marker-person' },
    { id: 'popular', label: 'Popular', color: 'bg-marker-popular' },
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

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilters.length === 0 || selectedFilters.includes(event.type);
    return matchesSearch && matchesFilter;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'person':
        return <User className="w-4 h-4" />;
      case 'popular':
        return <Users className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-xl">
            <Search className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Search Events</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="p-4 space-y-4 border-b border-white/10">
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
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div
                key={event.id}
                onClick={() => {
                  onEventSelect(event);
                  onClose();
                }}
                className="bg-gradient-glass backdrop-blur-md rounded-2xl p-4 border border-white/10 cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    p-2 rounded-xl flex-shrink-0
                    ${event.type === 'event' ? 'bg-marker-event/20 text-marker-event' : 
                      event.type === 'person' ? 'bg-marker-person/20 text-marker-person' : 
                      'bg-marker-popular/20 text-marker-popular'}
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
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{event.coordinates[1].toFixed(3)}, {event.coordinates[0].toFixed(3)}</span>
                      </div>
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
      </div>
    </div>
  );
};

export default SearchMode;