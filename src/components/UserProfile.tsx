import React, { useState, useEffect } from 'react';
import { User, MapPin, Heart, Coffee, Music, Camera, Dumbbell, BookOpen, Palette, Code, Utensils, Plane, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { loadUserPreferences } from '@/lib/userPreferences';

export interface UserPreferences {
  name: string;
  age: string;
  location: string;
  interests: string[];
  budget: 'low' | 'medium' | 'high' | 'any';
  preferredTime: 'morning' | 'afternoon' | 'evening' | 'any';
  groupSize: 'solo' | 'couple' | 'small-group' | 'large-group' | 'any';
  activityLevel: 'low' | 'medium' | 'high' | 'any';
  languages: string[];
  dietaryRestrictions: string[];
  accessibility: string[];
}

interface UserProfileProps {
  onComplete: (preferences: UserPreferences) => void;
  onSkip: () => void;
  initialPreferences?: Partial<UserPreferences>;
}

const UserProfile: React.FC<UserProfileProps> = ({ onComplete, onSkip, initialPreferences }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    // Load existing preferences or use defaults
    const existing = loadUserPreferences();
    return {
      name: '',
      age: '',
      location: '',
      interests: [],
      budget: 'any',
      preferredTime: 'any',
      groupSize: 'any',
      activityLevel: 'any',
      languages: [],
      dietaryRestrictions: [],
      accessibility: [],
      ...existing,
      ...initialPreferences
    };
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const interestOptions = [
    { id: 'music', label: 'Music', icon: Music, color: 'bg-purple-500' },
    { id: 'food', label: 'Food & Dining', icon: Utensils, color: 'bg-orange-500' },
    { id: 'art', label: 'Art & Culture', icon: Palette, color: 'bg-pink-500' },
    { id: 'tech', label: 'Technology', icon: Code, color: 'bg-blue-500' },
    { id: 'fitness', label: 'Fitness & Sports', icon: Dumbbell, color: 'bg-green-500' },
    { id: 'travel', label: 'Travel & Adventure', icon: Plane, color: 'bg-cyan-500' },
    { id: 'photography', label: 'Photography', icon: Camera, color: 'bg-indigo-500' },
    { id: 'reading', label: 'Reading & Literature', icon: BookOpen, color: 'bg-yellow-500' },
    { id: 'coffee', label: 'Coffee & Cafes', icon: Coffee, color: 'bg-amber-500' },
    { id: 'social', label: 'Social Events', icon: Heart, color: 'bg-red-500' },
  ];

  const languageOptions = ['Ukrainian', 'English', 'Russian', 'Polish', 'German', 'French', 'Spanish', 'Italian'];
  const dietaryOptions = ['None', 'Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Halal', 'Kosher'];
  const accessibilityOptions = ['None', 'Wheelchair accessible', 'Hearing assistance', 'Visual assistance', 'Low mobility support'];

  const toggleInterest = (interestId: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const toggleArrayItem = (array: string[], item: string, field: keyof UserPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [field]: array.includes(item)
        ? array.filter(i => i !== item)
        : [...array, item]
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(preferences);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return preferences.name.trim() && preferences.age.trim() && preferences.location.trim();
      case 2:
        return preferences.interests.length > 0;
      case 3:
        return true; // Optional preferences
      case 4:
        return true; // Review step
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Tell us about yourself</h3>
        <p className="text-muted-foreground mb-6">This helps us provide personalized recommendations</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Name</label>
          <Input
            value={preferences.name}
            onChange={(e) => setPreferences(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Your name"
            className="bg-secondary/50 border-white/20 text-foreground"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Age</label>
          <Select value={preferences.age} onValueChange={(value) => setPreferences(prev => ({ ...prev, age: value }))}>
            <SelectTrigger className="bg-secondary/50 border-white/20 text-foreground">
              <SelectValue placeholder="Select your age range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="18-25">18-25</SelectItem>
              <SelectItem value="26-35">26-35</SelectItem>
              <SelectItem value="36-45">36-45</SelectItem>
              <SelectItem value="46-55">46-55</SelectItem>
              <SelectItem value="56+">56+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Location</label>
          <Input
            value={preferences.location}
            onChange={(e) => setPreferences(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Your neighborhood or district"
            className="bg-secondary/50 border-white/20 text-foreground"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">What interests you?</h3>
        <p className="text-muted-foreground mb-6">Select your interests to get better recommendations</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {interestOptions.map((interest) => {
          const Icon = interest.icon;
          const isSelected = preferences.interests.includes(interest.id);
          
          return (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              className={`
                p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                ${isSelected 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-white/10 bg-secondary/30 text-muted-foreground hover:border-white/20 hover:bg-secondary/50'
                }
              `}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm font-medium">{interest.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Additional Preferences</h3>
        <p className="text-muted-foreground mb-6">These help us fine-tune your experience (optional)</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Budget Range</label>
          <Select value={preferences.budget} onValueChange={(value: any) => setPreferences(prev => ({ ...prev, budget: value }))}>
            <SelectTrigger className="bg-secondary/50 border-white/20 text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low (Free - ₴200)</SelectItem>
              <SelectItem value="medium">Medium (₴200 - ₴500)</SelectItem>
              <SelectItem value="high">High (₴500+)</SelectItem>
              <SelectItem value="any">Any budget</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Preferred Time</label>
          <Select value={preferences.preferredTime} onValueChange={(value: any) => setPreferences(prev => ({ ...prev, preferredTime: value }))}>
            <SelectTrigger className="bg-secondary/50 border-white/20 text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning (6 AM - 12 PM)</SelectItem>
              <SelectItem value="afternoon">Afternoon (12 PM - 6 PM)</SelectItem>
              <SelectItem value="evening">Evening (6 PM - 12 AM)</SelectItem>
              <SelectItem value="any">Any time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Group Size</label>
          <Select value={preferences.groupSize} onValueChange={(value: any) => setPreferences(prev => ({ ...prev, groupSize: value }))}>
            <SelectTrigger className="bg-secondary/50 border-white/20 text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solo">Solo</SelectItem>
              <SelectItem value="couple">Couple</SelectItem>
              <SelectItem value="small-group">Small group (3-5)</SelectItem>
              <SelectItem value="large-group">Large group (6+)</SelectItem>
              <SelectItem value="any">Any size</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Languages</label>
          <div className="flex flex-wrap gap-2">
            {languageOptions.map((lang) => (
              <Badge
                key={lang}
                variant={preferences.languages.includes(lang) ? "default" : "outline"}
                className={`cursor-pointer ${
                  preferences.languages.includes(lang)
                    ? 'bg-primary text-primary-foreground'
                    : 'border-white/20 text-foreground hover:bg-white/10'
                }`}
                onClick={() => toggleArrayItem(preferences.languages, lang, 'languages')}
              >
                {lang}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Review Your Profile</h3>
        <p className="text-muted-foreground mb-6">Here's what we know about you</p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-secondary/30 rounded-xl p-4">
          <h4 className="font-medium text-foreground mb-3">Basic Info</h4>
          <div className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">Name:</span> {preferences.name}</div>
            <div><span className="text-muted-foreground">Age:</span> {preferences.age}</div>
            <div><span className="text-muted-foreground">Location:</span> {preferences.location}</div>
          </div>
        </div>

        <div className="bg-secondary/30 rounded-xl p-4">
          <h4 className="font-medium text-foreground mb-3">Interests</h4>
          <div className="flex flex-wrap gap-2">
            {preferences.interests.map((interestId) => {
              const interest = interestOptions.find(i => i.id === interestId);
              return (
                <Badge key={interestId} variant="outline" className="border-white/20 text-foreground">
                  {interest?.label || interestId}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="bg-secondary/30 rounded-xl p-4">
          <h4 className="font-medium text-foreground mb-3">Preferences</h4>
          <div className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">Budget:</span> {preferences.budget}</div>
            <div><span className="text-muted-foreground">Preferred Time:</span> {preferences.preferredTime}</div>
            <div><span className="text-muted-foreground">Group Size:</span> {preferences.groupSize}</div>
            {preferences.languages.length > 0 && (
              <div><span className="text-muted-foreground">Languages:</span> {preferences.languages.join(', ')}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative bg-gradient-glass backdrop-blur-md border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-xl">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Create Your Profile</h2>
              <p className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-secondary/30 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="mb-6">
          {renderCurrentStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onSkip : handleBack}
            className="border-white/20 text-foreground hover:bg-white/10"
          >
            {currentStep === 1 ? 'Skip' : 'Back'}
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground"
          >
            {currentStep === totalSteps ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Complete Setup
              </>
            ) : (
              'Next'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
