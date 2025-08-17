import React, { useState } from 'react';
import { Key, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { setApiKey, validateApiKey, hasApiKey } from '@/lib/api';

interface ApiKeyConfigProps {
  onClose: () => void;
  onApiKeySet: () => void;
}

const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({ onClose, onApiKeySet }) => {
  const [apiKey, setApiKeyValue] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setErrorMessage('Please enter your OpenRouter API key');
      setValidationStatus('error');
      return;
    }

    setIsValidating(true);
    setValidationStatus('idle');
    setErrorMessage('');

    try {
      const isValid = await validateApiKey(apiKey);
      
      if (isValid) {
        setApiKey(apiKey);
        setValidationStatus('success');
        setTimeout(() => {
          onApiKeySet();
          onClose();
        }, 1000);
      } else {
        setValidationStatus('error');
        setErrorMessage('Invalid API key. Please check your OpenRouter API key.');
      }
    } catch (error) {
      setValidationStatus('error');
      setErrorMessage('Failed to validate API key. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const getHelpText = () => {
    return (
      <div className="text-sm text-muted-foreground space-y-2">
        <p>To use the AI assistant, you need an OpenRouter API key:</p>
        <ol className="list-decimal list-inside space-y-1 ml-2">
          <li>Go to <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">openrouter.ai</a></li>
          <li>Sign up or log in to your account</li>
          <li>Navigate to your API keys section</li>
          <li>Create a new API key</li>
          <li>Copy and paste it here</li>
        </ol>
        <p className="text-xs mt-3 p-2 bg-secondary/30 rounded">
          💡 <strong>Free tier available:</strong> OpenRouter offers free credits to get started with AI models like DeepSeek R1.
        </p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-glass backdrop-blur-md border border-white/10 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-primary rounded-xl">
            <Key className="w-5 h-5 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Configure AI Assistant</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-foreground mb-2">
              OpenRouter API Key
            </label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKeyValue(e.target.value)}
                placeholder="sk-or-v1-..."
                className="pr-10 bg-secondary/50 border-white/20 text-foreground"
                disabled={isValidating}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isValidating}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Validation Status */}
          {validationStatus === 'success' && (
            <div className="flex items-center gap-2 text-green-500 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>API key validated successfully!</span>
            </div>
          )}

          {validationStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Help Text */}
          {getHelpText()}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-white/20 text-foreground hover:bg-white/10"
              disabled={isValidating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground"
              disabled={isValidating}
            >
              {isValidating ? 'Validating...' : 'Save & Continue'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyConfig;
