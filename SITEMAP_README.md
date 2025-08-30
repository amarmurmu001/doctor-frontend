# Sitemap Generator for Doctor Website

This project includes a comprehensive sitemap generator that creates XML sitemaps for both static and dynamic routes on your doctor website.

## 🚀 Features

- **Static Routes**: All main pages (Home, About, Contact, etc.)
- **Dynamic Routes**: Doctor profiles, blog posts, search results
- **Location-based URLs**: Doctor listings by city/location
- **Specialization Pages**: Doctor categories by medical specialty
- **Search Result Pages**: Common medical search queries
- **Blog Content**: All published blog posts with categories
- **SEO Optimized**: Includes priority and change frequency metadata

## 📁 Files Created

- `src/utils/sitemapGenerator.js` - Core sitemap generation logic
- `src/components/admin/SitemapGenerator.jsx` - Admin interface component
- `scripts/generate-sitemap.cjs` - Command-line script
- `scripts/test-sitemap.cjs` - Test script
- `SITEMAP_README.md` - This documentation

## 🛠️ Usage

### Option 1: Admin Panel Interface

1. Navigate to `/admin/sitemap` in your admin panel
2. Use the interface to generate different types of sitemaps
3. Download or copy the generated XML content

### Option 2: Command Line Script

```bash
# Generate complete sitemap (includes all routes)
npm run sitemap

# Generate static routes only
npm run sitemap:static

# Show help
npm run sitemap:help

# Test the generator
npm run sitemap:test

# Or run directly with node
node scripts/generate-sitemap.cjs
node scripts/generate-sitemap.cjs static
node scripts/generate-sitemap.cjs help
```

### Option 3: Programmatic Usage

```javascript
import { generateCompleteSitemap, generateSitemapByType } from './src/utils/sitemapGenerator';

// Generate complete sitemap
const sitemapXML = await generateCompleteSitemap();

// Generate specific type
const blogSitemap = await generateSitemapByType('blogs');
const doctorSitemap = await generateSitemapByType('doctors');
```

## 🔧 Configuration

### Environment Variables

Set `VITE_FRONTEND_URL` in your `.env` file:

```env
VITE_FRONTEND_URL=https://yourdomain.com
```

### Customizing Routes

Edit the constants in `scripts/generate-sitemap.cjs`:

```javascript
// Add more locations
const MAJOR_LOCATIONS = [
  'mumbai', 'delhi', 'bangalore',
  // Add your cities here
];

// Add more specializations
const DOCTOR_SPECIALIZATIONS = [
  'cardiologist', 'dermatologist',
  // Add your specialties here
];
```

## 📊 What's Included

### Static Routes (18 routes)
- Home page (`/`) - Priority: 1.0, Daily updates
- About, Contact, Help pages - Priority: 0.7-0.8, Monthly updates
- Legal pages (Privacy, Terms) - Priority: 0.4, Yearly updates
- Search and directory pages - Priority: 0.8-0.9, Weekly/Daily updates

### Dynamic Routes
- **Doctor Profiles**: Location + specialization combinations
- **Blog Posts**: All published blog posts with categories
- **Search Results**: Common medical search queries
- **Category Pages**: Medical specialties and blog categories

### Example Generated URLs

```
https://yourdomain.com/mumbai/cardiologist
https://yourdomain.com/delhi/dermatologist
https://yourdomain.com/blog/category/health
https://yourdomain.com/doctors/cardiologist
https://yourdomain.com/search?q=cardiology
```

## 📈 Sitemap Statistics

A typical complete sitemap will include:
- **Static Routes**: 18 URLs
- **Doctor Profiles**: 580+ URLs (29 locations × 20 specializations)
- **Search Results**: 12 URLs
- **Categories**: 25+ URLs
- **Total**: 635+ URLs

## 🔍 SEO Benefits

- **Search Engine Discovery**: Helps search engines find all your pages
- **Priority Indication**: Tells search engines which pages are most important
- **Update Frequency**: Indicates how often content changes
- **Last Modified**: Shows when content was last updated
- **Comprehensive Coverage**: Includes all static and dynamic content

## 🚨 Important Notes

1. **API Dependencies**: The generator fetches real data from your APIs
2. **Rate Limiting**: Be mindful of API rate limits when generating large sitemaps
3. **File Size**: Large sitemaps may need to be split into multiple files
4. **Search Console**: Submit your sitemap to Google Search Console for better indexing

## 🐛 Troubleshooting

### Common Issues

1. **API Errors**: Check your backend API endpoints and authentication
2. **Empty Sitemaps**: Verify that your APIs return data
3. **File Permissions**: Ensure the script can write to the public directory

### Debug Mode

Add console logging to see what's happening:

```javascript
// In scripts/generate-sitemap.cjs
console.log('Fetched blogs:', blogs);
console.log('Generated URLs:', urls);
```

## 🔄 Automation

### Cron Job (Linux/Mac)

Add to your crontab to generate sitemaps automatically:

```bash
# Generate sitemap daily at 2 AM
0 2 * * * cd /path/to/your/project && npm run sitemap

# Generate sitemap weekly on Sunday at 3 AM
0 3 * * 0 cd /path/to/your/project && npm run sitemap
```

### GitHub Actions

Create `.github/workflows/sitemap.yml`:

```yaml
name: Generate Sitemap
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  push:
    branches: [main]

jobs:
  generate-sitemap:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run sitemap
      - run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add public/sitemap.xml
          git commit -m "Update sitemap" || exit 0
          git push
```

## 📚 Additional Resources

- [Sitemap Protocol](https://www.sitemaps.org/protocol.html)
- [Google Sitemap Guidelines](https://developers.google.com/search/docs/advanced/sitemaps/overview)
- [XML Sitemap Best Practices](https://moz.com/learn/seo/xml-sitemaps)

## 🤝 Contributing

To improve the sitemap generator:

1. Add new route types in `scripts/generate-sitemap.cjs`
2. Update the admin interface in `SitemapGenerator.jsx`
3. Test with different content types
4. Update this documentation

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify your API endpoints are working
3. Check the command-line script output
4. Review the generated XML for syntax errors

---

**Happy Sitemap Generation! 🎉**
