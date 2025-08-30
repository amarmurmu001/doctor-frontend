#!/usr/bin/env node

/**
 * Test script for the sitemap generator
 * Run with: node scripts/test-sitemap.cjs
 */

const { generateCompleteSitemap, generateSitemapXML } = require('./generate-sitemap.cjs');

async function testSitemapGenerator() {
  console.log('🧪 Testing Sitemap Generator...\n');
  
  try {
    // Test 1: Generate complete sitemap
    console.log('Test 1: Generating complete sitemap...');
    const urls = generateCompleteSitemap();
    
    if (!Array.isArray(urls)) {
      throw new Error('generateCompleteSitemap should return an array');
    }
    
    console.log(`✅ Generated ${urls.length} URLs`);
    
    // Test 2: Generate XML
    console.log('\nTest 2: Generating XML sitemap...');
    const xml = generateSitemapXML(urls);
    
    if (typeof xml !== 'string') {
      throw new Error('generateSitemapXML should return a string');
    }
    
    if (!xml.includes('<?xml version="1.0"')) {
      throw new Error('XML should start with XML declaration');
    }
    
    if (!xml.includes('<urlset')) {
      throw new Error('XML should contain urlset element');
    }
    
    console.log(`✅ Generated XML sitemap (${xml.length} characters)`);
    
    // Test 3: Validate URL structure
    console.log('\nTest 3: Validating URL structure...');
    const urlCount = (xml.match(/<url>/g) || []).length;
    const locCount = (xml.match(/<loc>/g) || []).length;
    
    if (urlCount !== locCount) {
      throw new Error(`URL count mismatch: ${urlCount} URLs vs ${locCount} locations`);
    }
    
    if (urlCount !== urls.length) {
      throw new Error(`URL count mismatch: ${urlCount} in XML vs ${urls.length} in array`);
    }
    
    console.log(`✅ URL structure validation passed (${urlCount} URLs)`);
    
    // Test 4: Check for required elements
    console.log('\nTest 4: Checking required XML elements...');
    const requiredElements = ['<loc>', '<lastmod>', '<priority>', '<changefreq>'];
    
    for (const element of requiredElements) {
      if (!xml.includes(element)) {
        throw new Error(`Missing required element: ${element}`);
      }
    }
    
    console.log('✅ All required XML elements present');
    
    // Test 5: Sample URL validation
    console.log('\nTest 5: Validating sample URLs...');
    const sampleUrls = urls.slice(0, 5);
    
    for (const url of sampleUrls) {
      if (!url.path || !url.priority || !url.changefreq || !url.lastmod) {
        throw new Error(`Invalid URL object: ${JSON.stringify(url)}`);
      }
      
      if (!url.path.startsWith('/')) {
        throw new Error(`URL path should start with /: ${url.path}`);
      }
      
      if (url.priority < 0 || url.priority > 1) {
        throw new Error(`Priority should be between 0 and 1: ${url.priority}`);
      }
    }
    
    console.log('✅ Sample URL validation passed');
    
    // Test 6: Check for specific route types
    console.log('\nTest 6: Checking route type coverage...');
    
    const hasHomePage = urls.some(url => url.path === '/');
    const hasAboutPage = urls.some(url => url.path === '/about');
    const hasDoctorRoutes = urls.some(url => url.path.includes('/doctor'));
    const hasBlogRoutes = urls.some(url => url.path.includes('/blog'));
    
    if (!hasHomePage) throw new Error('Missing home page route');
    if (!hasAboutPage) throw new Error('Missing about page route');
    if (!hasDoctorRoutes) throw new Error('Missing doctor routes');
    if (!hasBlogRoutes) throw new Error('Missing blog routes');
    
    console.log('✅ Route type coverage validation passed');
    
    // Summary
    console.log('\n🎉 All tests passed successfully!');
    console.log(`\n📊 Sitemap Summary:`);
    console.log(`   - Total URLs: ${urls.length}`);
    console.log(`   - XML Size: ${(xml.length / 1024).toFixed(2)} KB`);
    console.log(`   - Home Page Priority: ${urls.find(u => u.path === '/')?.priority}`);
    console.log(`   - Generated At: ${new Date().toLocaleString()}`);
    
    // Show sample URLs
    console.log(`\n🔗 Sample URLs:`);
    urls.slice(0, 10).forEach((url, index) => {
      console.log(`   ${index + 1}. ${url.path} (Priority: ${url.priority}, Frequency: ${url.changefreq})`);
    });
    
    if (urls.length > 10) {
      console.log(`   ... and ${urls.length - 10} more URLs`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

// Run tests
if (require.main === module) {
  testSitemapGenerator();
}

module.exports = { testSitemapGenerator };
