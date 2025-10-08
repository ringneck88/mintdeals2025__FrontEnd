/**
 * Update store coordinates in production Strapi
 *
 * IMPORTANT: You need to set STRAPI_API_TOKEN environment variable
 * Get the token from: Strapi Admin → Settings → API Tokens → Create new token
 *
 * Usage:
 * export STRAPI_API_TOKEN="your-token-here"
 * node update-store-coordinates.js
 */

const API_BASE = 'https://mintdealsbackend-production.up.railway.app/api';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

// Store coordinates mapping
const STORE_COORDINATES = {
  'mint-cannabis-buckeye': { lat: 33.4289, lon: -112.6387 },
  'mint-cannabis-75th-ave-phoenix': { lat: 33.5008, lon: -112.1413 },
  'mint-cannabis-mesa': { lat: 33.3940, lon: -111.7890 },
  'mint-cannabis-tempe': { lat: 33.4145, lon: -111.9192 },
  'mint-cannabis-el-mirage': { lat: 33.6067, lon: -112.3250 },
  'mint-cannabis-phoenix': { lat: 33.5097, lon: -112.0429 },
  'mint-cannabis-northern-phoenix': { lat: 33.6182, lon: -111.9949 },

  // Nevada stores
  'mint-cannabis-las-vegas-strip-dispensary': { lat: 36.1147, lon: -115.1728 },
  'mint-cannabis-west-las-vegas-dispensary': { lat: 36.1699, lon: -115.2398 },

  // Michigan stores
  'mint-cannabis-monroe-mi-dispensary': { lat: 41.9165, lon: -83.3977 },
  'mint-cannabis-coldwater-mi-dispensary': { lat: 41.9403, lon: -85.0005 },
  'mint-cannabis-portage-mi-dispensary': { lat: 42.2011, lon: -85.5800 },
  'mint-cannabis-kalamazoo-mi-dispensary': { lat: 42.2917, lon: -85.5872 },
  'mint-cannabis-new-buffalo-mi-dispensary': { lat: 41.7964, lon: -86.7442 },
  'mint-cannabis-roseville-mi-dispensary': { lat: 42.4973, lon: -82.9371 },

  // Missouri store
  'mint-cannabis-st-peters-dispensary': { lat: 38.7875, lon: -90.6298 },

  // Illinois store
  'mint-cannabis-willowbrook-il-dispensary': { lat: 41.7697, lon: -87.9395 },

  // Florida stores - These are approximate, please verify exact addresses
  'mint-cannabis-bradenton-fl-dispensary': { lat: 27.4989, lon: -82.5748 },
  'mint-cannabis-cape-coral-fl-dispensary': { lat: 26.5629, lon: -81.9495 },
  'mint-cannabis-delray-beach-fl-dispensary': { lat: 26.4615, lon: -80.0728 },
  'mint-cannabis-gainesville-fl-dispensary': { lat: 29.6516, lon: -82.3248 },
  'mint-cannabis-jacksonville-fl-dispensary': { lat: 30.3322, lon: -81.6557 },
  'mint-cannabis-longwood-fl-dispensary': { lat: 28.7033, lon: -81.3384 },
  'mint-cannabis-melbourne-fl-dispensary': { lat: 28.0836, lon: -80.6081 },
  'mint-cannabis-miami-fl-dispensary': { lat: 25.7617, lon: -80.1918 },
  'mint-cannabis-orlando-fl-dispensary': { lat: 28.5383, lon: -81.3792 },
  'mint-cannabis-sarasota-fl-dispensary': { lat: 27.3364, lon: -82.5307 },
  'mint-cannabis-st-augustine-fl-dispensary': { lat: 29.9012, lon: -81.3124 },
  'mint-cannabis-stuart-fl-dispensary': { lat: 27.1973, lon: -80.2528 },
  'mint-cannabis-bonita-springs-fl-dispensary': { lat: 26.3398, lon: -81.7787 },
  'mint-cannabis-brandon-fl-dispensary': { lat: 27.9378, lon: -82.2859 },
  'mint-cannabis-scottsdale': { lat: 33.4942, lon: -111.9261 },
};

async function updateStoreCoordinates() {
  if (!API_TOKEN) {
    console.log('❌ ERROR: STRAPI_API_TOKEN environment variable not set!');
    console.log('');
    console.log('To get an API token:');
    console.log('1. Go to Strapi Admin → Settings → API Tokens');
    console.log('2. Click "Create new API Token"');
    console.log('3. Name: "Coordinate Update Script"');
    console.log('4. Token type: Full access');
    console.log('5. Copy the token');
    console.log('6. Run: export STRAPI_API_TOKEN="your-token-here"');
    console.log('7. Then run this script again');
    return;
  }

  console.log('🚀 Updating store coordinates in production...\n');

  try {
    // Test the token first
    console.log('🔑 Testing API token...');
    const testResponse = await fetch(`${API_BASE}/stores?pagination[pageSize]=1`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });

    console.log('   Response status:', testResponse.status);

    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.log('❌ API token test failed!');
      console.log('   Status:', testResponse.status);
      console.log('   Error:', errorText);
      console.log('\nPlease check:');
      console.log('1. Token has "Full access" or at least "find" and "update" permissions for stores');
      console.log('2. Token is active and not expired');
      console.log('3. Token type is correct (should be API Token, not Transfer Token)');
      return;
    }

    console.log('✅ API token is valid\n');

    // Fetch all stores
    const response = await fetch(`${API_BASE}/stores?pagination[pageSize]=100`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });

    if (!response.ok) {
      console.log('❌ Failed to fetch stores:', response.status);
      return;
    }

    const data = await response.json();
    const stores = data.data || [];

    console.log(`✅ Found ${stores.length} stores\n`);

    let updated = 0;
    let skipped = 0;
    let failed = 0;

    // Update each store
    for (const store of stores) {
      const coordinates = STORE_COORDINATES[store.slug];

      if (!coordinates) {
        console.log(`⚠️  ${store.name} - No coordinates defined, skipping`);
        skipped++;
        continue;
      }

      console.log(`\n📍 Updating ${store.name}`);
      console.log(`   Coordinates: ${coordinates.lat}, ${coordinates.lon}`);

      try {
        const updateResponse = await fetch(`${API_BASE}/stores/${store.documentId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              geo: {
                lat: coordinates.lat,
                lon: coordinates.lon
              }
            }
          })
        });

        if (updateResponse.ok) {
          console.log(`   ✅ Updated successfully`);
          updated++;
        } else {
          const errorText = await updateResponse.text();
          console.log(`   ❌ Failed:`, updateResponse.status, errorText);
          failed++;
        }
      } catch (error) {
        console.log(`   ❌ Error:`, error.message);
        failed++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n\n📊 Summary:');
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⚠️  Skipped: ${skipped}`);
    console.log(`   ❌ Failed: ${failed}`);

  } catch (error) {
    console.error('❌ Script error:', error.message);
  }
}

// Run the script
updateStoreCoordinates();
