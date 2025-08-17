import { UserPreferences } from '@/components/UserProfile';

const USER_PREFERENCES_KEY = 'mapBuddyUserPreferences';

// Save user preferences to localStorage
export const saveUserPreferences = (preferences: UserPreferences): void => {
  try {
    localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
};

// Load user preferences from localStorage
export const loadUserPreferences = (): UserPreferences | null => {
  try {
    const stored = localStorage.getItem(USER_PREFERENCES_KEY);
    if (stored) {
      return JSON.parse(stored) as UserPreferences;
    }
    return null;
  } catch (error) {
    console.error('Error loading user preferences:', error);
    return null;
  }
};

// Check if user has completed profile setup
export const hasUserProfile = (): boolean => {
  const preferences = loadUserPreferences();
  return !!(preferences && preferences.name && preferences.interests.length > 0);
};

// Update specific user preference
export const updateUserPreference = <K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K]
): void => {
  try {
    const preferences = loadUserPreferences();
    if (preferences) {
      const updated = { ...preferences, [key]: value };
      saveUserPreferences(updated);
    }
  } catch (error) {
    console.error('Error updating user preference:', error);
  }
};

// Clear user preferences
export const clearUserPreferences = (): void => {
  try {
    localStorage.removeItem(USER_PREFERENCES_KEY);
  } catch (error) {
    console.error('Error clearing user preferences:', error);
  }
};

// Get user preferences for AI context
export const getUserPreferencesForAI = (): string => {
  const preferences = loadUserPreferences();
  if (!preferences) {
    return 'No user profile available.';
  }

  const interestLabels = {
    music: 'Music',
    food: 'Food & Dining',
    art: 'Art & Culture',
    tech: 'Technology',
    fitness: 'Fitness & Sports',
    travel: 'Travel & Adventure',
    photography: 'Photography',
    reading: 'Reading & Literature',
    coffee: 'Coffee & Cafes',
    social: 'Social Events'
  };

  const interests = preferences.interests.map(id => interestLabels[id as keyof typeof interestLabels] || id).join(', ');
  const languages = preferences.languages.length > 0 ? preferences.languages.join(', ') : 'Not specified';

  return `
User Profile:
- Name: ${preferences.name}
- Age: ${preferences.age}
- Location: ${preferences.location}
- Interests: ${interests}
- Budget: ${preferences.budget}
- Preferred Time: ${preferences.preferredTime}
- Group Size: ${preferences.groupSize}
- Languages: ${languages}
`.trim();
};
