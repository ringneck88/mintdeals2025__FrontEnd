# Dutchie Integration Setup Guide

## ✅ Embedded Menus Are Now Working!

The embedded menu and deals pages are now functional with demo content. Follow these steps to add your actual Dutchie integration.

## 🚀 Current Status

- **Menu Pages**: `/location/[slug]/menu` - Shows demo menu with setup instructions
- **Deals Pages**: `/location/[slug]/deals` - Shows demo deals with setup instructions
- **CORS Safety**: All embeds use secure iframe sandboxing
- **Fallback Content**: Demo content shows when no Dutchie script is configured

## 📝 Add Dutchie Script Field to Strapi

### Step 1: Add Field to Location Content Type

1. Go to **Strapi Admin** → **Content-Types Builder** → **Location**
2. Click **"Add new field"**
3. Select **"Text"** field type
4. Configure the field:
   - **Name**: `DutchieScript`
   - **Type**: Text (or Rich Text if you need HTML formatting)
   - **Advanced Settings**:
     - ✅ Required: No (optional)
     - ✅ Unique: No
     - ✅ Max length: Leave empty (unlimited)

### Step 2: Save and Restart Strapi

1. Click **"Save"** to add the field
2. **Restart your Strapi server** for changes to take effect

### Step 3: Add Dutchie Scripts to Locations

Go to **Content Manager** → **Location** and edit each location to add their Dutchie embed code.

## 🔧 Supported Dutchie Script Formats

### Format 1: Simple Script Tag
```html
<script src="https://dutchie.com/embed/your-dispensary-id"></script>
```

### Format 2: iframe Embed
```html
<iframe
  src="https://dutchie.com/your-dispensary-id/embed"
  width="100%"
  height="600"
  frameborder="0">
</iframe>
```

### Format 3: Full HTML Content
```html
<!DOCTYPE html>
<html>
<head>
  <title>Menu</title>
</head>
<body>
  <div id="dutchie-menu"></div>
  <script src="https://dutchie.com/embed/your-dispensary-id"></script>
</body>
</html>
```

## 🛡️ Security Features

- **iframe Sandboxing**: Prevents malicious scripts
- **CORS Protection**: Safe cross-origin resource handling
- **Payment Permissions**: Allows Dutchie checkout functionality
- **Script Validation**: Checks for different embed formats

## 🎯 How It Works

1. **Field Check**: Pages check if `locationData.DutchieScript` exists
2. **Demo Mode**: Shows demo content with setup instructions if no script
3. **Live Mode**: Embeds actual Dutchie content when script is provided
4. **Responsive**: All embeds are mobile-friendly and responsive

## 📍 Test the Integration

1. **Visit a location menu**: `/location/[any-location-slug]/menu`
2. **Visit a location deals**: `/location/[any-location-slug]/deals`
3. **Check console**: Look for debug messages about script detection
4. **See demo content**: Visual demo with setup instructions

## 🔄 Remove Demo Mode (Optional)

Once you've added real Dutchie scripts, you can remove the demo by changing this line in both files:

**In menu.astro and deals.astro:**
```javascript
// Change this:
{(locationData.DutchieScript || true) && (

// To this:
{locationData.DutchieScript && (
```

This will only show the Dutchie integration when a real script is configured.

## 🆘 Troubleshooting

### Problem: "No script - using demo" in console
- **Solution**: Add the `DutchieScript` field to your Location content type in Strapi

### Problem: Dutchie embed not loading
- **Check**: Ensure your Dutchie script URL is correct
- **Check**: Verify Dutchie account permissions
- **Check**: Look for CORS errors in browser console

### Problem: Checkout not working
- **Solution**: iframe includes `allow="payment"` for Dutchie checkout

## 🎉 You're All Set!

The embedded menus are working with demo content. Add your Dutchie scripts to see live integration with shopping cart and checkout functionality!

**Demo visible at**: `http://localhost:4322/location/[any-location-slug]/menu`