import React, { useState } from 'react';
import { X, MapPin, Clock, Users, User, ExternalLink, ChevronDown, ChevronUp, Calendar, Tag, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event } from './Map';

interface EventDetailProps {
  event: Event | null;
  onClose: () => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, onClose }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  if (!event) return null;

  const getEventIcon = () => {
    switch (event.type) {
      case 'person':
        return <User className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const shortDescription = event.description.slice(0, 100);
  const hasLongDescription = event.description.length > 100;

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
                  'bg-marker-person/20 text-marker-person'}
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
          <div className="mb-4">
            <p className="text-foreground/80 leading-relaxed">
              {showFullDescription ? event.description : shortDescription}
              {hasLongDescription && !showFullDescription && '...'}
            </p>
            {hasLongDescription && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm mt-2 transition-colors"
              >
                {showFullDescription ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show more
                  </>
                )}
              </button>
            )}
          </div>

          {/* Event Details */}
          <div className="space-y-3 mb-6">
            {event.date && (
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-foreground/80">{event.date}</span>
              </div>
            )}
            {event.time && (
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-foreground/80">{event.time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-foreground/80">{event.location}</span>
              </div>
            )}
            {event.price && (
              <div className="flex items-center gap-3 text-sm">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-foreground/80">{event.price}</span>
              </div>
            )}
            {event.attendees && (
              <div className="flex items-center gap-3 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-foreground/80">{event.attendees} people interested</span>
              </div>
            )}
            {event.categories && event.categories.length > 0 && (
              <div className="flex items-start gap-3 text-sm">
                <Tag className="w-4 h-4 text-primary mt-0.5" />
                <div className="flex flex-wrap gap-1">
                  {event.categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-secondary/50 text-foreground/80 rounded-full text-xs border border-white/10"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {event.source && (
              <div className="flex items-center gap-3 text-sm">
                <ExternalLink className="w-4 h-4 text-primary" />
                <a 
                  href={event.source} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors underline"
                >
                  View Source
                </a>
              </div>
            )}
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