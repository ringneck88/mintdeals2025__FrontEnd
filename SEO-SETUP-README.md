# SEO Fields Population Guide

This guide explains how to populate SEO metadata fields in Strapi for your categories, stores, and regions.

## Prerequisites

You need a Strapi API Token with write permissions.

### Getting Your Strapi API Token

1. Log in to your Strapi Admin Panel at: `https://mintdealsbackend-production.up.railway.app/admin`
2. Navigate to **Settings** > **API Tokens**
3. Click **Create new API Token**
4. Configure the token:
   - **Name**: `SEO Population Script`
   - **Token duration**: Choose as needed (recommend: 7 days for one-time use)
   - **Token type**: `Full access` (or at minimum, `Custom` with UPDATE permissions for categories, stores, and regions)
5. Click **Save**
6. **IMPORTANT**: Copy the token immediately - it will only be shown once!

## Running the Script

### Step 1: Add Your API Token

Open `populate-seo.js` and replace `YOUR_API_TOKEN_HERE` with your actual token:

```javascript
const API_TOKEN = 'your-actual-token-here';
```

### Step 2: Run the Script

```bash
node populate-seo.js
```

The script will:
1. Fetch all categories, stores, and regions from Strapi
2. Generate appropriate SEO metadata for each
3. Update each entry with the SEO data
4. Display progress and results

## What Gets Updated

### Categories
Pre-defined SEO for:
- THC Vapes and Cartridges
- Cannabis Concentrates
- Flower
- Pre-Rolls
- THC Edibles
- Topicals
- Tinctures
- Sativa
- Indica
- Hybrid
- Capsules and Tablets

### Stores
Auto-generated SEO based on:
- Store name
- City and state
- Standard Mint Cannabis branding

Example:
```
Title: Mint Cannabis Phoenix | Phoenix, AZ Dispensary | Mint Cannabis
Description: Visit Mint Cannabis Phoenix in Phoenix, AZ. Premium cannabis products, exclusive deals, and expert staff...
```

### Regions
Auto-generated SEO based on:
- Region name
- State
- Standard dispensary listing copy

Example:
```
Title: Phoenix Cannabis Dispensaries | Arizona | Mint Deals
Description: Find the best cannabis dispensaries in Phoenix, Arizona. Browse deals on flower, concentrates...
```

## Verifying the Updates

After running the script:

1. Check your Strapi admin panel
2. Open any Category, Store, or Region entry
3. Look for the **SEO** component
4. Verify that `metaTitle` and `metaDescription` are populated

## Frontend Integration

The frontend is already configured to use these SEO fields:

- **Categories**: `src/pages/[category].astro` - Uses `seo.metaTitle` and `seo.metaDescription`
- **Stores**: Should be checked/updated similarly
- **Regions**: Should be checked/updated similarly

## Troubleshooting

### "Failed to update" errors
- **Check your API token** - Make sure it's correct and has the right permissions
- **Check token expiration** - Generate a new token if yours expired
- **Check permissions** - Ensure the token has UPDATE access to the content types

### "No SEO data defined" warnings
- This means a category slug wasn't found in the `categorySEO` object
- You can add more categories to the script's `categorySEO` object

### Rate limiting
- The script includes 500ms delays between requests
- If you still hit rate limits, increase the delay in the script

## Security Note

**Never commit your API token to version control!**

The `populate-seo.js` file is safe to commit as long as you don't replace `YOUR_API_TOKEN_HERE` with your actual token.

## Customizing SEO Content

To customize the SEO metadata:

1. Edit the `categorySEO` object in `populate-seo.js` for categories
2. Modify the `updateStoreSEO` and `updateRegionSEO` functions to change the templates for stores/regions
3. Re-run the script

## Next Steps

After populating SEO fields:

1. Test your pages in production
2. Check `<title>` tags in browser
3. Use Google's Rich Results Test to validate metadata
4. Monitor Google Search Console for indexing status
