'use client';

import { useState, useRef, useEffect } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { MapPin, Search } from 'lucide-react';
import { Map } from './Map';

interface AddressPickerProps {
  value: string;
  onChange: (address: string, location?: { lat: number; lng: number }) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  showMap?: boolean;
  mapHeight?: string;
}

export function AddressPicker({
  value,
  onChange,
  label = 'Address',
  placeholder = 'Search for an address...',
  required = false,
  className = '',
  showMap = true,
  mapHeight = '300px',
}: AddressPickerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: ['places'],
  });

  useEffect(() => {
    if (isLoaded) {
      setIsMapLoaded(true);
    }
  }, [isLoaded]);

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      
      if (place.formatted_address) {
        onChange(place.formatted_address, {
          lat: place.geometry?.location?.lat() || 0,
          lng: place.geometry?.location?.lng() || 0,
        });
        
        if (place.geometry?.location) {
          setLocation({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        }
      }
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      
      // Reverse geocode to get address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          onChange(results[0].formatted_address, { lat, lng });
          setLocation({ lat, lng });
        }
      });
    }
  };

  if (loadError) {
    return (
      <div className={className}>
        <Label htmlFor="address">{label} {required && <span className="text-red-500">*</span>}</Label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="address"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pl-10"
            required={required}
          />
        </div>
        <p className="text-sm text-red-600 mt-1">
          Map service unavailable. Please enter address manually.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={className}>
        <Label htmlFor="address">{label} {required && <span className="text-red-500">*</span>}</Label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="address"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pl-10"
            required={required}
            disabled
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">Loading map services...</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Label htmlFor="address">{label} {required && <span className="text-red-500">*</span>}</Label>
      <div className="relative mt-2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
        {isMapLoaded ? (
          <Autocomplete
            onLoad={(autocomplete) => {
              autocompleteRef.current = autocomplete;
            }}
            onPlaceChanged={handlePlaceSelect}
            options={{
              types: ['address'],
              componentRestrictions: { country: 'pk' }, // Pakistan by default, can be made configurable
            }}
          >
            <Input
              id="address"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="pl-10"
              required={required}
            />
          </Autocomplete>
        ) : (
          <Input
            id="address"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pl-10"
            required={required}
          />
        )}
      </div>
      
      {showMap && location && (
        <div className="mt-4">
          <Map
            center={location}
            zoom={15}
            markers={[
              {
                position: location,
                title: value,
              },
            ]}
            onMapClick={handleMapClick}
            height={mapHeight}
          />
        </div>
      )}
    </div>
  );
}

