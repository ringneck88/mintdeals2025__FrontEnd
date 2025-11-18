/**
 * Bulk update Strapi stores with Google Place IDs
 * Updates the google_place_id field for stores that were successfully matched
 */

const STRAPI_API = 'https://mintdealsbackend-production.up.railway.app/api';
const API_TOKEN = 'd7374d816e25ffab31e64beda17e81c26030002ea8e4f1db6437d0ae7d9e8a5a33933ab966e1758331eee38f6e6840084fe2bdef90774a16c45f943bf21c62df72c1bb0be24c3a719ee3403aff5a416ca93311154671b9e926cd1fd25796020219590a77616ba07cacfcf070beedddfe6f4d10eda1113e319312e15e667ed640';

// Place IDs from the search results (excluding Orlando, Gainesville, Miami - incorrect matches)
const placeIdMappings = [
  { documentId: 'mp200avvvkk4qdk3uo72sgb9', name: 'Mint 75th Ave Phoenix', placeId: 'ChIJK6eFOYIVK4cR79w5IQzpnvY' },
  { documentId: 'byvqdonk97qdwe2h5f2xebzj', name: 'Mint El Mirage AZ', placeId: 'ChIJswLn4glFK4cRib5OVjcokG0' },
  { documentId: 'ti3ax0c61hhs86xhflelrx8c', name: 'Mint Kalamazoo MI', placeId: 'ChIJfUPLzGidF4gRPUjhMfldQFI' },
  { documentId: 'wyhmc8j7wkhwti8e6cugubi0', name: 'Mint Las Vegas Strip NV', placeId: 'ChIJa5U9eDbFyIARq2PzvG4tFbU' },
  { documentId: 'bq5t0w46eepzkds10atdgmrq', name: 'Mint Monroe MI', placeId: 'ChIJwTUEYrRvO4gRw9bxFGupXNs' },
  { documentId: 'ch6z7yorcyqggcjspizqrpci', name: 'Mint Portage MI', placeId: 'ChIJtRquPfOdF4gRq3koh2NIvDI' },
  { documentId: 'ogfxqu62yb9ut9ukzmatiok9', name: 'Mint Phoenix AZ', placeId: 'ChIJv6QFt_VxK4cRVZo2EJPceKo' },
  { documentId: 'yz1lwmcntgh1y5znq1ac4wa4', name: 'Mint Mesa AZ', placeId: 'ChIJOblFLG6oK4cRH65bbgEiMYk' },
  { documentId: 'aei1oqu0zgvktwnejfsz5i7n', name: 'Mint Tempe AZ', placeId: 'ChIJ2U0oJPgFK4cRXIiSAs99xUQ' },
  { documentId: 'i62lemedu97ky11jp4o31ug5', name: 'Mint West Las Vegas NV', placeId: 'ChIJE2le4jTHyIARWNmWGTTpYBs' },
  { documentId: 'mzuco2x996ably05ojkjeqxi', name: 'Mint St. Peters MO', placeId: 'ChIJr1zZzYbX3ocRzwtwxZoXc9c' },
  { documentId: 'ue9jfphqhqrt5k7uplbikcze', name: 'Mint Buckeye AZ', placeId: 'ChIJ_wQIfw1JK4cR-BhzI0obD68' },
  { documentId: 'm5yv0xgf7o5s7hhpo7mja1jz', name: 'Mint Bonita Springs FL', placeId: 'ChIJ5xXsqDcZ24gR9oVp4hFgw54' },
  { documentId: 'n37xrz8tqaty9a9j60ck44fz', name: 'Mint Bradenton FL', placeId: 'ChIJpUhJmfcXw4gRqMPv05J5uVg' },
  { documentId: 'erjiglnah2refr3do1d0juzq', name: 'Mint Cape Coral FL', placeId: 'ChIJtQoC_z5B24gRn6yxKB_WmnU' },
  { documentId: 'qr8ck57qddm7wx32viss7ayh', name: 'Mint Delray Beach FL', placeId: 'ChIJW9d4xacf2YgR74TB_vvqZ1I' },
  { documentId: 'a8h4bnnx8ipf14ddgrefrdrr', name: 'Mint Jacksonville FL', placeId: 'ChIJn1gQEw215YgRTKOfp1ioxVo' },
  { documentId: 'f1kh8vf9j6w8zaet1vayykv0', name: 'Mint Longwood FL', placeId: 'ChIJfRxis3tz54gRcZfgKZqMAMU' },
  { documentId: 'r08wu4tpyuc9unl5bw4265kt', name: 'Mint Melbourne FL', placeId: 'ChIJ5ajyAqYF3ogRzbxzc7RGWxU' },
  // SKIPPED: Orlando, Gainesville, Miami - incorrect matches
  { documentId: 'x5rbpkt36jyyhb26sd92ukp1', name: 'Mint Roseville MI', placeId: 'ChIJecilbVnZJIgRAZpfBgqzQ9w' },
  { documentId: 'dh5ng4lz79b97nleyo6hwtg3', name: 'Mint Sarasota FL', placeId: 'ChIJO5tTb3RDw4gRf_5wsiY32ow' },
  { documentId: 'ek2kvoe6sz2v81fkl0yrctku', name: 'Mint St. Augustine FL', placeId: 'ChIJ_xc1f_on5IgR7JAZDYVWeyE' },
  { documentId: 'pzn841yqnmd7d0ydf85phmv3', name: 'Mint Stuart FL', placeId: 'ChIJL1FwtnDd3ogRh9JbJH01vEY' },
  { documentId: 'ggmplzq05kp6sio8nwj8l661', name: 'Mint Brandon FL', placeId: 'ChIJxfEBqQPPwogR15UYHsJmwYE' },
  { documentId: 'q475f8v34xoxqzpej2ygk1xj', name: 'Mint Coldwater MI', placeId: 'ChIJP16IU9jXF4gRkixENP1Jq_8' },
  { documentId: 'snmtgtht40799m1qf3sr8wu1', name: 'Mint New Buffalo MI', placeId: 'ChIJK1Geda0FEYgR5nT98ul1EeQ' },
  { documentId: 'p4hq6mn2cmxvbnm2fbuj4r10', name: 'Mint Northern Phoenix', placeId: 'ChIJueJGRHFtK4cRNqPLQEpHEPc' },
  { documentId: 'g9202obnee8ss1zq782om8rr', name: 'Mint Scottsdale AZ', placeId: 'ChIJ-U6WbwALK4cR0PLGjn0SDYo' },
  { documentId: 'pnk0h6w815o5aqrvqmg7jklj', name: 'Mint Willowbrook IL', placeId: 'ChIJ7-pHlOpPDogRWZ4qd7tgxSc' },
];

async function updateStore(documentId, name, placeId) {
  const url = `${STRAPI_API}/stores/${documentId}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({
        data: {
          google_place_id: placeId
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🚀 Starting Strapi bulk update...\n');
  console.log(`📊 Updating ${placeIdMappings.length} stores with Google Place IDs\n`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const results = {
    success: [],
    failed: []
  };

  for (let i = 0; i < placeIdMappings.length; i++) {
    const { documentId, name, placeId } = placeIdMappings[i];

    console.log(`[${i + 1}/${placeIdMappings.length}] Updating: ${name}`);
    console.log(`   Document ID: ${documentId}`);
    console.log(`   Place ID: ${placeId}`);

    // Add delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 200));

    const result = await updateStore(documentId, name, placeId);

    if (result.success) {
      console.log(`   ✅ Updated successfully\n`);
      results.success.push(name);
    } else {
      console.log(`   ❌ Failed: ${result.error}\n`);
      results.failed.push({ name, error: result.error });
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 UPDATE SUMMARY\n');
  console.log(`✅ Successfully updated: ${results.success.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`📈 Success rate: ${Math.round((results.success.length / placeIdMappings.length) * 100)}%\n`);

  if (results.failed.length > 0) {
    console.log('\n⚠️  FAILED UPDATES:\n');
    results.failed.forEach(({ name, error }) => {
      console.log(`${name}: ${error}`);
    });
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('⚠️  MANUAL UPDATES NEEDED (3 stores with incorrect matches):\n');
  console.log('These stores need Place IDs manually added in Strapi:\n');
  console.log('1. Mint Orlando FL (p567tho8y2c7rfo8t7za9zxa)');
  console.log('2. Mint Gainesville FL (zo49pa7yw8s1cnixhnm8ra6m)');
  console.log('3. Mint Miami FL (lpyg9g7wf6yi50dbv4ws6wso)\n');
  console.log('Search for these stores on Google Maps and add their Place IDs manually.\n');
}

main().catch(console.error);
