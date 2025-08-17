import React from 'react';
import { MapPin, List, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewModeSelectorProps {
  onSelectMode: (mode: 'map' | 'list') => void;
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({ onSelectMode }) => {
  return (
    <div className="h-screen w-full bg-background flex items-center justify-center animate-fade-in">
      <div className="bg-gradient-glass backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-glass max-w-md w-full mx-4 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Map Buddy AI</h1>
          <p className="text-muted-foreground">Choose how you'd like to explore events and people nearby</p>
        </div>

        {/* View Options */}
        <div className="space-y-4 mb-8">
          {/* Map View Option */}
          <button
            onClick={() => onSelectMode('map')}
            className="w-full p-6 bg-gradient-glass backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-primary rounded-xl group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-foreground mb-1">Map View</h3>
                <p className="text-sm text-muted-foreground">
                  Explore events visually on an interactive map. Perfect for discovering what's happening around you.
                </p>
              </div>
            </div>
          </button>

          {/* List View Option */}
          <button
            onClick={() => onSelectMode('list')}
            className="w-full p-6 bg-gradient-glass backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-secondary rounded-xl group-hover:scale-110 transition-transform">
                <List className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-foreground mb-1">List View</h3>
                <p className="text-sm text-muted-foreground">
                  Browse events in a clean list format. Great for quick scanning and detailed information.
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Features Highlight */}
        <div className="bg-secondary/30 rounded-2xl p-4 mb-6">
          <h4 className="font-semibold text-foreground mb-2">✨ What you can do:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Chat with AI to discover events</li>
            <li>• Search and filter events</li>
            <li>• Connect with people nearby</li>
            <li>• Get real-time updates</li>
          </ul>
        </div>

        {/* Skip Option */}
        <div className="text-center">
          <button
            onClick={() => onSelectMode('map')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip and use Map View (default)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModeSelector;
