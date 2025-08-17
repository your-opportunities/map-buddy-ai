import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, X, ChevronUp, ChevronDown, Key, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { callOpenRouterAPI, hasApiKey, OpenRouterMessage } from '@/lib/api';
import { mockEvents } from '@/lib/events';
import ApiKeyConfig from './ApiKeyConfig';

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
  const [showApiKeyConfig, setShowApiKeyConfig] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<OpenRouterMessage[]>([]);
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

  // Check if API key is configured when component mounts
  useEffect(() => {
    if (!hasApiKey()) {
      setShowApiKeyConfig(true);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    // Check if API key is configured
    if (!hasApiKey()) {
      setShowApiKeyConfig(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Call the OpenRouter API
      const { response, highlightIds } = await callOpenRouterAPI(
        userMessage.text,
        mockEvents,
        conversationHistory
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
        highlightIds,
        showInteractiveButtons: true
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update conversation history for context
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: userMessage.text },
        { role: 'assistant', content: response }
      ]);

      // Highlight events on map
      if (highlightIds.length > 0) {
        onEventHighlight(highlightIds);
      }
    } catch (error) {
      console.error('AI Assistant Error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or check your API key configuration.`,
        isUser: false,
        timestamp: new Date(),
        showInteractiveButtons: false
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
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

  const handleApiKeySet = () => {
    setShowApiKeyConfig(false);
    // Focus back to input after API key is set
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
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
      {/* API Key Configuration Modal */}
      {showApiKeyConfig && (
        <ApiKeyConfig
          onClose={() => setShowApiKeyConfig(false)}
          onApiKeySet={handleApiKeySet}
        />
      )}

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
              {!hasApiKey() && (
                <div className="flex items-center gap-1 text-xs text-yellow-500">
                  <AlertCircle className="w-3 h-3" />
                  <span>API Key Required</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!hasApiKey() && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApiKeyConfig(true)}
                  className="text-xs px-2 py-1 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                >
                  <Key className="w-3 h-3 mr-1" />
                  Setup
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-muted-foreground hover:text-foreground p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
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
                placeholder={hasApiKey() ? "Ask me about events or people nearby..." : "Configure API key to start chatting..."}
                className="flex-1 bg-secondary/50 border-white/20 text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
                disabled={isTyping || !hasApiKey()}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping || !hasApiKey()}
                className="bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground px-4 sm:px-6 min-w-[44px] sm:min-w-[48px]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Hints */}
            {hasApiKey() && (
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;