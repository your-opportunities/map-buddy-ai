import React, { useState, useEffect } from 'react';
import { Send, Bot, X } from 'lucide-react';
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
  onExpandedChange?: (expanded: boolean) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onToggle, onEventHighlight, onExpandedChange }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! 👋 I'm your AI assistant. Just tell me what you're in the mood for - like 'I'm bored tonight', 'I like jazz', or 'looking for food events' and I'll suggest some great options nearby!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [highlightedEvents, setHighlightedEvents] = useState<string[]>([]);

  // Notify parent about expanded state
  useEffect(() => {
    onExpandedChange?.(isOpen);
  }, [isOpen, onExpandedChange]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate contextual AI response
    setTimeout(() => {
      let response = '';
      let highlightIds: string[] = [];

      const inputLower = input.toLowerCase();
      
      // Context understanding - infer meaning
      if (inputLower.includes('bored') || inputLower.includes('tonight') || inputLower.includes('fun') || inputLower.includes('do')) {
        response = `Got it, you're looking for some fun tonight 🎉 Here are a few options:

🎶 **Jazz Night at Central Club**
Live performance with local artists
*See details*

🎬 **Open-air Movie Night**
Classic films under the stars
*See details*

🍔 **Street Food Festival**
Food trucks from around the world
*See details*

Want me to show these on the map and highlight them?`;
        highlightIds = ['1', '3', '4'];
      } else if (inputLower.includes('jazz') || inputLower.includes('music') || inputLower.includes('concert')) {
        response = `Perfect, you're into music tonight 🎶 Here's what's happening:

🎵 **Rooftop Jazz Night**
Live band, great atmosphere, starts 8 PM
*See details*

🎼 **Classical Concert**
Symphony orchestra performance
*See details*

🎸 **Live Rock Show**
Local bands, energetic crowd
*See details*

Want me to show these on the map and highlight them?`;
        highlightIds = ['1'];
      } else if (inputLower.includes('food') || inputLower.includes('eat') || inputLower.includes('hungry') || inputLower.includes('restaurant')) {
        response = `Sounds like you're hungry! 🍽️ Here are some great food events:

🍕 **Food Truck Festival**
International cuisine, live music
*See details*

🍜 **Night Market**
Street food vendors, local specialties
*See details*

🥘 **Cooking Workshop**
Learn to make authentic dishes
*See details*

Want me to show these on the map and highlight them?`;
        highlightIds = ['4'];
      } else if (inputLower.includes('art') || inputLower.includes('gallery') || inputLower.includes('creative') || inputLower.includes('culture')) {
        response = `Great taste in culture! 🎨 Check out these artistic events:

🖼️ **Art Gallery Opening**
Contemporary digital art collection
*See details*

🎭 **Theater Performance**
Local drama group presents classic play
*See details*

📸 **Photography Exhibition**
Street photography showcase
*See details*

Want me to show these on the map and highlight them?`;
        highlightIds = ['3'];
      } else if (inputLower.includes('tech') || inputLower.includes('meetup') || inputLower.includes('network') || inputLower.includes('startup')) {
        response = `Perfect for networking! 💻 Here are some tech events:

🚀 **Startup Pitch Night**
Local entrepreneurs present ideas
*See details*

💡 **Tech Meetup**
JavaScript developers gathering
*See details*

🤖 **AI Workshop**
Learn about machine learning
*See details*

Want me to show these on the map and highlight them?`;
        highlightIds = ['2'];
      } else {
        response = `I can help you find events based on what you're interested in! Just tell me what you're in the mood for - like "I'm bored tonight", "I like jazz", or "looking for food events".

Here are some popular options right now:

🎵 **Jazz Night** - Live music tonight
🍔 **Food Festival** - Street food from around the world
🎨 **Art Gallery** - New contemporary exhibition

Want me to show these on the map?`;
        highlightIds = ['1', '4', '3'];
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Add interactive buttons after AI response
      setTimeout(() => {
        const buttonMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: "INTERACTIVE_BUTTONS",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, buttonMessage]);
      }, 500);
      
      setHighlightedEvents(highlightIds);
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

      {/* Bottom Panel */}
      <div 
        data-ai-assistant
        className={`
          fixed bottom-0 left-0 right-0 z-40 transform transition-all duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          h-[80vh]
        `}
      >
        <div className="bg-gradient-glass backdrop-blur-md border-t border-white/10 h-full flex flex-col">
          {/* Panel Header */}
          <div className="flex items-center justify-between px-6 py-4">
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
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden px-6">
            <div className="h-full overflow-y-auto space-y-3 scroll-smooth pb-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {message.text === "INTERACTIVE_BUTTONS" ? (
                    <div className="flex flex-col gap-2 max-w-[80%]">
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          onClick={() => onEventHighlight(highlightedEvents)}
                          size="sm"
                          className="bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground text-xs px-3 py-1"
                        >
                          🗺️ Show on Map
                        </Button>
                        <Button
                          onClick={() => onEventHighlight([highlightedEvents[0]])}
                          size="sm"
                          variant="outline"
                          className="text-xs px-3 py-1 border-white/20"
                        >
                          ⭐ Highlight Closest Event
                        </Button>
                        <Button
                          onClick={() => setInput("Show me more options")}
                          size="sm"
                          variant="outline"
                          className="text-xs px-3 py-1 border-white/20"
                        >
                          🔄 See More Options
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`
                        max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-line
                        ${message.isUser 
                          ? 'bg-gradient-primary text-primary-foreground' 
                          : 'bg-secondary/50 text-foreground border border-white/10'
                        }
                      `}
                    >
                      {message.text}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-6 pt-2">
            <div className="flex gap-3 mb-3">
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
            
            {/* Hints */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {["I'm bored tonight", "I like jazz", "Looking for food", "Tech meetups"].map((hint) => (
                <button
                  key={hint}
                  onClick={() => setInput(hint)}
                  className="flex-shrink-0 px-3 py-1.5 text-xs bg-secondary/30 text-muted-foreground rounded-full border border-white/10 hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;