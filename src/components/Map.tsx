import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Event {
  id: string;
  name: string;
  type: 'event' | 'person';
  coordinates: [number, number];
  description: string;
  source?: string;
  time?: string;
  attendees?: number;
  date?: string;
  location?: string;
  categories?: string[];
  price?: string;
}

interface MapProps {
  onEventSelect: (event: Event) => void;
  highlightedEvents?: string[];
  mapboxToken: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Rooftop Jazz Night',
    type: 'event',
    coordinates: [-73.98, 40.75],
    description: 'Live jazz music under the stars with amazing city views. Experience intimate performances by local and touring artists in an exclusive rooftop setting with panoramic city views.',
    source: 'https://t.me/nycjazzevents',
    time: '8:00 PM',
    attendees: 45,
    date: 'Today',
    location: 'Rooftop Lounge, Manhattan',
    categories: ['Music', 'Jazz', 'Nightlife'],
    price: '$25'
  },
  {
    id: '2',
    name: 'Sarah - Coffee Enthusiast',
    type: 'person',
    coordinates: [-73.985, 40.748],
    description: 'Looking for coffee shop recommendations and travel buddies. Passionate about specialty coffee and exploring unique cafes around the city.',
    source: 'https://facebook.com/coffeeenthusiasts',
    location: 'Chelsea, Manhattan',
    categories: ['Coffee', 'Social', 'Travel']
  },
  {
    id: '3',
    name: 'Art Gallery Opening',
    type: 'event',
    coordinates: [-73.977, 40.752],
    description: 'Exclusive preview of contemporary digital art collection featuring works from emerging artists exploring the intersection of technology and creativity.',
    source: 'https://www.eventbrite.com/artgallery',
    time: '7:00 PM',
    attendees: 120,
    date: 'Tomorrow',
    location: 'Modern Gallery, SoHo',
    categories: ['Art', 'Culture', 'Digital'],
    price: 'Free'
  },
  {
    id: '4',
    name: 'Food Truck Festival',
    type: 'event',
    coordinates: [-73.983, 40.746],
    description: 'Street food from around the world in one location. Over 30 food trucks serving everything from tacos to gourmet burgers to Asian fusion cuisine.',
    source: 'https://t.me/nycfoodtrucks',
    time: '12:00 PM - 9:00 PM',
    attendees: 200,
    date: 'This Weekend',
    location: 'Washington Square Park',
    categories: ['Food', 'Festival', 'Family'],
    price: '$5-15 per item'
  },
  {
    id: '5',
    name: 'Mike - Photographer',
    type: 'person',
    coordinates: [-73.979, 40.754],
    description: 'Street photographer looking to collaborate on projects and share techniques with fellow photography enthusiasts.',
    source: 'https://instagram.com/mikephotographer',
    location: 'East Village, Manhattan',
    categories: ['Photography', 'Creative', 'Collaboration']
  },
  {
    id: '6',
    name: 'Tech Meetup',
    type: 'event',
    coordinates: [-73.987, 40.744],
    description: 'Weekly networking event for developers and entrepreneurs. Featuring talks on latest tech trends, startup pitches, and networking opportunities.',
    source: 'https://meetup.com/nyctech',
    time: '7:00 PM',
    attendees: 85,
    date: 'Every Wednesday',
    location: 'Tech Hub, Financial District',
    categories: ['Technology', 'Networking', 'Professional'],
    price: 'Free'
  },
  {
    id: '7',
    name: 'Anna - Fitness Trainer',
    type: 'person',
    coordinates: [-73.974, 40.749],
    description: 'Personal trainer offering outdoor workout sessions and group fitness classes in Central Park.',
    source: 'https://facebook.com/annafit',
    location: 'Upper East Side, Manhattan',
    categories: ['Fitness', 'Health', 'Outdoor']
  },
  {
    id: '8',
    name: 'Yoga in the Park',
    type: 'event',
    coordinates: [-73.982, 40.757],
    description: 'Free outdoor yoga class for all skill levels. Bring your own mat and enjoy morning meditation and stretching in a peaceful park setting.',
    source: 'https://eventbrite.com/yogapark',
    time: '7:00 AM',
    attendees: 30,
    date: 'Daily',
    location: 'Central Park, Great Lawn',
    categories: ['Yoga', 'Wellness', 'Outdoor'],
    price: 'Free'
  },
  {
    id: '9',
    name: 'David - Tour Guide',
    type: 'person',
    coordinates: [-73.976, 40.743],
    description: 'Local expert specializing in hidden city gems and historical walking tours off the beaten path.',
    source: 'https://tripadvisor.com/davidtours',
    location: 'Lower Manhattan',
    categories: ['Tours', 'History', 'Local Guide']
  },
  {
    id: '10',
    name: 'Night Market',
    type: 'event',
    coordinates: [-73.981, 40.751],
    description: 'Local vendors selling handmade crafts and street food. A vibrant evening market featuring local artisans, food vendors, and live entertainment.',
    source: 'https://t.me/nightmarketsnyc',
    time: '6:00 PM - 11:00 PM',
    attendees: 150,
    date: 'Friday & Saturday',
    location: 'Union Square',
    categories: ['Market', 'Crafts', 'Food'],
    price: 'Free entry'
  },
  {
    id: '11',
    name: 'Emma - Book Club',
    type: 'person',
    coordinates: [-73.984, 40.756],
    description: 'Literature enthusiast organizing weekly book discussions and reading groups for various genres.',
    source: 'https://goodreads.com/emmabookclub',
    location: 'Midtown West, Manhattan',
    categories: ['Books', 'Literature', 'Social']
  },
  {
    id: '12',
    name: 'Live Music Jam',
    type: 'event',
    coordinates: [-73.978, 40.747],
    description: 'Open mic night for musicians and music lovers. Bring your instrument or just enjoy the performances in an intimate venue.',
    source: 'https://facebook.com/events/musicjam',
    time: '8:30 PM',
    attendees: 65,
    date: 'Every Thursday',
    location: 'Village Pub, Greenwich Village',
    categories: ['Music', 'Open Mic', 'Community'],
    price: '$10 cover'
  }
];

const Map: React.FC<MapProps> = ({ onEventSelect, highlightedEvents = [], mapboxToken }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with provided token
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-73.98, 40.75], // NYC coordinates
      zoom: 14,
      pitch: 45,
      bearing: -17.6,
      antialias: true
    });

    map.current.on('load', () => {
      setMapLoaded(true);
      
      // Add 3D buildings
      map.current?.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 10,
        'paint': {
          'fill-extrusion-color': '#1a1a2e',
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 0,
            15, ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 0,
            15, ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.7
        }
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add event markers
    mockEvents.forEach((event) => {
      const isHighlighted = highlightedEvents.includes(event.id);
      
      const markerElement = document.createElement('div');
      markerElement.className = `
        w-6 h-6 rounded-full border-2 border-white cursor-pointer
        transition-all duration-300 relative
        ${isHighlighted ? 'animate-pulse-slow scale-150 shadow-glow' : 'hover:scale-110'}
        ${event.type === 'event' ? 'bg-marker-event' : 'bg-marker-person'}
      `;

      // Add pulsing ring for highlighted events
      if (isHighlighted) {
        const ring = document.createElement('div');
        ring.className = `
          absolute -inset-2 rounded-full border-2 animate-ping
          ${event.type === 'event' ? 'border-marker-event' : 'border-marker-person'}
        `;
        markerElement.appendChild(ring);
      }

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(event.coordinates)
        .addTo(map.current!);

      markerElement.addEventListener('click', () => {
        onEventSelect(event);
      });

      markersRef.current.push(marker);
    });
  }, [mapLoaded, onEventSelect, highlightedEvents]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-map-overlay" />
      
      
      {/* Map controls overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="bg-gradient-glass backdrop-blur-md rounded-xl p-2 shadow-glass">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs text-foreground/80">
              <div className="w-3 h-3 rounded-full bg-marker-event"></div>
              <span>Events</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-foreground/80">
              <div className="w-3 h-3 rounded-full bg-marker-person"></div>
              <span>People</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
export type { Event };