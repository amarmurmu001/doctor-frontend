# 🗺️ Comprehensive Sitemap Generation System

This document describes the comprehensive sitemap generation system that creates both static and dynamic sitemaps for the Doctar platform.

## 📋 Overview

The sitemap system generates multiple XML sitemaps to help search engines discover and index all pages on the platform:

- **Static Pages**: Core website pages (home, about, contact, etc.)
- **Doctor Profiles**: Individual doctor profile pages with SEO-optimized URLs
- **City-based Pages**: Location-specific doctor listings
- **Specialty Pages**: Medical specialty-specific doctor listings

## 🏗️ Architecture

```
public/
├── sitemap.xml              # Main sitemap index
├── sitemap-static.xml       # Static pages
├── sitemap-doctors.xml      # Doctor profiles
├── sitemap-cities.xml       # City-based pages
└── sitemap-specialties.xml  # Specialty-based pages
```

## 📊 Data Sources

### 1. Static Data
- **Cities**: From `src/data/cities.js` (1,240+ cities)
- **Static Pages**: Hardcoded list of core website pages

### 2. Dynamic Data
- **Doctors**: Fetched from backend API (`/api/doctors`)
- **Cities from Doctors**: Extracted from doctor records
- **Specialties**: Extracted from doctor records

## 🚀 Usage

### Generate All Sitemaps
```bash
npm run sitemaps:generate
# or
npm run sitemaps:all
```

### Build with Sitemaps
```bash
npm run build
# Automatically generates sitemaps after Vite build
```

### Build Only (No Sitemaps)
```bash
npm run build:full
# Same as build, but explicit
```

## 🔧 Configuration

### Environment Variables
```bash
# Backend API URL
VITE_BACKEND_URL=http://localhost:10000

# Frontend URL for sitemap URLs
VITE_FRONTEND_URL=http://localhost:3000
```

### API Endpoints
- **Doctors**: `GET /api/doctors?status=approved&limit=5000`

## 📈 Generated URLs

### Doctor Profile URLs
```
/doctors/{city}/{specialty}/{doctor-name-specialty}
```
**Example**: `/doctors/mumbai/cardiologist/dr-rajesh-kumar-cardiologist`

### City-based URLs
```
/doctors/{city}
```
**Example**: `/doctors/mumbai`

### Specialty URLs
```
/specialists/{specialty}
```
**Example**: `/specialists/cardiologist`

### Specialty + City URLs
```
/specialists/{specialty}/{city}/{doctor-name-specialty}
```
**Example**: `/specialists/cardiologist/mumbai/dr-rajesh-kumar-cardiologist`

## 📊 Current Statistics

Based on the latest generation:
- **Static Pages**: 13 URLs
- **Doctor Profiles**: 9 URLs (from backend)
- **Cities**: 1,243 URLs (1,240 static + 6 from doctors)
- **Specialties**: 22 URLs (from doctor data)

## 🔄 Update Frequency

- **Static Pages**: Monthly or on content changes
- **Doctor Profiles**: Daily or when doctor data changes
- **Cities**: Weekly or when new cities are added
- **Specialties**: Weekly or when new specialties are added

## 🛠️ Technical Details

### Dependencies
- `axios`: For API calls to backend
- `fs`: For file system operations
- `path`: For path manipulation

### File Structure
```
scripts/
└── generate-sitemaps.js    # Main generation script

src/data/
└── cities.js              # Static cities data

public/                    # Generated sitemaps (auto-created)
├── sitemap.xml
├── sitemap-static.xml
├── sitemap-doctors.xml
├── sitemap-cities.xml
└── sitemap-specialties.xml
```

### Error Handling
- Graceful fallback if backend is unavailable
- Continues generation with available data
- Detailed error logging for debugging

## 🚀 Deployment

### Production Build
The sitemap generation is automatically included in the build process:

```bash
npm run build
```

This will:
1. Build the Vite application
2. Generate all sitemaps
3. Place sitemaps in the `public/` directory

### Manual Generation
For manual sitemap updates:

```bash
npm run sitemaps:generate
```

## 📝 Maintenance

### Regular Tasks
- **Daily**: Check sitemap generation logs
- **Weekly**: Verify sitemap accessibility
- **Monthly**: Review sitemap statistics

### Monitoring
- Check that all sitemap files are generated
- Verify XML structure is valid
- Test sitemap URLs return HTTP 200
- Submit to Google Search Console

## 🔍 Troubleshooting

### Common Issues

#### 1. Backend Connection Failed
```
❌ Failed to fetch doctors: Connection refused
```
**Solution**: Check `VITE_BACKEND_URL` and ensure backend is running

#### 2. No Doctors Fetched
```
✅ Fetched 0 doctors
```
**Solution**: Check API endpoint and doctor data in backend

#### 3. Permission Denied
```
Error: EACCES: permission denied
```
**Solution**: Ensure write permissions on `public/` directory

#### 4. Environment Variables Not Loaded
```
📡 API Base URL: undefined
```
**Solution**: Check `.env` file exists and has correct format

### Debug Mode
Add console logs to see detailed execution:

```bash
DEBUG=true npm run sitemaps:generate
```

## 📚 Additional Resources

- [Google Sitemap Guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [XML Sitemap Format](https://www.sitemaps.org/protocol.html)
- [Google Search Console](https://search.google.com/search-console)

---

**Note**: This sitemap system is designed to be comprehensive and SEO-friendly. Regular monitoring and updates are recommended for optimal search engine visibility.
