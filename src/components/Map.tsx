import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mockEvents } from '@/lib/events';

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

// Events data is now imported from @/lib/events

const Map: React.FC<MapProps> = ({ onEventSelect, highlightedEvents = [], mapboxToken }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const onEventSelectRef = useRef(onEventSelect);

  // Update the ref when onEventSelect changes
  useEffect(() => {
    onEventSelectRef.current = onEventSelect;
  }, [onEventSelect]);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map with provided token
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [30.5194, 50.4501], // Kyiv coordinates
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
  }, [mapboxToken]);

  // Create markers when map is loaded
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add event markers
    mockEvents.forEach((event) => {
      const markerElement = document.createElement('div');
      
      // Create marker with proper UX design - all same size
      markerElement.className = 'relative cursor-pointer transition-all duration-300';

      // Create the main marker dot - fixed size for all
      const dot = document.createElement('div');
      dot.className = `
        w-4 h-4 rounded-full border-2 border-white shadow-lg
        ${event.type === 'event' ? 'bg-purple-500' : 'bg-pink-500'}
      `;

      // Add event type indicator
      const indicator = document.createElement('div');
      indicator.className = `
        absolute -top-1 -right-1 w-2 h-2 rounded-full
        ${event.type === 'event' ? 'bg-yellow-400' : 'bg-blue-400'}
        border border-white
      `;

      // Add tooltip on hover
      const tooltip = document.createElement('div');
      tooltip.className = `
        absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1
        bg-black/90 text-white text-xs rounded whitespace-nowrap
        opacity-0 pointer-events-none transition-opacity duration-200
        z-10
      `;
      tooltip.textContent = event.name;

      markerElement.appendChild(dot);
      markerElement.appendChild(indicator);
      markerElement.appendChild(tooltip);

      // Add hover effects
      markerElement.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
        map.current!.getCanvas().style.cursor = 'pointer';
      });

      markerElement.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        map.current!.getCanvas().style.cursor = '';
      });

      // Add click handler
      markerElement.addEventListener('click', () => {
        onEventSelectRef.current(event);
      });

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(event.coordinates)
        .addTo(map.current!);

      // Store marker reference
      markersRef.current.push(marker);
      (marker as any).eventId = event.id;
      (marker as any).element = markerElement;
    });
  }, [mapLoaded]); // Only recreate when map loads

  // Update marker highlighting without affecting position
  useEffect(() => {
    if (markersRef.current.length === 0) return;

    markersRef.current.forEach((marker) => {
      const eventId = (marker as any).eventId;
      const element = (marker as any).element;
      
      if (!element) return;

      const event = mockEvents.find(e => e.id === eventId);
      if (!event) return;

      const isHighlighted = highlightedEvents.includes(eventId);
      const dot = element.querySelector('div');
      
      if (dot) {
        // Simple blinking - just make it more visible
        if (isHighlighted) {
          dot.classList.add('animate-pulse', 'ring-2', 'ring-yellow-400');
        } else {
          dot.classList.remove('animate-pulse', 'ring-2', 'ring-yellow-400');
        }
      }
    });
  }, [highlightedEvents]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-map-overlay" />
      
      {/* Map controls overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="bg-gradient-glass backdrop-blur-md rounded-xl p-2 shadow-glass">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs text-foreground/80">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-yellow-400 border border-white"></div>
              </div>
              <span>Events</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-foreground/80">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 border border-white"></div>
              </div>
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