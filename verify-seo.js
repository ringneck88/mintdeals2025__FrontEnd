/**
 * Script to verify SEO fields are populated in Strapi
 */

const API_BASE = 'https://mintdealsbackend-production.up.railway.app/api';

async function verifyCategories() {
  const response = await fetch(`${API_BASE}/categories?populate=SEO`);
  const data = await response.json();

  console.log('\n📁 CATEGORIES:');
  console.log('=' .repeat(60));

  data.data.forEach(cat => {
    const slug = cat.slug;
    const seo = cat.SEO;
    const hasTitle = seo?.metaTitle ? '✅' : '❌';
    const hasDesc = seo?.metaDescription ? '✅' : '❌';

    console.log(`${hasTitle} ${hasDesc} ${slug}`);
    if (seo?.metaTitle) {
      console.log(`   Title: ${seo.metaTitle.substring(0, 60)}...`);
    }
  });
}

async function verifyStores() {
  const response = await fetch(`${API_BASE}/stores?populate=seo`);
  const data = await response.json();

  console.log('\n\n🏪 STORES:');
  console.log('='.repeat(60));

  data.data.forEach(store => {
    const name = store.name;
    const seo = store.seo;
    const hasTitle = seo?.metaTitle ? '✅' : '❌';
    const hasDesc = seo?.metaDescription ? '✅' : '❌';

    console.log(`${hasTitle} ${hasDesc} ${name}`);
    if (seo?.metaTitle) {
      console.log(`   Title: ${seo.metaTitle.substring(0, 60)}...`);
    }
  });
}

async function verifyRegions() {
  const response = await fetch(`${API_BASE}/regions?populate=seo`);
  const data = await response.json();

  console.log('\n\n🗺️  REGIONS:');
  console.log('='.repeat(60));

  data.data.forEach(region => {
    const name = region.name;
    const seo = region.seo;
    const hasTitle = seo?.metaTitle ? '✅' : '❌';
    const hasDesc = seo?.metaDescription ? '✅' : '❌';

    console.log(`${hasTitle} ${hasDesc} ${name}`);
    if (seo?.metaTitle) {
      console.log(`   Title: ${seo.metaTitle.substring(0, 60)}...`);
    } else {
      console.log(`   ⚠️  No SEO data - add 'seo' field to Region content type`);
    }
  });
}

async function main() {
  console.log('\n🔍 Verifying SEO Population Status...\n');

  await verifyCategories();
  await verifyStores();
  await verifyRegions();

  console.log('\n\n' + '='.repeat(60));
  console.log('Legend: ✅ = Has data  ❌ = Missing data');
  console.log('='.repeat(60) + '\n');
}

main().catch(console.error);
