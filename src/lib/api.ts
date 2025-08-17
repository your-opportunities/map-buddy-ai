import { Event } from '@/components/Map';
import { getUserPreferencesForAI } from './userPreferences';

// OpenRouter API configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEEPSEEK_MODEL = 'deepseek/deepseek-r1:free';

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIResponse {
  response: string;
  highlightIds: string[];
}

// Get API key from environment or localStorage
const getApiKey = (): string => {
  // First try environment variable (for production)
  if (import.meta.env.VITE_OPENROUTER_API_KEY) {
    return import.meta.env.VITE_OPENROUTER_API_KEY;
  }
  
  // Fallback to localStorage (for development)
  return localStorage.getItem('openRouterApiKey') || '';
};

// Set API key in localStorage
export const setApiKey = (apiKey: string): void => {
  localStorage.setItem('openRouterApiKey', apiKey);
};

// Check if API key is configured
export const hasApiKey = (): boolean => {
  return !!getApiKey();
};

// Create system prompt with event context and user preferences
const createSystemPrompt = (events: Event[]): string => {
  const eventsContext = events.map(event => 
    `- ${event.name} (ID: ${event.id}): ${event.description} | Date: ${event.date || 'No date'} | Type: ${event.type} | Categories: ${event.categories?.join(', ') || 'None'}`
  ).join('\n');

  const userPreferences = getUserPreferencesForAI();

  return `You are an AI assistant helping users find events and people in Kyiv, Ukraine. You have access to the following events and people:

${eventsContext}

${userPreferences}

IMPORTANT RULES:
1. Always respond in a friendly, helpful tone and use the user's name when available
2. When suggesting events, use the format: [Event Name](event:ID) for clickable links
3. Include relevant event IDs in your response for highlighting on the map
4. Keep responses concise but informative
5. Personalize recommendations based on the user's interests, budget, preferred time, and group size
6. If no events match the user's request, suggest alternatives or ask for clarification
7. Always end your response with a question or suggestion to keep the conversation engaging
8. Consider the user's location when suggesting nearby events
9. Match events to the user's interests and preferences when possible

Response format:
- Use markdown-style links: [Event Name](event:ID)
- Include event IDs in your response for map highlighting
- Keep it conversational and helpful
- Personalize based on user profile when available`;
};

// Call OpenRouter API
export const callOpenRouterAPI = async (
  userMessage: string,
  events: Event[],
  conversationHistory: OpenRouterMessage[] = []
): Promise<AIResponse> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured. Please add your API key in the settings.');
  }

  const systemPrompt = createSystemPrompt(events);
  
  const messages: OpenRouterMessage[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Map Buddy AI'
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages,
        max_tokens: 500,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API Error:', errorData);
      
      if (errorData.error?.message) {
        throw new Error(`API Error: ${errorData.error.message}`);
      } else if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenRouter API key.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }
    }

    const data: OpenRouterResponse = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'Sorry, I couldn\'t process your request.';

    // Extract event IDs from the response
    const eventIdRegex = /\[([^\]]+)\]\(event:([^)]+)\)/g;
    const highlightIds: string[] = [];
    let match;
    
    while ((match = eventIdRegex.exec(aiResponse)) !== null) {
      if (match[2] && !highlightIds.includes(match[2])) {
        highlightIds.push(match[2]);
      }
    }

    return {
      response: aiResponse,
      highlightIds
    };
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    throw error;
  }
};

// Validate API key
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Map Buddy AI'
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API validation error:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('API key validation error:', error);
    return false;
  }
};
