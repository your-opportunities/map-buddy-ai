import React, { useState } from 'react';
import { Send, Bot, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  onEventHighlight: (eventIds: string[]) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onToggle, onEventHighlight }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI assistant. I can help you find events and people nearby. Try asking me something like 'Find jazz events tonight' or 'Show me photographers in the area'.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response with event highlighting
    setTimeout(() => {
      let response = '';
      let highlightIds: string[] = [];

      const inputLower = input.toLowerCase();
      
      if (inputLower.includes('jazz') || inputLower.includes('music')) {
        response = "I found a Jazz event for you! 🎵 There's a Rooftop Jazz Night happening tonight at 8 PM with 45 people attending. Check it out on the map!";
        highlightIds = ['1'];
      } else if (inputLower.includes('photographer') || inputLower.includes('photo')) {
        response = "I found a photographer near you! 📸 Mike is a street photographer looking to collaborate on projects. He's just a few blocks away!";
        highlightIds = ['5'];
      } else if (inputLower.includes('food') || inputLower.includes('eat')) {
        response = "Perfect timing! 🍕 There's a Food Truck Festival happening now with food from around the world. Over 200 people are there!";
        highlightIds = ['4'];
      } else if (inputLower.includes('popular') || inputLower.includes('trending')) {
        response = "The hottest spot right now is the Art Gallery Opening! 🎨 120 people are checking out the new contemporary digital art collection.";
        highlightIds = ['3'];
      } else if (inputLower.includes('coffee')) {
        response = "I found Sarah, a coffee enthusiast who's looking for coffee shop recommendations! ☕ She might have some great suggestions for you.";
        highlightIds = ['2'];
      } else {
        response = "I can help you find specific events or people! Try asking about 'jazz music', 'photographers', 'food events', or 'popular spots' to see what's happening nearby.";
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      onEventHighlight(highlightIds);
    }, 1000);

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Background Blur Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm animate-fade-in"
          onClick={onToggle}
        />
      )}

      {/* AI Assistant Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggle}
          className="bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground rounded-full p-4 shadow-glow"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </div>

      {/* Bottom Panel */}
      <div className={`
        fixed bottom-0 left-0 right-0 z-40 transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      `}>
        <div className="bg-gradient-glass backdrop-blur-md border-t border-white/10">
          <div className="max-w-4xl mx-auto p-6">
            {/* Panel Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-primary rounded-xl">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">AI Assistant</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronDown className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto mb-4 space-y-3 scroll-smooth">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-sm p-3 rounded-2xl text-sm
                      ${message.isUser 
                        ? 'bg-gradient-primary text-primary-foreground' 
                        : 'bg-secondary/50 text-foreground border border-white/10'
                      }
                    `}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about events or people nearby..."
                className="flex-1 bg-secondary/50 border-white/20 text-foreground placeholder:text-muted-foreground"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;