import postgres from 'postgres';

// Get database URL from environment
const DATABASE_URL = import.meta.env.DATABASE_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn('DATABASE_URL not set - database queries will fail');
}

// Create SQL query function with connection pooling
export const sql = DATABASE_URL ? postgres(DATABASE_URL, {
  ssl: 'require',
  max: 5,
  idle_timeout: 20,
  connect_timeout: 10,
}) : null;

// Types for database tables
export interface InventoryItem {
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
  strain: string | null;
  description: string | null;
  synced_at: string;
}

export interface Discount {
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

export interface Location {
  id: string;
  name: string;
}

export interface ProductWithDiscount extends InventoryItem {
  discount_name?: string;
  discount_type?: string;
  discount_amount?: number;
  discount_valid_from?: string;
  discount_valid_until?: string;
  discounted_price?: number;
}

// Get all inventory for a location
export async function getInventoryByLocation(locationId: string): Promise<InventoryItem[]> {
  if (!sql) throw new Error('Database not configured');

  // is_active can be NULL, so we check for NOT FALSE instead of = true
  const result = await sql`
    SELECT * FROM inventory
    WHERE location_id = ${locationId}
    AND (is_active IS NULL OR is_active = true)
    ORDER BY product_name
  `;

  return result as InventoryItem[];
}

// Get active discounts for a location
export async function getDiscountsByLocation(locationId: string): Promise<Discount[]> {
  if (!sql) throw new Error('Database not configured');

  const result = await sql`
    SELECT * FROM discounts
    WHERE location_id = ${locationId}
    AND is_active = true
    AND (valid_until IS NULL OR valid_until > NOW())
  `;

  return result as Discount[];
}

// Get all locations
export async function getLocations(): Promise<Location[]> {
  if (!sql) throw new Error('Database not configured');

  const result = await sql`SELECT * FROM locations`;
  return result as Location[];
}

// Get inventory with applicable discounts
export async function getInventoryWithDiscounts(locationId: string): Promise<ProductWithDiscount[]> {
  if (!sql) throw new Error('Database not configured');

  // Get inventory and discounts separately, then join in JS for more control
  const [inventory, discounts] = await Promise.all([
    getInventoryByLocation(locationId),
    getDiscountsByLocation(locationId)
  ]);

  // Build discount lookup by product_id (use string keys since inventory.product_id is a string)
  const discountMap = new Map<string, Discount>();

  for (const discount of discounts) {
    if (discount.products?.ids && !discount.products.isExclusion) {
      for (const productId of discount.products.ids) {
        // Convert to string for consistent matching
        const productIdStr = String(productId);
        // If multiple discounts apply, keep the best one (highest amount for percent)
        const existing = discountMap.get(productIdStr);
        if (!existing || discount.discount_amount > existing.discount_amount) {
          discountMap.set(productIdStr, discount);
        }
      }
    }
  }

  console.log(`Location ${locationId}: ${inventory.length} products, ${discounts.length} discounts, ${discountMap.size} product-discount mappings`);

  // Merge inventory with discounts
  return inventory.map(item => {
    // product_id can be string or number, convert to string for lookup
    const productIdStr = String(item.product_id);
    const discount = discountMap.get(productIdStr);

    if (!discount) {
      return item as ProductWithDiscount;
    }

    // Calculate discounted price (use unit_price or rec_unit_price)
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
      discount_valid_from: discount.valid_from,
      discount_valid_until: discount.valid_until,
      discounted_price: discountedPrice
    } as ProductWithDiscount;
  });
}

// Get discounted products only
export async function getDiscountedProducts(locationId: string): Promise<ProductWithDiscount[]> {
  const products = await getInventoryWithDiscounts(locationId);
  return products.filter(p => p.discount_name);
}
