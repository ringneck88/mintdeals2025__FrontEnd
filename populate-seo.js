/**
 * Script to populate SEO fields in Strapi for Categories, Stores, and Regions
 *
 * IMPORTANT: You'll need to set your Strapi API token below
 * Get your API token from: Strapi Admin Panel > Settings > API Tokens > Create new API Token
 */

const API_BASE = 'https://mintdealsbackend-production.up.railway.app/api';

// TODO: Replace with your actual Strapi API token
// Get it from: Strapi Admin > Settings > API Tokens
const API_TOKEN = '8c74accdb16b21c3007340abf641d2fdb7bd311973bb12ffab3587602b5af843c59b822672ff75e882c66de39548ca6179a9d6caa3e07ba5bb73974fad3a10899958b4129a2ed8602da7f46aeaee8483854c700bb9246c961f505661821d0fb8898b8c54d25cb27ae3b45c05762b7f965d69068aa8c081924ef12566b176a52f';

// SEO data for each category
const categorySEO = {
  'thc-vapes-and-cartridges': {
    metaTitle: 'THC Vapes & Cartridges | Premium Cannabis Vape Pens | Mint Deals',
    metaDescription: 'Shop the best THC vape cartridges and pens. Find live resin, distillate, and solventless vapes at unbeatable prices. Fast-acting, discreet cannabis vaping.'
  },
  'cannabis-concentrates': {
    metaTitle: 'Cannabis Concentrates | Shatter, Wax, Live Resin | Mint Deals',
    metaDescription: 'Browse premium cannabis concentrates including shatter, wax, budder, live resin, and distillates. High-potency extracts up to 90% THC at the best prices.'
  },
  'flower': {
    metaTitle: 'Cannabis Flower | Premium Bud | Indica, Sativa, Hybrid | Mint Deals',
    metaDescription: 'Shop premium cannabis flower strains. Find top-quality indica, sativa, and hybrid buds at dispensaries near you. Fresh, potent flower at great prices.'
  },
  'pre-rolls': {
    metaTitle: 'Pre-Rolled Joints | Infused Pre-Rolls | Mint Deals',
    metaDescription: 'Convenient pre-rolled cannabis joints ready to enjoy. Shop classic, infused, and specialty pre-rolls from top brands at unbeatable prices.'
  },
  'thc-edibles': {
    metaTitle: 'THC Edibles | Gummies, Chocolates, Baked Goods | Mint Deals',
    metaDescription: 'Discover delicious THC edibles including gummies, chocolates, baked goods, and beverages. Precise dosing, long-lasting effects, and great flavors.'
  },
  'topicals': {
    metaTitle: 'Cannabis Topicals | CBD & THC Creams, Balms, Lotions | Mint Deals',
    metaDescription: 'Shop cannabis topicals for targeted relief. Find CBD and THC-infused creams, balms, lotions, and patches for pain, inflammation, and skincare.'
  },
  'tinctures': {
    metaTitle: 'Cannabis Tinctures | THC & CBD Drops | Mint Deals',
    metaDescription: 'Premium cannabis tinctures and sublingual drops. Fast-acting, precise dosing with THC, CBD, and balanced formulas. Discreet and effective.'
  },
  'sativa': {
    metaTitle: 'Sativa Strains | Energizing Cannabis | Mint Deals',
    metaDescription: 'Shop energizing sativa cannabis strains. Perfect for daytime use, creativity, and focus. Find the best sativa flower, vapes, and edibles.'
  },
  'indica': {
    metaTitle: 'Indica Strains | Relaxing Cannabis | Mint Deals',
    metaDescription: 'Browse relaxing indica cannabis strains. Ideal for evening use, stress relief, and sleep. Premium indica flower, concentrates, and edibles.'
  },
  'cannabis-hybrid': {
    metaTitle: 'Hybrid Cannabis Strains | Balanced Effects | Mint Deals',
    metaDescription: 'Explore hybrid cannabis strains combining the best of indica and sativa. Balanced effects for any time of day. Top hybrid products at great prices.'
  },
  'cannabis-capsules-and-tablets': {
    metaTitle: 'Cannabis Capsules & Tablets | THC & CBD Pills | Mint Deals',
    metaDescription: 'Convenient cannabis capsules and tablets with precise dosing. Find THC, CBD, and balanced formulas for easy, discreet consumption.'
  }
};

async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE}/categories?populate=*`);
    if (!response.ok) throw new Error(`Failed to fetch categories: ${response.status}`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function fetchStores() {
  try {
    const response = await fetch(`${API_BASE}/stores?populate=*`);
    if (!response.ok) throw new Error(`Failed to fetch stores: ${response.status}`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching stores:', error);
    return [];
  }
}

async function fetchRegions() {
  try {
    const response = await fetch(`${API_BASE}/regions?populate=*`);
    if (!response.ok) throw new Error(`Failed to fetch regions: ${response.status}`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching regions:', error);
    return [];
  }
}

async function updateCategorySEO(documentId, slug, seoData) {
  try {
    const response = await fetch(`${API_BASE}/categories/${documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({
        data: {
          SEO: seoData
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update ${slug}: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log(`✅ Updated SEO for category: ${slug}`);
    return result;
  } catch (error) {
    console.error(`❌ Error updating category ${slug}:`, error.message);
    return null;
  }
}

async function updateStoreSEO(documentId, storeName, city, state) {
  const metaTitle = `${storeName} | ${city}, ${state} Dispensary | Mint Cannabis`;
  const metaDescription = `Visit ${storeName} in ${city}, ${state}. Premium cannabis products, exclusive deals, and expert staff. Find flower, concentrates, edibles, and more.`;

  try {
    const response = await fetch(`${API_BASE}/stores/${documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({
        data: {
          seo: {
            metaTitle,
            metaDescription
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update ${storeName}: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log(`✅ Updated SEO for store: ${storeName}`);
    return result;
  } catch (error) {
    console.error(`❌ Error updating store ${storeName}:`, error.message);
    return null;
  }
}

async function updateRegionSEO(documentId, regionName, state) {
  const metaTitle = `${regionName} Cannabis Dispensaries | ${state} | Mint Deals`;
  const metaDescription = `Find the best cannabis dispensaries in ${regionName}, ${state}. Browse deals on flower, concentrates, edibles, and more from trusted retailers.`;

  try {
    const response = await fetch(`${API_BASE}/regions/${documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({
        data: {
          seo: {
            metaTitle,
            metaDescription
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update ${regionName}: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log(`✅ Updated SEO for region: ${regionName}`);
    return result;
  } catch (error) {
    console.error(`❌ Error updating region ${regionName}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting SEO population script...\n');

  // Check if API token is set
  if (API_TOKEN === 'YOUR_API_TOKEN_HERE') {
    console.error('❌ ERROR: Please set your Strapi API token in this script!');
    console.log('\nHow to get your API token:');
    console.log('1. Log in to Strapi Admin Panel');
    console.log('2. Go to Settings > API Tokens');
    console.log('3. Create new API Token with "Full access" permissions');
    console.log('4. Copy the token and paste it in this script\n');
    return;
  }

  // 1. Update Categories
  console.log('📁 Fetching categories...');
  const categories = await fetchCategories();
  console.log(`Found ${categories.length} categories\n`);

  console.log('📝 Updating category SEO fields...');
  for (const category of categories) {
    const slug = category.slug || category.attributes?.slug;
    const documentId = category.documentId;

    if (categorySEO[slug]) {
      await updateCategorySEO(documentId, slug, categorySEO[slug]);
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } else {
      console.log(`⚠️  No SEO data defined for category: ${slug}`);
    }
  }

  // 2. Update Stores
  console.log('\n🏪 Fetching stores...');
  const stores = await fetchStores();
  console.log(`Found ${stores.length} stores\n`);

  console.log('📝 Updating store SEO fields...');
  for (const store of stores) {
    const storeName = store.name || store.attributes?.name || 'Mint Cannabis';
    const address = store.address || store.attributes?.address || {};
    const city = address.city || store.city || store.attributes?.city || 'Unknown';
    const state = address.state || store.state || store.attributes?.state || 'Unknown';
    const documentId = store.documentId;

    await updateStoreSEO(documentId, storeName, city, state);
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // 3. Update Regions
  console.log('\n🗺️  Fetching regions...');
  const regions = await fetchRegions();
  console.log(`Found ${regions.length} regions\n`);

  console.log('📝 Updating region SEO fields...');
  for (const region of regions) {
    const regionName = region.name || region.attributes?.name || 'Unknown Region';
    const state = region.state || region.attributes?.state || 'Unknown';
    const documentId = region.documentId;

    await updateRegionSEO(documentId, regionName, state);
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n✨ SEO population complete!');
}

// Run the script
main().catch(console.error);
