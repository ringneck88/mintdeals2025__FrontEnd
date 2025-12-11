// Redis Cache API client for inventory and discounts
// Base URL: mintinvsvc-production.up.railway.app (Redis inventory service)

const REDIS_API_BASE = import.meta.env.PUBLIC_REDIS_API_URL ||
  'https://mintinvsvc-production.up.railway.app';

// Types matching the Redis cache API responses
export interface RedisInventoryItem {
  id: string;
  location_id: string;
  inventory_id: number;
  product_id: number;
  sku: string | null;
  product_name: string;
  brand_name: string | null;
  category: string | null;
  master_category: string | null;
  strain_type: string | null;
  strain: string | null;
  price: number | null;
  unit_price: number | null;
  rec_unit_price: number | null;
  med_unit_price: number | null;
  quantity_available: number;
  is_active: boolean | null;
  is_cannabis: boolean;
  slug: string | null;
  effects: string[] | null;
  tags: string[] | null;
  images: { url: string }[] | null;
  image_url: string | null;
  staff_pick: boolean;
  potency_thc_formatted: string | null;
  potency_cbd_formatted: string | null;
  effective_potency_mg: number | string | null;
  unit_thc_content_dose: number | string | null;
  unit_cbd_content_dose: number | string | null;
  description: string | null;
  synced_at: string;
}

export interface RedisDiscount {
  id: string;
  location_id: string;
  discount_id: number;
  discount_name: string;
  discount_code: string | null;
  discount_type: string;
  discount_amount: number;
  is_active: boolean;
  is_available_online: boolean;
  valid_from: string | null;
  valid_until: string | null;
  products: { ids: number[]; isExclusion: boolean } | null;
  product_categories: { ids: number[]; isExclusion: boolean } | null;
  brands: { ids: number[]; isExclusion: boolean } | null;
  weekly_recurrence_info: any;
  first_time_customer_only: boolean;
  minimum_items_required: number | null;
  synced_at: string;
}

export interface RedisLocation {
  id: string;
  name: string;
}

export interface ProductWithDiscount extends RedisInventoryItem {
  discount_name?: string;
  discount_type?: string;
  discount_amount?: number;
  discount_valid_from?: string;
  discount_valid_until?: string;
  discounted_price?: number;
}

export interface InventoryResponse {
  data: RedisInventoryItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface DiscountsResponse {
  data: RedisDiscount[];
  count: number;
}

export interface LocationsResponse {
  data: RedisLocation[];
  count: number;
}

export interface CategoriesResponse {
  categories: string[];
  masterCategories: string[];
}

export interface BrandsResponse {
  brands: string[];
}

export interface SingleItemResponse {
  data: RedisInventoryItem;
  discounts: RedisDiscount[];
}

// Fetch helper with error handling
async function fetchRedisAPI<T>(endpoint: string): Promise<T> {
  const url = `${REDIS_API_BASE}${endpoint}`;
  console.log(`[Redis API] Fetching: ${url}`);

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (response.status === 404) {
    throw new Error(`Location not found or cache not ready`);
  }

  if (response.status === 503) {
    throw new Error(`Cache not ready - please try again`);
  }

  if (!response.ok) {
    throw new Error(`Redis API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Check API health
export async function checkHealth(): Promise<{ status: string; timestamp: string }> {
  return fetchRedisAPI('/health');
}

// Get all locations
export async function getLocations(): Promise<RedisLocation[]> {
  const response = await fetchRedisAPI<LocationsResponse>('/api/locations');
  return response.data || [];
}

// Get inventory for a location with optional filters
export async function getInventory(
  locationId: string,
  options?: {
    category?: string;
    brand?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }
): Promise<InventoryResponse> {
  const params = new URLSearchParams();

  if (options?.category) params.set('category', options.category);
  if (options?.brand) params.set('brand', options.brand);
  if (options?.search) params.set('search', options.search);
  if (options?.limit) params.set('limit', String(options.limit));
  if (options?.offset) params.set('offset', String(options.offset));

  const queryString = params.toString();
  const endpoint = `/api/locations/${locationId}/inventory${queryString ? `?${queryString}` : ''}`;

  return fetchRedisAPI<InventoryResponse>(endpoint);
}

// Get all inventory for a location (handles pagination automatically)
export async function getAllInventory(
  locationId: string,
  options?: {
    category?: string;
    brand?: string;
    search?: string;
  }
): Promise<RedisInventoryItem[]> {
  const limit = 500; // Fetch in batches
  let offset = 0;
  let allItems: RedisInventoryItem[] = [];
  let hasMore = true;

  while (hasMore) {
    const response = await getInventory(locationId, {
      ...options,
      limit,
      offset
    });

    allItems = allItems.concat(response.data || []);

    // Check if there are more items
    if (response.data.length < limit || allItems.length >= response.total) {
      hasMore = false;
    } else {
      offset += limit;
    }
  }

  return allItems;
}

// Get single inventory item with discounts
export async function getInventoryItem(
  locationId: string,
  sku: string
): Promise<SingleItemResponse> {
  return fetchRedisAPI<SingleItemResponse>(`/api/locations/${locationId}/inventory/${sku}`);
}

// Get discounts for a location
export async function getDiscounts(locationId: string): Promise<RedisDiscount[]> {
  const response = await fetchRedisAPI<DiscountsResponse>(`/api/locations/${locationId}/discounts`);
  return response.data || [];
}

// Get categories for a location
export async function getCategories(locationId: string): Promise<CategoriesResponse> {
  return fetchRedisAPI<CategoriesResponse>(`/api/locations/${locationId}/categories`);
}

// Get brands for a location
export async function getBrands(locationId: string): Promise<string[]> {
  const response = await fetchRedisAPI<BrandsResponse>(`/api/locations/${locationId}/brands`);
  return response.brands || [];
}

// Get sync status for a location
export async function getSyncStatus(locationId: string): Promise<{
  locationId: string;
  lastSync: string;
  ageSeconds: number;
}> {
  return fetchRedisAPI(`/api/locations/${locationId}/sync-status`);
}

// Get inventory with discounts applied (combines inventory + discounts)
export async function getInventoryWithDiscounts(locationId: string): Promise<ProductWithDiscount[]> {
  // Fetch inventory and discounts in parallel
  const [inventoryResponse, discounts] = await Promise.all([
    getAllInventory(locationId),
    getDiscounts(locationId)
  ]);

  const inventory = inventoryResponse;

  // Build discount lookup by product_id
  const discountMap = new Map<string, RedisDiscount>();

  for (const discount of discounts) {
    if (discount.products?.ids && !discount.products.isExclusion) {
      for (const productId of discount.products.ids) {
        const productIdStr = String(productId);
        // Keep the best discount (highest amount for percent-based)
        const existing = discountMap.get(productIdStr);
        if (!existing || discount.discount_amount > existing.discount_amount) {
          discountMap.set(productIdStr, discount);
        }
      }
    }
  }

  console.log(`[Redis API] Location ${locationId}: ${inventory.length} products, ${discounts.length} discounts, ${discountMap.size} product-discount mappings`);

  // Merge inventory with discounts
  return inventory.map(item => {
    const productIdStr = String(item.product_id);
    const discount = discountMap.get(productIdStr);

    if (!discount) {
      return item as ProductWithDiscount;
    }

    // Calculate discounted price
    const basePrice = parseFloat(String(item.unit_price || item.rec_unit_price || item.price || 0));
    let discountedPrice: number | undefined;

    if (discount.discount_type?.toLowerCase().includes('percent')) {
      discountedPrice = basePrice * (1 - discount.discount_amount);
    } else if (discount.discount_type?.toLowerCase().includes('price to amount')) {
      discountedPrice = discount.discount_amount;
    }

    return {
      ...item,
      discount_name: discount.discount_name,
      discount_type: discount.discount_type,
      discount_amount: discount.discount_amount,
      discount_valid_from: discount.valid_from || undefined,
      discount_valid_until: discount.valid_until || undefined,
      discounted_price: discountedPrice
    } as ProductWithDiscount;
  });
}

// Get only discounted products
export async function getDiscountedProducts(locationId: string): Promise<ProductWithDiscount[]> {
  const products = await getInventoryWithDiscounts(locationId);
  return products.filter(p => p.discount_name);
}

// Helper to format price safely
export function formatPrice(price: number | string | null | undefined): string | null {
  if (price === null || price === undefined) return null;
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return null;
  return numPrice.toFixed(2);
}
