const API_BASE = 'https://mintdealsbackend-production.up.railway.app/api';
const API_TOKEN = '8c74accdb16b21c3007340abf641d2fdb7bd311973bb12ffab3587602b5af843c59b822672ff75e882c66de39548ca6179a9d6caa3e07ba5bb73974fad3a10899958b4129a2ed8602da7f46aeaee8483854c700bb9246c961f505661821d0fb8898b8c54d25cb27ae3b45c05762b7f965d69068aa8c081924ef12566b176a52f';

async function fixStuart() {
  // Get all stores
  const response = await fetch(`${API_BASE}/stores?populate=seo,address`);
  const data = await response.json();

  // Find Stuart
  const stuart = data.data.find(s => s.name && s.name.includes('Stuart'));

  if (!stuart) {
    console.log('Stuart store not found');
    return;
  }

  console.log('Found:', stuart.name);
  console.log('DocumentID:', stuart.documentId);
  console.log('Has SEO:', !!stuart.seo);

  if (stuart.seo) {
    console.log('Already has SEO!');
    return;
  }

  // Update with SEO
  const city = stuart.address?.city || 'Stuart';
  const state = stuart.address?.state || 'Florida';

  const updateResponse = await fetch(`${API_BASE}/stores/${stuart.documentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`
    },
    body: JSON.stringify({
      data: {
        seo: {
          metaTitle: `${stuart.name} | ${city}, ${state} Dispensary | Mint Cannabis`,
          metaDescription: `Visit ${stuart.name} in ${city}, ${state}. Premium cannabis products, exclusive deals, and expert staff. Find flower, concentrates, edibles, and more.`
        }
      }
    })
  });

  if (updateResponse.ok) {
    console.log('✅ Updated SEO for', stuart.name);
  } else {
    console.log('❌ Failed:', await updateResponse.text());
  }
}

fixStuart();
