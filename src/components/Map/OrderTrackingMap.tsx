'use client';

import { useState, useEffect } from 'react';
import { Map } from './Map';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, MapPin, Navigation } from 'lucide-react';

interface OrderTrackingMapProps {
  restaurantLocation: { lat: number; lng: number; address?: string };
  deliveryLocation: { lat: number; lng: number; address?: string };
  riderLocation?: { lat: number; lng: number };
  orderStatus?: string;
  estimatedDeliveryTime?: string;
  className?: string;
}

export function OrderTrackingMap({
  restaurantLocation,
  deliveryLocation,
  riderLocation,
  orderStatus,
  estimatedDeliveryTime,
  className = '',
}: OrderTrackingMapProps) {
  const [mapCenter, setMapCenter] = useState({
    lat: (restaurantLocation.lat + deliveryLocation.lat) / 2,
    lng: (restaurantLocation.lng + deliveryLocation.lng) / 2,
  });

  const [mapZoom, setMapZoom] = useState(13);

  useEffect(() => {
    // Adjust map center and zoom based on available locations
    if (riderLocation) {
      setMapCenter({
        lat: (restaurantLocation.lat + deliveryLocation.lat + riderLocation.lat) / 3,
        lng: (restaurantLocation.lng + deliveryLocation.lng + riderLocation.lng) / 3,
      });
      setMapZoom(12);
    } else {
      setMapCenter({
        lat: (restaurantLocation.lat + deliveryLocation.lat) / 2,
        lng: (restaurantLocation.lng + deliveryLocation.lng) / 2,
      });
      setMapZoom(13);
    }
  }, [restaurantLocation, deliveryLocation, riderLocation]);

  const markers = [
    {
      id: 'restaurant',
      position: restaurantLocation,
      title: 'Restaurant',
      label: 'R',
      icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    },
    {
      id: 'delivery',
      position: deliveryLocation,
      title: 'Delivery Address',
      label: 'D',
      icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    },
  ];

  if (riderLocation) {
    markers.push({
      id: 'rider',
      position: riderLocation,
      title: 'Rider Location',
      label: '🚴',
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    });
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Navigation className="w-5 h-5 text-orange-500" />
          Order Tracking
        </h3>
        {orderStatus && (
          <Badge className="mb-2" variant="outline">
            {orderStatus}
          </Badge>
        )}
        {estimatedDeliveryTime && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
            <Clock className="w-4 h-4" />
            <span>Estimated delivery: {estimatedDeliveryTime}</span>
          </div>
        )}
      </div>

      <Map
        center={mapCenter}
        zoom={mapZoom}
        markers={markers}
        height="400px"
        options={{
          mapTypeControl: false,
          streetViewControl: false,
        }}
      />

      <div className="mt-4 space-y-2">
        <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
          <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-red-700">Restaurant</p>
            <p className="text-sm text-gray-600">{restaurantLocation.address || 'Restaurant location'}</p>
          </div>
        </div>
        
        {riderLocation && (
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <Navigation className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-blue-700">Rider Location</p>
              <p className="text-sm text-gray-600">Rider is on the way</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
          <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-green-700">Delivery Address</p>
            <p className="text-sm text-gray-600">{deliveryLocation.address || 'Delivery location'}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}



