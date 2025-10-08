/**
 * Generate SQL UPDATE statements for store coordinates
 * You can run these directly in your database console
 */

const STORE_COORDINATES = {
  'mint-cannabis-buckeye': { lat: 33.4289, lon: -112.6387 },
  'mint-cannabis-75th-ave-phoenix': { lat: 33.5008, lon: -112.1413 },
  'mint-cannabis-mesa': { lat: 33.3940, lon: -111.7890 },
  'mint-cannabis-tempe': { lat: 33.4145, lon: -111.9192 },
  'mint-cannabis-el-mirage': { lat: 33.6067, lon: -112.3250 },
  'mint-cannabis-phoenix': { lat: 33.5097, lon: -112.0429 },
  'mint-cannabis-northern-phoenix': { lat: 33.6182, lon: -111.9949 },
  'mint-cannabis-scottsdale': { lat: 33.4942, lon: -111.9261 },
  'mint-cannabis-las-vegas-strip-dispensary': { lat: 36.1147, lon: -115.1728 },
  'mint-cannabis-west-las-vegas-dispensary': { lat: 36.1699, lon: -115.2398 },
  'mint-cannabis-monroe-mi-dispensary': { lat: 41.9165, lon: -83.3977 },
  'mint-cannabis-coldwater-mi-dispensary': { lat: 41.9403, lon: -85.0005 },
  'mint-cannabis-portage-mi-dispensary': { lat: 42.2011, lon: -85.5800 },
  'mint-cannabis-kalamazoo-mi-dispensary': { lat: 42.2917, lon: -85.5872 },
  'mint-cannabis-new-buffalo-mi-dispensary': { lat: 41.7964, lon: -86.7442 },
  'mint-cannabis-roseville-mi-dispensary': { lat: 42.4973, lon: -82.9371 },
  'mint-cannabis-st-peters-dispensary': { lat: 38.7875, lon: -90.6298 },
  'mint-cannabis-willowbrook-il-dispensary': { lat: 41.7697, lon: -87.9395 },
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
};

console.log('-- SQL UPDATE statements for store coordinates\n');
console.log('-- Copy and paste these into your database console (Railway or wherever your DB is hosted)\n');

for (const [slug, coords] of Object.entries(STORE_COORDINATES)) {
  const geoJson = JSON.stringify({ lat: coords.lat, lon: coords.lon });
  console.log(`UPDATE stores SET geo = '${geoJson}' WHERE slug = '${slug}';`);
}

console.log('\n-- Done! Run these SQL statements to update all store coordinates.');
