import React, { useState } from 'react';
import { Key, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TokenInputProps {
  onTokenSubmit: (token: string) => void;
}

const TokenInput: React.FC<TokenInputProps> = ({ onTokenSubmit }) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onTokenSubmit(token.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="w-full max-w-md mx-4">
        <div className="bg-gradient-glass backdrop-blur-md rounded-2xl p-8 shadow-glass border border-white/10">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to EventMap</h1>
            <p className="text-muted-foreground">Enter your Mapbox API token to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Key className="w-4 h-4" />
                <span>Mapbox Public Token</span>
              </div>
              <Input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbG..."
                className="bg-secondary/50 border-white/20 text-foreground"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground"
              disabled={!token.trim()}
            >
              Initialize Map
            </Button>
          </form>

          <div className="mt-6 p-4 bg-secondary/30 rounded-xl">
            <p className="text-xs text-muted-foreground">
              Get your free Mapbox token at{' '}
              <a 
                href="https://mapbox.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenInput;