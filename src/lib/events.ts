import { Event } from '@/components/Map';

export const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Jazz Night at Podil',
    type: 'event',
    coordinates: [30.5194, 50.4501], // Kyiv, Podil district
    description: 'Live jazz music in the heart of Podil. Experience intimate performances by local and touring artists in a cozy underground venue.',
    source: 'https://t.me/kyivjazz',
    time: '8:00 PM',
    attendees: 45,
    date: 'Today',
    location: 'Jazz Club, Podil',
    categories: ['Music', 'Jazz', 'Nightlife'],
    price: '₴200'
  },
  {
    id: '2',
    name: 'Maria - Coffee Enthusiast',
    type: 'person',
    coordinates: [30.5152, 50.4478], // Kyiv, different area
    description: 'Looking for coffee shop recommendations and travel buddies. Passionate about specialty coffee and exploring unique cafes around Kyiv.',
    source: 'https://facebook.com/kyivcoffee',
    location: 'Podil, Kyiv',
    categories: ['Coffee', 'Social', 'Travel']
  },
  {
    id: '3',
    name: 'Contemporary Art Exhibition',
    type: 'event',
    coordinates: [30.5221, 50.4532], // Kyiv, art district
    description: 'Exclusive preview of contemporary Ukrainian art collection featuring works from emerging artists exploring modern themes.',
    source: 'https://www.eventbrite.com/kyivart',
    time: '7:00 PM',
    attendees: 120,
    date: 'Tomorrow',
    location: 'Modern Art Gallery, Kyiv',
    categories: ['Art', 'Culture', 'Contemporary'],
    price: 'Free'
  },
  {
    id: '4',
    name: 'Ukrainian Food Festival',
    type: 'event',
    coordinates: [30.5168, 50.4456], // Kyiv, food district
    description: 'Traditional Ukrainian cuisine and street food from around the world. Over 30 food vendors serving everything from borscht to gourmet burgers.',
    source: 'https://t.me/kyivfood',
    time: '12:00 PM - 9:00 PM',
    attendees: 200,
    date: 'This Weekend',
    location: 'Independence Square',
    categories: ['Food', 'Festival', 'Family'],
    price: '₴50-150 per item'
  },
  {
    id: '5',
    name: 'Oleksandr - Photographer',
    type: 'person',
    coordinates: [30.5247, 50.4519], // Kyiv, creative district
    description: 'Street photographer looking to collaborate on projects and share techniques with fellow photography enthusiasts.',
    source: 'https://instagram.com/oleksandrphoto',
    location: 'Pechersk, Kyiv',
    categories: ['Photography', 'Creative', 'Collaboration']
  },
  {
    id: '6',
    name: 'Tech Meetup Kyiv',
    type: 'event',
    coordinates: [30.5183, 50.4489], // Kyiv, tech district
    description: 'Weekly networking event for developers and entrepreneurs. Featuring talks on latest tech trends, startup pitches, and networking opportunities.',
    source: 'https://meetup.com/kyivtech',
    time: '7:00 PM',
    attendees: 85,
    date: 'Every Wednesday',
    location: 'Tech Hub, Kyiv',
    categories: ['Technology', 'Networking', 'Professional'],
    price: 'Free'
  },
  {
    id: '7',
    name: 'Anna - Fitness Trainer',
    type: 'person',
    coordinates: [30.5209, 50.4567], // Kyiv, fitness area
    description: 'Personal trainer offering outdoor workout sessions and group fitness classes in Mariinsky Park.',
    source: 'https://facebook.com/annafitkyiv',
    location: 'Mariinsky Park, Kyiv',
    categories: ['Fitness', 'Health', 'Outdoor']
  },
  {
    id: '8',
    name: 'Yoga in Mariinsky Park',
    type: 'event',
    coordinates: [30.5176, 50.4592], // Kyiv, Mariinsky Park
    description: 'Free outdoor yoga class for all skill levels. Bring your own mat and enjoy morning meditation and stretching in a peaceful park setting.',
    source: 'https://eventbrite.com/yogakyiv',
    time: '7:00 AM',
    attendees: 30,
    date: 'Daily',
    location: 'Mariinsky Park, Kyiv',
    categories: ['Yoga', 'Wellness', 'Outdoor'],
    price: 'Free'
  },
  {
    id: '9',
    name: 'Dmytro - Tour Guide',
    type: 'person',
    coordinates: [30.5231, 50.4473], // Kyiv, historical area
    description: 'Local expert specializing in hidden city gems and historical walking tours of Kyiv\'s ancient streets.',
    source: 'https://tripadvisor.com/dmytrotours',
    location: 'Old Kyiv',
    categories: ['Tours', 'History', 'Local Guide']
  },
  {
    id: '10',
    name: 'Kyiv Night Market',
    type: 'event',
    coordinates: [30.5218, 50.4625], // Kyiv, market area
    description: 'Local vendors selling handmade crafts and street food. A vibrant evening market featuring local artisans, food vendors, and live entertainment.',
    source: 'https://t.me/kyivnightmarket',
    time: '6:00 PM - 11:00 PM',
    attendees: 150,
    date: 'Friday & Saturday',
    location: 'Andriyivsky Uzviz',
    categories: ['Market', 'Crafts', 'Food'],
    price: 'Free entry'
  },
  {
    id: '11',
    name: 'Kateryna - Book Club',
    type: 'person',
    coordinates: [30.5164, 50.4548], // Kyiv, cultural area
    description: 'Literature enthusiast organizing weekly book discussions and reading groups for various genres.',
    source: 'https://goodreads.com/katerynabookclub',
    location: 'Shevchenko District, Kyiv',
    categories: ['Books', 'Literature', 'Social']
  },
  {
    id: '12',
    name: 'Live Music Jam Kyiv',
    type: 'event',
    coordinates: [30.5251, 50.4497], // Kyiv, music district
    description: 'Open mic night for musicians and music lovers. Bring your instrument or just enjoy the performances in an intimate venue.',
    source: 'https://facebook.com/events/kyivmusicjam',
    time: '8:30 PM',
    attendees: 65,
    date: 'Every Thursday',
    location: 'Music Club, Kyiv',
    categories: ['Music', 'Open Mic', 'Community'],
    price: '₴100 cover'
  }
];

export const getEventById = (id: string): Event | undefined => {
  return mockEvents.find(event => event.id === id);
};
