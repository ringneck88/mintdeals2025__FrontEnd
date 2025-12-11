import type { APIRoute } from 'astro';
import { getInventoryWithDiscounts, getDiscountedProducts, getLocations } from '../../lib/db';

export const GET: APIRoute = async ({ url }) => {
  try {
    const locationId = url.searchParams.get('location_id');
    const discountedOnly = url.searchParams.get('discounted_only') === 'true';
    const category = url.searchParams.get('category');
    const brand = url.searchParams.get('brand');
    const limit = parseInt(url.searchParams.get('limit') || '0');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // If no location_id, return list of locations
    if (!locationId) {
      const locations = await getLocations();
      return new Response(JSON.stringify({
        data: locations,
        meta: { total: locations.length }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get products with discount info
    let products = discountedOnly
      ? await getDiscountedProducts(locationId)
      : await getInventoryWithDiscounts(locationId);

    // Apply filters
    if (category) {
      const categoryLower = category.toLowerCase();
      products = products.filter(p =>
        p.category?.toLowerCase() === categoryLower ||
        p.master_category?.toLowerCase() === categoryLower
      );
    }

    if (brand) {
      const brandLower = brand.toLowerCase();
      products = products.filter(p =>
        p.brand_name?.toLowerCase().includes(brandLower)
      );
    }

    // Filter to cannabis products (is_active can be NULL, treat as true)
    products = products.filter(p => p.is_cannabis === true && p.is_active !== false);

    const total = products.length;

    // Apply pagination
    if (limit > 0) {
      products = products.slice(offset, offset + limit);
    }

    // Get unique categories and brands for filtering
    const allProducts = discountedOnly
      ? await getDiscountedProducts(locationId)
      : await getInventoryWithDiscounts(locationId);

    const categories = [...new Set(allProducts.map(p => p.category).filter(Boolean))].sort();
    const brands = [...new Set(allProducts.map(p => p.brand_name).filter(Boolean))].sort();

    console.log(`Fetched ${products.length} products for location ${locationId}`);

    return new Response(JSON.stringify({
      data: products,
      meta: {
        total,
        limit,
        offset,
        categories,
        brands
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Products API error:', error);
    return new Response(JSON.stringify({
      data: [],
      error: {
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
