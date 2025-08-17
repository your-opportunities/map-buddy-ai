import React from 'react';
import { MapPin, List, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hasUserProfile } from '@/lib/userPreferences';

interface ViewModeSelectorProps {
  onSelectMode: (mode: 'map' | 'list') => void;
  onOpenProfile: () => void;
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({ onSelectMode, onOpenProfile }) => {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      
      {/* Main container */}
      <div className="relative w-full max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-2xl">
              <MapPin className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Map Buddy AI</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Discover events and connect with people in Kyiv
          </p>
        </div>

        {/* Main Options */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* Map View */}
          <button
            onClick={() => onSelectMode('map')}
            className="p-6 bg-gradient-glass backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] group"
          >
            <div className="text-center">
              <div className="p-3 bg-gradient-primary rounded-xl w-12 h-12 mx-auto mb-3 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Map View</h3>
              <p className="text-sm text-muted-foreground">
                Interactive 3D map with real-time events
              </p>
            </div>
          </button>

          {/* List View */}
          <button
            onClick={() => onSelectMode('list')}
            className="p-6 bg-gradient-glass backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] group"
          >
            <div className="text-center">
              <div className="p-3 bg-gradient-secondary rounded-xl w-12 h-12 mx-auto mb-3 group-hover:scale-110 transition-transform">
                <List className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">List View</h3>
              <p className="text-sm text-muted-foreground">
                Organized list with search and filters
              </p>
            </div>
          </button>

          {/* Profile Setup */}
          <button
            onClick={onOpenProfile}
            className="p-6 bg-gradient-glass backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] group"
          >
            <div className="text-center">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl w-12 h-12 mx-auto mb-3 group-hover:scale-110 transition-transform">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {hasUserProfile() ? 'Edit Profile' : 'Setup Profile'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {hasUserProfile() 
                  ? 'Update your preferences'
                  : 'Get personalized AI recommendations'
                }
              </p>
            </div>
          </button>
        </div>

        {/* Quick Features */}
        <div className="bg-secondary/20 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-foreground">AI Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-secondary" />
              <span className="text-foreground">Real-time Events</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-purple-500" />
              <span className="text-foreground">Connect People</span>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="text-center">
          <Button
            onClick={() => onSelectMode('map')}
            variant="outline"
            className="border-white/20 text-foreground hover:bg-white/10"
          >
            Start Exploring
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewModeSelector;
