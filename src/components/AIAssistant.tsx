import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, X, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  highlightIds?: string[];
  showInteractiveButtons?: boolean;
}

interface AIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  onEventHighlight: (eventIds: string[]) => void;
  onExpandedChange?: (expanded: boolean) => void;
  onEventClick?: (eventId: string) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onToggle, onEventHighlight, onExpandedChange, onEventClick }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! 👋 I'm your AI assistant. Just tell me what you're in the mood for - like 'I'm bored tonight', 'I like jazz', or 'looking for food events' and I'll suggest some great options nearby!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  // Notify parent about expanded state
  useEffect(() => {
    onExpandedChange?.(isOpen);
  }, [isOpen, onExpandedChange]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const generateAIResponse = (userInput: string): { response: string; highlightIds: string[] } => {
    const inputLower = userInput.toLowerCase();
    
    if (inputLower.includes('bored') || inputLower.includes('tonight') || inputLower.includes('fun') || inputLower.includes('do')) {
      return {
        response: `Got it, you're looking for some fun tonight 🎉 Here are a few options:

🎶 **[Jazz Night at Central Club](event:1)**
Live performance with local artists
*Click to see details*

🎬 **[Open-air Movie Night](event:3)**
Classic films under the stars
*Click to see details*

🍔 **[Street Food Festival](event:4)**
Food trucks from around the world
*Click to see details*

Want me to show these on the map and highlight them?`,
        highlightIds: ['1', '3', '4']
      };
    } else if (inputLower.includes('jazz') || inputLower.includes('music') || inputLower.includes('concert')) {
      return {
        response: `Perfect, you're into music tonight 🎶 Here's what's happening:

🎵 **[Rooftop Jazz Night](event:1)**
Live band, great atmosphere, starts 8 PM
*Click to see details*

🎼 **[Classical Concert](event:2)**
Symphony orchestra performance
*Click to see details*

🎸 **[Live Rock Show](event:5)**
Local bands, energetic crowd
*Click to see details*

Want me to show these on the map and highlight them?`,
        highlightIds: ['1', '2', '5']
      };
    } else if (inputLower.includes('food') || inputLower.includes('eat') || inputLower.includes('hungry') || inputLower.includes('restaurant')) {
      return {
        response: `Sounds like you're hungry! 🍽️ Here are some great food events:

🍕 **[Food Truck Festival](event:4)**
International cuisine, live music
*Click to see details*

🍜 **[Night Market](event:7)**
Street food vendors, local specialties
*Click to see details*

🥘 **[Cooking Workshop](event:8)**
Learn to make authentic dishes
*Click to see details*

Want me to show these on the map and highlight them?`,
        highlightIds: ['4', '7', '8']
      };
    } else if (inputLower.includes('art') || inputLower.includes('gallery') || inputLower.includes('creative') || inputLower.includes('culture')) {
      return {
        response: `Great taste in culture! 🎨 Check out these artistic events:

🖼️ **[Art Gallery Opening](event:3)**
Contemporary digital art collection
*Click to see details*

🎭 **[Theater Performance](event:9)**
Local drama group presents classic play
*Click to see details*

📸 **[Photography Exhibition](event:10)**
Street photography showcase
*Click to see details*

Want me to show these on the map and highlight them?`,
        highlightIds: ['3', '9', '10']
      };
    } else if (inputLower.includes('tech') || inputLower.includes('meetup') || inputLower.includes('network') || inputLower.includes('startup')) {
      return {
        response: `Perfect for networking! 💻 Here are some tech events:

🚀 **[Startup Pitch Night](event:6)**
Local entrepreneurs present ideas
*Click to see details*

💡 **[Tech Meetup](event:11)**
JavaScript developers gathering
*Click to see details*

🤖 **[AI Workshop](event:12)**
Learn about machine learning
*Click to see details*

Want me to show these on the map and highlight them?`,
        highlightIds: ['6', '11', '12']
      };
    } else {
      return {
        response: `I can help you find events based on what you're interested in! Just tell me what you're in the mood for - like "I'm bored tonight", "I like jazz", or "looking for food events".

Here are some popular options right now:

🎵 **[Jazz Night](event:1)** - Live music tonight
🍔 **[Food Festival](event:4)** - Street food from around the world
🎨 **[Art Gallery](event:3)** - New contemporary exhibition

Want me to show these on the map?`,
        highlightIds: ['1', '4', '3']
      };
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 800));

    const { response, highlightIds } = generateAIResponse(userMessage.text);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      isUser: false,
      timestamp: new Date(),
      highlightIds,
      showInteractiveButtons: true
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);

    // Highlight events on map
    if (highlightIds.length > 0) {
      onEventHighlight(highlightIds);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    inputRef.current?.focus();
  };

  const handleHighlightEvents = (highlightIds: string[]) => {
    onEventHighlight(highlightIds);
    // Hide the modal completely when showing events on map
    onToggle();
  };

  const handleReturnToChat = () => {
    // This function is no longer needed since we removed half-hidden state
  };

  const handleEventClick = (eventId: string) => {
    // Trigger the event detail modal and close the AI assistant
    onEventClick?.(eventId);
    onToggle(); // Close the AI assistant modal
  };

  const renderMessageWithLinks = (text: string) => {
    try {
      // Parse markdown-style links [text](event:id)
      const linkRegex = /\[([^\]]+)\]\(event:([^)]+)\)/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = linkRegex.exec(text)) !== null) {
        // Add text before the link
        if (match.index > lastIndex) {
          parts.push(text.slice(lastIndex, match.index));
        }
        
        // Check if we have valid capture groups and they are not undefined
        if (match && match[1] && match[2] && typeof match[1] === 'string' && typeof match[2] === 'string') {
          // Store the event ID in a local variable to avoid closure issues
          const eventId = match[2];
          const linkText = match[1];
          
          // Add the clickable link
          parts.push(
            <button
              key={`link-${eventId}`}
              onClick={() => handleEventClick(eventId)}
              className="text-primary hover:text-primary/80 underline font-medium transition-colors"
            >
              {linkText}
            </button>
          );
        } else {
          // If no valid capture groups, just add the original text
          parts.push(match[0] || '');
        }
        
        lastIndex = match.index + (match[0] ? match[0].length : 0);
      }
      
      // Add remaining text
      if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
      }
      
      return parts.length > 0 ? parts : text;
    } catch (error) {
      console.error('Error parsing message links:', error);
      return text;
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

      {/* Mobile-optimized Bottom Panel */}
      <div 
        className={`
          fixed bottom-0 left-0 right-0 z-40 transform transition-all duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          h-[85vh] sm:h-[70vh] max-h-[600px]
        `}
      >
        <div className="bg-gradient-glass backdrop-blur-md border-t border-white/10 h-full flex flex-col rounded-t-2xl">
          {/* Panel Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-xl">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">AI Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-muted-foreground hover:text-foreground p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden px-4 sm:px-6">
              <div className="h-full overflow-y-auto space-y-3 sm:space-y-4 scroll-smooth py-3 sm:py-4">
                {messages.map(message => (
                  <div key={message.id}>
                    <div
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`
                          max-w-[90%] sm:max-w-[85%] p-3 sm:p-4 rounded-2xl text-sm whitespace-pre-line
                          ${message.isUser 
                            ? 'bg-gradient-primary text-primary-foreground' 
                            : 'bg-secondary/50 text-foreground border border-white/10'
                          }
                        `}
                      >
                        {message.isUser ? message.text : renderMessageWithLinks(message.text)}
                      </div>
                    </div>
                    
                    {/* Interactive buttons after AI responses */}
                    {!message.isUser && message.showInteractiveButtons && message.highlightIds && (
                      <div className="flex justify-start mt-2">
                        <div className="flex gap-2 max-w-[90%] sm:max-w-[85%]">
                          <Button
                            onClick={() => handleHighlightEvents(message.highlightIds!)}
                            size="sm"
                            variant="outline"
                            className="text-xs px-3 py-1 border-white/20 whitespace-nowrap bg-secondary/30 hover:bg-secondary/50"
                          >
                            🗺️ Show on Map
                          </Button>
                          <Button
                            onClick={() => handleQuickAction("Show me more options")}
                            size="sm"
                            variant="outline"
                            className="text-xs px-3 py-1 border-white/20 whitespace-nowrap bg-secondary/30 hover:bg-secondary/50"
                          >
                            🔄 More Options
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-secondary/50 text-foreground border border-white/10 max-w-[90%] sm:max-w-[85%] p-3 sm:p-4 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

          {/* Input */}
          <div className="p-4 sm:p-6 pt-2 sm:pt-3">
            <div className="flex gap-2 sm:gap-3 mb-3">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about events or people nearby..."
                className="flex-1 bg-secondary/50 border-white/20 text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
                disabled={isTyping}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground px-4 sm:px-6 min-w-[44px] sm:min-w-[48px]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Hints */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {["I'm bored tonight", "I like jazz", "Looking for food", "Tech meetups"].map((hint) => (
                <button
                  key={hint}
                  onClick={() => handleQuickAction(hint)}
                  disabled={isTyping}
                  className="flex-shrink-0 px-3 py-1.5 text-xs bg-secondary/30 text-muted-foreground rounded-full border border-white/10 hover:bg-secondary/50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-h-[32px]"
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