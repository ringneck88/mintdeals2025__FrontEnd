/**
 * Geocode store addresses and update Strapi with lat/long coordinates
 *
 * This script fetches all stores, geocodes their addresses using a free API,
 * and updates the geo field in Strapi with latitude and longitude.
 */

const API_BASE = 'https://mintdealsbackend-production.up.railway.app/api';

// Helper function to geocode an address using Nominatim (free, no API key needed)
async function geocodeAddress(address) {
  if (!address || typeof address !== 'object') {
    console.log('⚠️  Invalid address format:', address);
    return null;
  }

  // Build address string
  const parts = [];
  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.zipCode) parts.push(address.zipCode);
  if (address.country) parts.push(address.country);

  const addressString = parts.join(', ');

  if (!addressString) {
    console.log('⚠️  Empty address');
    return null;
  }

  console.log(`🔍 Geocoding: ${addressString}`);

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressString)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MintDeals-Geocoder/1.0'
      }
    });

    if (!response.ok) {
      console.log('❌ Geocoding API error:', response.status);
      return null;
    }

    const results = await response.json();

    if (results && results.length > 0) {
      const { lat, lon } = results[0];
      console.log(`✅ Found coordinates: ${lat}, ${lon}`);
      return {
        lat: parseFloat(lat),
        lon: parseFloat(lon)
      };
    } else {
      console.log('⚠️  No results found');
      return null;
    }
  } catch (error) {
    console.log('❌ Geocoding error:', error.message);
    return null;
  }
}

// Main function to process all stores
async function geocodeAllStores() {
  console.log('🚀 Starting geocoding process...\n');

  // Fetch all stores
  console.log('📥 Fetching stores from API...');
  const storesResponse = await fetch(`${API_BASE}/stores?pagination[pageSize]=100`);
  const storesData = await storesResponse.json();
  const stores = storesData.data || [];

  console.log(`✅ Found ${stores.length} stores\n`);

  // Filter stores that need geocoding
  const storesToGeocode = stores.filter(store => {
    const hasGeo = store.geo && store.geo.lat && store.geo.lon;
    return !hasGeo && store.address;
  });

  console.log(`📍 ${storesToGeocode.length} stores need geocoding\n`);

  if (storesToGeocode.length === 0) {
    console.log('✅ All stores already have coordinates!');
    return;
  }

  // Process each store
  for (let i = 0; i < storesToGeocode.length; i++) {
    const store = storesToGeocode[i];
    console.log(`\n[${i + 1}/${storesToGeocode.length}] Processing: ${store.name}`);

    // Geocode the address
    const geo = await geocodeAddress(store.address);

    if (geo) {
      console.log(`📝 Updating store ${store.documentId} with coordinates...`);

      // Update the store in Strapi
      try {
        const updateResponse = await fetch(`${API_BASE}/stores/${store.documentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              geo: geo
            }
          })
        });

        if (updateResponse.ok) {
          console.log('✅ Store updated successfully');
        } else {
          console.log('❌ Failed to update store:', updateResponse.status);
        }
      } catch (error) {
        console.log('❌ Update error:', error.message);
      }
    }

    // Rate limiting: wait 1 second between requests (Nominatim requirement)
    if (i < storesToGeocode.length - 1) {
      console.log('⏳ Waiting 1 second before next request...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n✅ Geocoding complete!');
}

// Run the script
geocodeAllStores().catch(error => {
  console.error('❌ Script error:', error);
  process.exit(1);
});
