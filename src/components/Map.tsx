import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Event {
  id: string;
  name: string;
  type: 'event' | 'person' | 'popular';
  coordinates: [number, number];
  description: string;
  time?: string;
  attendees?: number;
}

interface MapProps {
  onEventSelect: (event: Event) => void;
  highlightedEvents?: string[];
}

const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Rooftop Jazz Night',
    type: 'event',
    coordinates: [-73.98, 40.75],
    description: 'Live jazz music under the stars with amazing city views',
    time: '8:00 PM',
    attendees: 45
  },
  {
    id: '2',
    name: 'Sarah - Coffee Enthusiast',
    type: 'person',
    coordinates: [-73.985, 40.748],
    description: 'Looking for coffee shop recommendations and travel buddies'
  },
  {
    id: '3',
    name: 'Art Gallery Opening',
    type: 'popular',
    coordinates: [-73.977, 40.752],
    description: 'Exclusive preview of contemporary digital art collection',
    time: '7:00 PM',
    attendees: 120
  },
  {
    id: '4',
    name: 'Food Truck Festival',
    type: 'event',
    coordinates: [-73.983, 40.746],
    description: 'Street food from around the world in one location',
    time: '12:00 PM - 9:00 PM',
    attendees: 200
  },
  {
    id: '5',
    name: 'Mike - Photographer',
    type: 'person',
    coordinates: [-73.979, 40.754],
    description: 'Street photographer looking to collaborate on projects'
  }
];

const Map: React.FC<MapProps> = ({ onEventSelect, highlightedEvents = [] }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with demo token for now
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTVsNWhnaTcwMXZzMnFzN2hlcWg3Zm5mIn0.vJbG7Y1_dJJqA3QCPVQCIQ';
    
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
        ${event.type === 'event' ? 'bg-marker-event' : 
          event.type === 'person' ? 'bg-marker-person' : 'bg-marker-popular'}
      `;

      // Add pulsing ring for highlighted events
      if (isHighlighted) {
        const ring = document.createElement('div');
        ring.className = `
          absolute -inset-2 rounded-full border-2 animate-ping
          ${event.type === 'event' ? 'border-marker-event' : 
            event.type === 'person' ? 'border-marker-person' : 'border-marker-popular'}
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
            <div className="flex items-center gap-2 text-xs text-foreground/80">
              <div className="w-3 h-3 rounded-full bg-marker-popular"></div>
              <span>Popular</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
export type { Event };