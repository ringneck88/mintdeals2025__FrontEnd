import type { APIRoute } from 'astro';

const RAILWAY_API_BASE = 'https://mintdealsbackend-production.up.railway.app/api';

export const GET: APIRoute = async ({ url }) => {
  try {
    const dutchieStoreId = url.searchParams.get('dutchie_store_id');

    // Build the Railway API URL with query params
    let apiUrl = `${RAILWAY_API_BASE}/product-discounts`;
    if (dutchieStoreId) {
      apiUrl += `?filters[dutchie_store_id][$eq]=${dutchieStoreId}`;
    }

    // Fetch from Railway backend
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Railway API returned ${response.status}: ${response.statusText}`);
    }

    const railwayData = await response.json();

    // Railway returns data in { data: [...] } format
    let results = railwayData.data || [];

    // If filtering by store ID, filter the results
    if (dutchieStoreId && Array.isArray(results)) {
      results = results.filter((item: any) => item.dutchie_store_id === dutchieStoreId);
    }

    console.log(`✅ Fetched ${results.length} product discounts from Railway API`);

    return new Response(JSON.stringify({
      data: results,
      meta: {
        total: results.length
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({
      data: [],
      error: {
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
