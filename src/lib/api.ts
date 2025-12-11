// API client for fast product/discount data from Strapi (synced from Dutchie)
// This uses the pre-synced product-discounts data for faster queries

const API_BASE = import.meta.env.PUBLIC_STRAPI_URL || 'https://mintdealsbackend-production.up.railway.app';

export interface ProductDiscount {
  id: number;
  product_id: number;
  product_name: string;
  brand_name: string | null;
  category: string | null;
  strain: string | null;
  unit_price: number | null;
  quantity_available: number;
  image_url: string | null;
  is_cannabis: boolean;
  discount_id: number | null;
  discount_name: string | null;
  discount_type: string | null;
  discount_amount: number | null;
  valid_from: string | null;
  valid_until: string | null;
  dutchie_store_id: string;
  potency_thc_formatted: string | null;
  potency_cbd_formatted: string | null;
}

export interface Store {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  DutchieStoreID?: string;
  dutchieStoreId?: string;
}

// Fetch helper with error handling
async function fetchAPI<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  console.log(`Fetching: ${url}`);

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Get all stores
export async function getStores(): Promise<Store[]> {
  const data = await fetchAPI<{ data: any[] }>('/api/stores?populate=*&pagination[pageSize]=100');
  return (data.data || []).map(store => ({
    id: store.id,
    documentId: store.documentId,
    name: store.name || 'Unnamed Store',
    slug: store.slug || store.documentId,
    DutchieStoreID: store.DutchieStoreID,
    dutchieStoreId: store.DutchieStoreID || store.dutchieStoreId,
  }));
}

// Get store by slug
export async function getStoreBySlug(slug: string): Promise<Store | null> {
  const data = await fetchAPI<{ data: any[] }>(`/api/stores?filters[slug][$eq]=${slug}&populate=*`);
  const storeData = data.data?.[0];
  if (!storeData) return null;

  return {
    id: storeData.id,
    documentId: storeData.documentId,
    name: storeData.name || 'Store',
    slug: storeData.slug || slug,
    DutchieStoreID: storeData.DutchieStoreID,
    dutchieStoreId: storeData.DutchieStoreID || storeData.dutchieStoreId,
  };
}

// Get all product discounts with optional filters
export async function getProductDiscounts(options?: {
  dutchieStoreId?: string;
  category?: string;
  limit?: number;
  page?: number;
}): Promise<ProductDiscount[]> {
  const params = new URLSearchParams();
  params.set('pagination[pageSize]', String(options?.limit || 1000));
  if (options?.page) params.set('pagination[page]', String(options.page));

  // Build filters
  const filters: string[] = [];
  if (options?.dutchieStoreId) {
    filters.push(`filters[dutchie_store_id][$eq]=${options.dutchieStoreId}`);
  }
  if (options?.category) {
    filters.push(`filters[category][$eq]=${encodeURIComponent(options.category)}`);
  }

  const queryString = params.toString() + (filters.length ? '&' + filters.join('&') : '');
  const endpoint = `/api/product-discounts?${queryString}`;

  const data = await fetchAPI<{ data: any[] }>(endpoint);

  return (data.data || []).map(item => ({
    id: item.id,
    product_id: item.product_id,
    product_name: item.product_name || item.productName,
    brand_name: item.brand_name || item.brand || null,
    category: item.category || null,
    strain: item.strain || null,
    unit_price: parseFloat(item.inventory_unit_price || item.unit_price || '0') || null,
    quantity_available: parseInt(item.quantity_available || '0') || 0,
    image_url: item.image_url || null,
    is_cannabis: item.is_cannabis ?? true,
    discount_id: item.discount_id || null,
    discount_name: item.discount_name || null,
    discount_type: item.discount_type || null,
    discount_amount: item.discount_amount ? parseFloat(item.discount_amount) : null,
    valid_from: item.valid_from || null,
    valid_until: item.valid_until || null,
    dutchie_store_id: item.dutchie_store_id || '',
    potency_thc_formatted: item.potency_thc_formatted || null,
    potency_cbd_formatted: item.potency_cbd_formatted || null,
  }));
}

// Get discounted products for a specific store (filtered and with date validation)
export async function getDiscountedProductsForStore(
  dutchieStoreId: string,
  options?: {
    isCannabisOnly?: boolean;
    excludeAccessories?: boolean;
    excludeSamples?: boolean;
    maxDaysAgo?: number;
    maxDaysAhead?: number;
  }
): Promise<ProductDiscount[]> {
  const allProducts = await getProductDiscounts({ dutchieStoreId });

  const now = new Date();
  const daysAgo = options?.maxDaysAgo ?? 3;
  const daysAhead = options?.maxDaysAhead ?? 7;
  const pastCutoff = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
  const futureCutoff = new Date(now.getTime() + (daysAhead * 24 * 60 * 60 * 1000));

  return allProducts.filter(product => {
    // Filter by cannabis only
    if (options?.isCannabisOnly !== false && !product.is_cannabis) {
      return false;
    }

    // Filter out accessories
    if (options?.excludeAccessories !== false) {
      const category = (product.category || '').toLowerCase();
      if (category === 'accessory' || category === 'accessories') {
        return false;
      }
    }

    // Filter out samples
    if (options?.excludeSamples !== false) {
      const name = (product.product_name || '').toLowerCase();
      if (name.includes('sample')) {
        return false;
      }
    }

    // Must have a discount
    if (!product.discount_name) {
      return false;
    }

    // Check valid_from date
    if (product.valid_from) {
      const validFrom = new Date(product.valid_from);
      if (validFrom < pastCutoff) {
        return false;
      }
    }

    // Check valid_until date
    if (product.valid_until) {
      const validUntil = new Date(product.valid_until);
      if (validUntil > futureCutoff) {
        return false;
      }
    }

    return true;
  });
}

// Calculate discounted price
export function calculateDiscountedPrice(
  originalPrice: number,
  discountAmount: number | null,
  discountType: string | null
): number | null {
  if (!discountAmount || !discountType) return null;

  const type = discountType.toLowerCase();

  if (type.includes('percent')) {
    return originalPrice * (1 - discountAmount);
  } else if (type.includes('price to amount')) {
    return discountAmount;
  }

  return null;
}

// Helper to format price safely
export function formatPrice(price: number | string | null | undefined): string | null {
  if (price === null || price === undefined) return null;
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return null;
  return numPrice.toFixed(2);
}
