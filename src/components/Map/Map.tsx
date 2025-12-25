'use client';

import { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const libraries: ('places' | 'drawing' | 'geometry' | 'visualization')[] = ['places'];

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  markers?: Array<{
    id?: string;
    position: { lat: number; lng: number };
    label?: string;
    title?: string;
    icon?: string;
    onClick?: () => void;
  }>;
  onMapClick?: (e: google.maps.MapMouseEvent) => void;
  onMarkerClick?: (marker: any) => void;
  height?: string;
  className?: string;
  mapContainerStyle?: React.CSSProperties;
  options?: google.maps.MapOptions;
}

export function Map({
  center,
  zoom = 15,
  markers = [],
  onMapClick,
  onMarkerClick,
  height = '400px',
  className = '',
  mapContainerStyle,
  options,
}: MapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries,
  });

  const defaultMapContainerStyle = useMemo(
    () => ({
      width: '100%',
      height,
      borderRadius: '8px',
    }),
    [height]
  );

  const defaultOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
    }),
    []
  );

  if (loadError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center p-4">
          <p className="text-red-600 font-semibold mb-2">Error loading map</p>
          <p className="text-sm text-gray-600">
            {apiKey ? 'Please check your Google Maps API key' : 'Google Maps API key is missing'}
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle || defaultMapContainerStyle}
        center={center}
        zoom={zoom}
        options={options || defaultOptions}
        onClick={onMapClick}
      >
        {markers.map((marker, index) => (
          <Marker
            key={marker.id || index}
            position={marker.position}
            label={marker.label}
            title={marker.title}
            icon={marker.icon}
            onClick={() => onMarkerClick?.(marker)}
          />
        ))}
      </GoogleMap>
    </div>
  );
}



