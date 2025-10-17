# Adding SEO Fields to Stores and Regions in Strapi

## Current Status

✅ **Categories**: SEO fields exist and have been populated successfully!
❌ **Stores**: SEO field doesn't exist yet - needs to be added
❌ **Regions**: SEO field doesn't exist yet - needs to be added

## Step 1: Add SEO Component to Stores

1. Log in to your Strapi Admin Panel: `https://mintdealsbackend-production.up.railway.app/admin`

2. Navigate to **Content-Type Builder** (in left sidebar)

3. Click on **Store** under "Collection Types"

4. Click **"Add another field to this collection type"**

5. Select **Component** field type

6. Configure the component:
   - **Name**: `SEO` (or `seo` - check what Categories use)
   - **Select component**: Choose the existing SEO component (the same one used by Categories)
   - **Type**: Single component

7. Click **Finish**

8. Click **Save** (top right)

9. **IMPORTANT**: Click **"Yes, restart server"** when prompted

## Step 2: Add SEO Component to Regions

Repeat the same process for Regions:

1. In **Content-Type Builder**, click on **Region** under "Collection Types"

2. Click **"Add another field to this collection type"**

3. Select **Component** field type

4. Configure:
   - **Name**: `SEO` (same as you used for Stores)
   - **Select component**: Choose the existing SEO component
   - **Type**: Single component

5. Click **Finish**

6. Click **Save**

7. Click **"Yes, restart server"**

## Step 3: Verify the SEO Component Structure

The SEO component should have these fields (check in Content-Type Builder > Components > SEO):
- `metaTitle` (Text - Short text)
- `metaDescription` (Text - Long text)

If it has different field names, note them down - you'll need to update the script.

## Step 4: Re-run the Population Script

Once you've added the SEO fields to both Stores and Regions:

```bash
node populate-seo.js
```

This time it should successfully populate:
- ✅ All 10 Categories (already done)
- ✅ All 25 Stores (will work after adding SEO field)
- ✅ All 9 Regions (will work after adding SEO field)

## Troubleshooting

### "SEO component doesn't exist"

If you don't see an SEO component when trying to add it:

1. Go to **Content-Type Builder** > **Create new component**
2. Category: Choose "seo" or create new category
3. Name: "SEO"
4. Add these fields to the component:
   - Field: Text (Short text), Name: `metaTitle`
   - Field: Text (Long text), Name: `metaDescription`
5. Save the component
6. Then add it to Stores and Regions as described above

### Different field names

If your SEO component uses different field names (e.g., `title` instead of `metaTitle`), you'll need to update the script:

1. Open `populate-seo.js`
2. Find the `categorySEO` object and all the update functions
3. Change `metaTitle` and `metaDescription` to match your field names

## Alternative: Manual Entry

If you prefer not to use the script for Stores and Regions, you can manually enter SEO data:

### For each Store:
- **metaTitle**: `[Store Name] | [City], [State] Dispensary | Mint Cannabis`
- **metaDescription**: `Visit [Store Name] in [City], [State]. Premium cannabis products, exclusive deals, and expert staff. Find flower, concentrates, edibles, and more.`

### For each Region:
- **metaTitle**: `[Region Name] Cannabis Dispensaries | [State] | Mint Deals`
- **metaDescription**: `Find the best cannabis dispensaries in [Region Name], [State]. Browse deals on flower, concentrates, edibles, and more from trusted retailers.`

## Next Steps After Adding SEO Fields

1. Verify stores and regions have SEO fields in Strapi admin
2. Re-run `node populate-seo.js` to populate them
3. Update your frontend pages (stores/[id].astro, region/[slug].astro) to use SEO fields like categories do
