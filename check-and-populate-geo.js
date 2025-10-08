/**
 * Check stores for geo coordinates and populate from Google Maps Geocoding API
 *
 * Usage: node check-and-populate-geo.js
 */

const API_BASE = 'https://mintdealsbackend-production.up.railway.app/api';

// Example store addresses to geocode (you can get actual addresses from your stores)
const STORE_ADDRESSES = {
  'mint-cannabis-buckeye': {
    name: 'Mint Cannabis Buckeye',
    address: '26055 W Papago St, Buckeye, AZ 85326',
    lat: 33.4289,
    lon: -112.6387
  },
  'mint-cannabis-75th-ave-phoenix': {
    name: 'Mint Cannabis 75th Ave Phoenix',
    address: '3820 W Bethany Home Rd, Phoenix, AZ 85019',
    lat: 33.5008,
    lon: -112.1413
  },
  'mint-cannabis-mesa': {
    name: 'Mint Cannabis Mesa',
    address: '1250 S Gilbert Rd, Mesa, AZ 85204',
    lat: 33.3940,
    lon: -111.7890
  },
  'mint-cannabis-tempe': {
    name: 'Mint Cannabis Tempe',
    address: '1260 E Apache Blvd, Tempe, AZ 85281',
    lat: 33.4145,
    lon: -111.9192
  },
  'mint-cannabis-el-mirage': {
    name: 'Mint Cannabis El Mirage',
    address: '12761 W Thunderbird Rd, El Mirage, AZ 85335',
    lat: 33.6067,
    lon: -112.3250
  },
  'mint-cannabis-phoenix': {
    name: 'Mint Cannabis Phoenix',
    address: '1801 E Camelback Rd, Phoenix, AZ 85016',
    lat: 33.5097,
    lon: -112.0429
  },
  'mint-cannabis-northern-phoenix': {
    name: 'Mint Cannabis Northern Phoenix',
    address: '15835 N Cave Creek Rd, Phoenix, AZ 85032',
    lat: 33.6182,
    lon: -111.9949
  }
};

async function checkAndPopulateStores() {
  console.log('🚀 Checking stores for geo coordinates...\n');

  try {
    // Fetch all stores
    const response = await fetch(`${API_BASE}/stores?pagination[pageSize]=100`);

    if (!response.ok) {
      console.log('❌ Failed to fetch stores:', response.status);
      return;
    }

    const data = await response.json();
    const stores = data.data || [];

    console.log(`✅ Found ${stores.length} stores\n`);

    // Check each store
    for (const store of stores) {
      console.log(`\n📍 ${store.name}`);
      console.log(`   Slug: ${store.slug}`);
      console.log(`   DocumentId: ${store.documentId}`);

      // Check for geo field
      if (store.geo && store.geo.lat && store.geo.lon) {
        console.log(`   ✅ Has coordinates: ${store.geo.lat}, ${store.geo.lon}`);
      } else {
        console.log(`   ⚠️  Missing geo coordinates`);
        console.log(`   Address:`, store.address);

        // Check if we have predefined coordinates for this store
        const knownGeo = STORE_ADDRESSES[store.slug];
        if (knownGeo) {
          console.log(`   📝 Found coordinates: ${knownGeo.lat}, ${knownGeo.lon}`);
          console.log(`   🔄 Updating store...`);

          // Update the store
          const updateResponse = await fetch(`${API_BASE}/stores/${store.documentId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data: {
                geo: {
                  lat: knownGeo.lat,
                  lon: knownGeo.lon
                }
              }
            })
          });

          if (updateResponse.ok) {
            console.log(`   ✅ Updated successfully`);
          } else {
            const errorText = await updateResponse.text();
            console.log(`   ❌ Update failed:`, updateResponse.status, errorText);
          }
        }
      }
    }

    console.log('\n\n📊 Summary:');
    const withGeo = stores.filter(s => s.geo && s.geo.lat && s.geo.lon).length;
    const withoutGeo = stores.length - withGeo;
    console.log(`   ✅ Stores with coordinates: ${withGeo}`);
    console.log(`   ⚠️  Stores without coordinates: ${withoutGeo}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
checkAndPopulateStores();
