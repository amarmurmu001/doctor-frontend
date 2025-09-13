# Sitemap Generation System (Frontend-Based)

This document explains the sitemap generation system that has been moved from the backend to the frontend for production deployment where backend and frontend are on separate servers.

## Overview

In production environments where the backend and frontend are deployed on different servers, sitemap generation needs to be handled by the frontend server since:

1. **Search engines access sitemaps via HTTP URLs** served by the frontend
2. **Backend may not be accessible** from the public internet
3. **Frontend build process** is the appropriate place for static file generation

## Architecture

```
Frontend Server (Nginx/Apache)
├── public/
│   ├── sitemap.xml (main index)
│   ├── sitemap-static.xml
│   ├── sitemap-doctors.xml
│   ├── sitemap-specialists.xml
│   ├── sitemap-location.xml
│   └── [other hierarchical sitemaps...]
└── scripts/
    └── generate-sitemaps.js (generation script)
```

## Sitemap Structure

### Main Sitemap Index (`sitemap.xml`)
Points to all major sitemap sections:
- Static pages
- Doctors (hierarchical)
- Specialists (hierarchical)
- Location-based (hierarchical)

### Hierarchical Structure

```
sitemap.xml
├── sitemap-static.xml (static pages)
├── sitemap-doctors.xml (index for cities)
│   ├── sitemap-doctors-{city}.xml (index for specialties in city)
│   │   └── sitemap-{specialty}.xml (actual doctor URLs)
├── sitemap-specialists.xml (index for specialties)
│   ├── sitemap-specialists-{specialty}.xml (index for cities in specialty)
│   │   └── sitemap-specialists-{specialty}-{city}.xml (actual doctor URLs)
└── sitemap-location.xml (index for cities)
    └── sitemap-location-{city}.xml (city-specific URLs)
```

## Data Sources

### Doctor Data
- **Source**: Backend API (`/api/admin/doctors?status=approved&limit=1000`)
- **Authentication**: Uses admin authentication
- **Fields used**: `user.name`, `specialty`, `city`, `updatedAt`

### City Data
- **Source**: Local data file (`src/data/cities.js`)
- **Content**: All cities from the original CSV file
- **Purpose**: Static list of all supported cities

## Configuration

### Environment Variables

```bash
# Backend API URL (for fetching doctor data)
VITE_API_BASE_URL=https://api.doctar.app/api

# Frontend URL (for generating sitemap URLs)
FRONTEND_URL=https://doctar.app
```

### Dependencies

```json
{
  "axios": "^1.11.0"  // For API calls to backend
}
```

## Usage

### Development

```bash
# Generate sitemaps (fetches from local backend)
npm run generate-sitemaps
```

### Production Build

```bash
# Build automatically runs sitemap generation
npm run build

# Or generate manually
npm run generate-sitemaps
```

### Specific Sitemaps

```bash
# Generate only static pages sitemap
npm run generate-sitemaps-static

# Generate only doctors sitemaps
npm run generate-sitemaps-doctors

# Generate only specialists sitemaps
npm run generate-sitemaps-specialists

# Generate only location sitemaps
npm run generate-sitemaps-location
```

## Deployment Integration

### Automated Generation

#### Option 1: Build Hook
```bash
# package.json build script
"build": "vite build && npm run generate-sitemaps"
```

#### Option 2: Post-Deploy Hook
```bash
# After deployment
npm run generate-sitemaps
```

#### Option 3: Scheduled Job
```bash
# Cron job (daily at 2 AM)
0 2 * * * cd /path/to/frontend && npm run generate-sitemaps
```

### Manual Regeneration

For admin-triggered regeneration, create an API endpoint in the frontend or use a webhook:

```javascript
// Example: Admin panel button triggers regeneration
const regenerateSitemaps = async () => {
  // Option 1: Call backend API (if backend can regenerate)
  // Option 2: Trigger frontend script via SSH/webhook
  // Option 3: Use CI/CD pipeline
};
```

## File Locations

```
doctor-frontend/
├── scripts/
│   └── generate-sitemaps.js          # Main generation script
├── src/
│   └── data/
│       └── cities.js                 # Cities data
├── public/                           # Generated sitemaps go here
│   ├── sitemap.xml
│   ├── sitemap-static.xml
│   └── ...
└── package.json                      # Updated with scripts
```

## Migration from Backend

### What Changed

1. **Location**: Moved from `doctar-backend/` to `doctor-frontend/scripts/`
2. **Data Access**: Changed from direct DB access to API calls
3. **File Output**: Saves to `doctor-frontend/public/` instead of `doctor-frontend/public/`
4. **Execution**: Runs during frontend build instead of backend runtime

### Removed from Backend

- `generate-sitemap-*.js` scripts
- `utils/citiesReader.js`
- `utils/sitemapAutoRegenerator.js`
- Sitemap-related controller functions
- Admin sitemap regeneration endpoint

### Benefits of Frontend Approach

1. **SEO Compliance**: Sitemaps served from same domain as website
2. **Build-time Generation**: Static files generated during deployment
3. **Scalability**: No runtime sitemap generation load on backend
4. **Version Control**: Sitemaps can be committed to repository
5. **CDN Friendly**: Static XML files work well with CDNs

## Troubleshooting

### Common Issues

#### 1. API Connection Failed
```
❌ Failed to fetch doctors: Connection refused
```
**Solution**: Check `VITE_API_BASE_URL` and ensure backend is accessible

#### 2. Cities Not Loading
```
❌ Failed to load cities: Module not found
```
**Solution**: Ensure `src/data/cities.js` exists and is properly imported

#### 3. Permission Denied
```
Error: EACCES: permission denied
```
**Solution**: Ensure write permissions on `public/` directory

#### 4. Missing Environment Variables
```
FRONTEND_URL is not defined
```
**Solution**: Set environment variables before running script

### Debug Mode

Add console logs to see detailed execution:

```bash
DEBUG=true npm run generate-sitemaps
```

## Performance Considerations

### Large Datasets
- Uses pagination for doctor fetching (`limit=1000`)
- Processes doctors in memory (ensure sufficient RAM)
- Generates files sequentially to avoid disk I/O bottlenecks

### Update Frequency
- **Static Pages**: Monthly or on content changes
- **Doctor Pages**: Daily or when doctor data changes
- **Full Regeneration**: Weekly or as needed

## Monitoring

### Success Indicators
- Check file existence in `public/` directory
- Verify XML structure is valid
- Test sitemap URLs return HTTP 200
- Submit to Google Search Console

### Log Analysis
```
✅ Static pages sitemap generated successfully: sitemap-static.xml
✅ Main doctors sitemap generated: sitemap-doctors.xml
📊 Hierarchical Sitemap Generation Complete:
    🏙️  Cities processed: 4
    👨‍⚕️ Total doctor URLs: 127
```

## Future Enhancements

1. **Incremental Updates**: Only regenerate changed sections
2. **Compression**: Gzip sitemap files for faster loading
3. **Validation**: XML schema validation before deployment
4. **CDN Invalidation**: Automatically purge CDN cache after updates
5. **Monitoring**: Track sitemap submission status and indexing
