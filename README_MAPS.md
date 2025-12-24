# Google Maps Integration

Google Maps has been integrated into the Lazeezos food delivery application with placeholder API key configuration.

## Setup Instructions

1. **Get a Google Maps API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the following APIs:
     - Maps JavaScript API
     - Places API
     - Geocoding API
     - Directions API (optional, for route calculation)
   - Create credentials (API Key)
   - Restrict the API key to your domain for security

2. **Add API Key to Environment Variables:**
   - Open `.env.local` file in the root directory
   - Replace the placeholder API key with your actual key:
     ```
     NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
     ```

3. **Restart the Development Server:**
   ```bash
   npm run dev
   ```

## Features Integrated

### 1. Address Picker Component (`AddressPicker`)
- **Location:** `src/components/Map/AddressPicker.tsx`
- **Features:**
  - Google Places Autocomplete for address search
  - Interactive map for address selection
  - Click on map to set address
  - Reverse geocoding (coordinates to address)
- **Used in:** Checkout page (address dialog)

### 2. Order Tracking Map (`OrderTrackingMap`)
- **Location:** `src/components/Map/OrderTrackingMap.tsx`
- **Features:**
  - Shows restaurant location
  - Shows delivery address
  - Shows rider location (when available)
  - Real-time order status
  - Estimated delivery time
- **Used in:** Order detail page (`/orders/[id]`)

### 3. Base Map Component (`Map`)
- **Location:** `src/components/Map/Map.tsx`
- **Features:**
  - Reusable Google Maps component
  - Customizable markers
  - Click handlers
  - Custom styling options

## Current Implementation

### Checkout Page
- Address picker with map integration in the "Add/Edit Address" dialog
- Users can search for addresses or click on the map to select a location
- Map shows selected location with a marker

### Order Tracking Page
- Interactive map showing:
  - Restaurant location (red marker)
  - Delivery address (green marker)
  - Rider location (blue marker, when available)
- Order status and estimated delivery time displayed above the map

## Placeholder/Testing Mode

Currently using placeholder coordinates (Karachi, Pakistan):
- Default latitude: 24.8607
- Default longitude: 67.0011

The map will still load and function, but locations will default to Karachi until:
1. Real coordinates are stored in the database
2. Geocoding is implemented to convert addresses to coordinates

## Future Enhancements

1. **Store Coordinates in Database:**
   - Add `latitude` and `longitude` fields to Address model
   - Geocode addresses when saved
   - Store restaurant coordinates

2. **Real-time Rider Tracking:**
   - Integrate with rider location updates
   - WebSocket or polling for live location updates
   - Show route between restaurant and delivery address

3. **Distance Calculation:**
   - Use Google Directions API to calculate delivery distance
   - Dynamic delivery fee based on distance
   - Estimated delivery time calculation

4. **Delivery Zones:**
   - Visualize restaurant delivery zones on map
   - Check if address is within delivery zone
   - Show coverage areas

## API Key Security

⚠️ **Important:** The API key is exposed in the client-side code (NEXT_PUBLIC prefix). To secure it:

1. **Restrict API Key:**
   - In Google Cloud Console, restrict the key to:
     - HTTP referrers (your domain)
     - Specific APIs only (Maps JavaScript, Places, Geocoding)

2. **Consider Server-Side Geocoding:**
   - For sensitive operations, perform geocoding on the server
   - Keep API key on server-side only

## Troubleshooting

### Map Not Loading
- Check if API key is set in `.env.local`
- Verify API key is not restricted incorrectly
- Check browser console for errors
- Ensure required APIs are enabled in Google Cloud Console

### Autocomplete Not Working
- Verify Places API is enabled
- Check API key restrictions
- Ensure `libraries: ['places']` is included

### Map Shows Error Message
- API key might be invalid or expired
- Check API key restrictions
- Verify billing is enabled in Google Cloud Console

