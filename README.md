# Mint Cannabis Frontend

A modern, responsive frontend for Mint Cannabis built with Astro and Tailwind CSS, featuring store locations, product catalog, and seamless API integration.

## 🌟 Features

- **Store Locations**: Interactive store finder with region filtering and map integration
- **Product Catalog**: Browse cannabis products by categories with detailed information
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Fast Performance**: Built with Astro for optimal loading speeds
- **API Integration**: Real-time data from Railway backend API
- **Cloudflare Ready**: Configured for Cloudflare Pages deployment

## 🏗️ Tech Stack

- **Framework**: Astro 5.13.8
- **Styling**: Tailwind CSS 4.1.13
- **Deployment**: Cloudflare Pages with Wrangler
- **Backend API**: Railway hosted at `mintdealsbackend-production.up.railway.app`

## 🚀 Project Structure

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       ├── index.astro              # Homepage
│       ├── stores.astro             # Store locations page
│       ├── location/
│       │   └── [slug].astro         # Individual store pages
│       ├── category/
│       │   └── [slug].astro         # Product category pages
│       └── dosing-guide.astro       # Cannabis dosing information
├── astro.config.mjs
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run deploy`          | Deploy to Cloudflare Pages                       |
| `npm run cf-typegen`      | Generate Cloudflare types                        |

## 🔗 API Integration

The frontend integrates with the following API endpoints:

- **Stores**: `GET /api/stores` - Retrieve all store locations
- **Regions**: `GET /api/regions` - Get available regions/states
- **Categories**: `GET /api/product-categories` - Product categories
- **Products**: `GET /api/products` - Cannabis products and dosage information

Base URL: `https://mintdealsbackend-production.up.railway.app`

## 📱 Pages

### Store Locations (`/stores`)
- Interactive store finder with search and filtering
- Region-based filtering (Arizona, Michigan, Nevada, Illinois, Missouri)
- Google Maps integration for directions
- Store details including hours, contact info, and manager information

### Individual Store Pages (`/location/[slug]`)
- Detailed store information and images
- Interactive Dutchie menu integration
- Store-specific product listings
- Contact and hours information

### Product Categories (`/category/[slug]`)
- Browse products by category
- Detailed product information and pricing
- THC/CBD content and effects information

### Dosing Guide (`/dosing-guide`)
- Comprehensive cannabis dosing information
- Product-specific dosing recommendations
- Educational content for new users

## 🎨 Design Features

- **Modern UI**: Clean, professional design with cannabis industry theming
- **Interactive Elements**: Hover effects, smooth transitions, and animations
- **Accessible**: WCAG compliant with proper contrast and navigation
- **Mobile-First**: Responsive design optimized for all devices
- **Dark Mode**: Support for light and dark themes

## 🚀 Development

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Start development server**: `npm run dev`
4. **Visit**: `http://localhost:4321`

## 🌐 Deployment

The site is configured for deployment to Cloudflare Pages:

```bash
npm run deploy
```

This will build the site and deploy it using Wrangler to Cloudflare Pages.

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Image Optimization**: Cloudflare Image Service integration
- **Fast Loading**: Astro's island architecture for minimal JavaScript

## 🔧 Configuration

- **Cloudflare Adapter**: Configured with platform proxy and image service
- **Tailwind CSS**: Custom configuration with Vite plugin
- **Environment Variables**: API endpoints and configuration stored in `.env`

## 📝 Notes

- Remove `.backup` files (like `stores.astro.backup`) or prefix with `_` to avoid warnings
- Cloudflare KV binding setup may be required for sessions (see console warnings)
- The site uses fallback data when API endpoints are unavailable