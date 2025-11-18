/**
 * Script to fetch Google Place IDs for all stores
 * This will query the Google Places API to find Place IDs based on store names and addresses
 */

const API_KEY = 'AIzaSyDl5xx_mgt89hCcjRgbfM_qLfJrCDJUdJw';
const STRAPI_API = 'https://mintdealsbackend-production.up.railway.app/api';

async function fetchStores() {
  console.log('📍 Fetching stores from Strapi...\n');
  const response = await fetch(`${STRAPI_API}/stores?populate=*&pagination[pageSize]=100`);
  const data = await response.json();
  return data.data;
}

async function findPlaceId(storeName, address) {
  // Construct search query
  const query = `${storeName} ${address.street} ${address.city} ${address.state}`.trim();
  const encodedQuery = encodeURIComponent(query);

  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodedQuery}&inputtype=textquery&fields=place_id,name,formatted_address,rating,user_ratings_total&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.candidates && data.candidates.length > 0) {
      return {
        placeId: data.candidates[0].place_id,
        name: data.candidates[0].name,
        address: data.candidates[0].formatted_address,
        rating: data.candidates[0].rating || 'N/A',
        totalRatings: data.candidates[0].user_ratings_total || 0
      };
    }

    return null;
  } catch (error) {
    console.error(`Error fetching place ID for ${storeName}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting Google Place ID lookup...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const stores = await fetchStores();
  console.log(`Found ${stores.length} stores\n`);

  const results = [];

  for (let i = 0; i < stores.length; i++) {
    const store = stores[i];
    const storeName = store.name || 'Unknown Store';
    const address = store.address || {};

    console.log(`[${i + 1}/${stores.length}] Searching for: ${storeName}`);
    console.log(`   Address: ${address.street}, ${address.city}, ${address.state}`);

    // Add delay to avoid rate limiting (max 50 requests per second)
    await new Promise(resolve => setTimeout(resolve, 100));

    const placeData = await findPlaceId(storeName, address);

    if (placeData) {
      console.log(`   ✅ Found: ${placeData.name}`);
      console.log(`   📍 Place ID: ${placeData.placeId}`);
      console.log(`   ⭐ Rating: ${placeData.rating} (${placeData.totalRatings} reviews)`);
      console.log(`   📮 ${placeData.address}`);

      results.push({
        documentId: store.documentId,
        id: store.id,
        name: storeName,
        slug: store.slug,
        placeId: placeData.placeId,
        googleName: placeData.name,
        googleAddress: placeData.address,
        rating: placeData.rating,
        totalRatings: placeData.totalRatings
      });
    } else {
      console.log(`   ❌ Not found`);
      results.push({
        documentId: store.documentId,
        id: store.id,
        name: storeName,
        slug: store.slug,
        placeId: null,
        error: 'Not found'
      });
    }

    console.log('');
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 SUMMARY\n');

  const found = results.filter(r => r.placeId);
  const notFound = results.filter(r => !r.placeId);

  console.log(`✅ Found: ${found.length}`);
  console.log(`❌ Not found: ${notFound.length}`);
  console.log(`📈 Success rate: ${Math.round((found.length / results.length) * 100)}%\n`);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📋 PLACE IDs BY STORE\n');

  results.forEach(result => {
    if (result.placeId) {
      console.log(`${result.name}`);
      console.log(`  Document ID: ${result.documentId}`);
      console.log(`  Place ID: ${result.placeId}`);
      console.log(`  Rating: ${result.rating} ⭐ (${result.totalRatings} reviews)`);
      console.log('');
    }
  });

  if (notFound.length > 0) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  STORES NOT FOUND\n');
    notFound.forEach(result => {
      console.log(`${result.name} (${result.slug})`);
    });
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('💾 NEXT STEPS:\n');
  console.log('1. Review the Place IDs above');
  console.log('2. For each store, update the google_place_id field in Strapi');
  console.log('3. You can copy the documentId and Place ID from above');
  console.log('4. Or use the Strapi bulk update API (let me know if you need help)\n');

  // Save to JSON file for easy reference
  const fs = await import('fs');
  const path = await import('path');
  const { fileURLToPath } = await import('url');
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const outputPath = path.join(__dirname, 'place-ids-output.json');

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`📄 Full results saved to: ${outputPath}\n`);
}

main().catch(console.error);
