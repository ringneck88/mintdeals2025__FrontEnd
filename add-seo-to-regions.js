/**
 * Script to add SEO component field to Region content type in Strapi
 */

const API_BASE = 'https://mintdealsbackend-production.up.railway.app';
const API_TOKEN = '8c74accdb16b21c3007340abf641d2fdb7bd311973bb12ffab3587602b5af843c59b822672ff75e882c66de39548ca6179a9d6caa3e07ba5bb73974fad3a10899958b4129a2ed8602da7f46aeaee8483854c700bb9246c961f505661821d0fb8898b8c54d25cb27ae3b45c05762b7f965d69068aa8c081924ef12566b176a52f';

async function addSeoToRegions() {
  try {
    console.log('📁 Fetching current Region schema...');

    // Get current schema
    const getResponse = await fetch(`${API_BASE}/api/content-type-builder/content-types/api::region.region`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!getResponse.ok) {
      throw new Error(`Failed to fetch schema: ${getResponse.status}`);
    }

    const schemaData = await getResponse.json();
    console.log('✅ Current schema fetched');

    // Add SEO field to attributes
    const updatedSchema = {
      ...schemaData.data.schema,
      attributes: {
        ...schemaData.data.schema.attributes,
        seo: {
          type: 'component',
          component: 'seo.meta',
          repeatable: false
        }
      }
    };

    console.log('\n📝 Adding SEO field to Region schema...');

    // Update the schema
    const updateResponse = await fetch(`${API_BASE}/api/content-type-builder/content-types/api::region.region`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        components: [],
        contentType: {
          ...schemaData.data,
          schema: updatedSchema
        }
      })
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`Failed to update schema: ${updateResponse.status} - ${errorText}`);
    }

    const result = await updateResponse.json();
    console.log('✅ SEO field added successfully!');
    console.log('\n⚠️  IMPORTANT: Strapi server needs to restart for changes to take effect.');
    console.log('This may happen automatically, or you may need to restart it manually.\n');

    return result;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

// Run the script
addSeoToRegions();
