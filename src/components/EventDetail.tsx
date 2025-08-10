import React from 'react';
import { X, MapPin, Clock, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event } from './Map';

interface EventDetailProps {
  event: Event | null;
  onClose: () => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, onClose }) => {
  if (!event) return null;

  const getEventIcon = () => {
    switch (event.type) {
      case 'person':
        return <User className="w-5 h-5" />;
      case 'popular':
        return <Users className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in">
      <div className="absolute inset-0 bg-background/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md mx-4 mb-4 bg-gradient-glass backdrop-blur-md rounded-2xl shadow-glass border border-white/10 animate-slide-up">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className={`
                p-2 rounded-xl
                ${event.type === 'event' ? 'bg-marker-event/20 text-marker-event' : 
                  event.type === 'person' ? 'bg-marker-person/20 text-marker-person' : 
                  'bg-marker-popular/20 text-marker-popular'}
              `}>
                {getEventIcon()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{event.name}</h2>
                <p className="text-sm text-muted-foreground capitalize">{event.type}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Description */}
          <p className="text-foreground/80 mb-4 leading-relaxed">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="space-y-3 mb-6">
            {event.time && (
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-foreground/80">{event.time}</span>
              </div>
            )}
            {event.attendees && (
              <div className="flex items-center gap-3 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-foreground/80">{event.attendees} people interested</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-foreground/80">
                {event.coordinates[1].toFixed(3)}, {event.coordinates[0].toFixed(3)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              className="flex-1 bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground"
            >
              {event.type === 'person' ? 'Connect' : 'Join Event'}
            </Button>
            <Button 
              variant="outline" 
              className="border-white/20 text-foreground hover:bg-white/10"
            >
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;