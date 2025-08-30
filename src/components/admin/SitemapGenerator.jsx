import React, { useState } from 'react';
import {
  generateCompleteSitemap,
  generateSitemapByType,
  generateAndSaveSitemap,
  generateAndSaveAllSitemaps
} from '../../utils/sitemapGenerator';

const SitemapGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [sitemapContent, setSitemapContent] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const handleGenerateSitemap = async (type = 'all') => {
    setIsGenerating(true);
    setError('');
    setSitemapContent('');
    setStats(null);

    try {
      let xmlContent;
      let urlCount = 0;

      if (type === 'all') {
        xmlContent = await generateCompleteSitemap();
        // Extract URL count from the XML content
        const urlMatches = xmlContent.match(/<url>/g);
        urlCount = urlMatches ? urlMatches.length : 0;
      } else {
        xmlContent = await generateSitemapByType(type);
        const urlMatches = xmlContent.match(/<url>/g);
        urlCount = urlMatches ? urlMatches.length : 0;
      }

      setSitemapContent(xmlContent);
      setStats({
        type: type === 'all' ? 'Complete Sitemap' : `${type.charAt(0).toUpperCase() + type.slice(1)} Sitemap`,
        urlCount,
        generatedAt: new Date().toLocaleString()
      });

    } catch (err) {
      setError(`Error generating sitemap: ${err.message}`);
      console.error('Sitemap generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSitemap = () => {
    if (!sitemapContent) return;

    const blob = new Blob([sitemapContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `sitemap-${selectedType}-${new Date().toISOString().split('T')[0]}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  };

  const handleQuickDownload = async () => {
    try {
      await generateAndSaveSitemap();
    } catch (err) {
      setError(`Error downloading sitemap: ${err.message}`);
    }
  };

  const handleGenerateAllSitemaps = async () => {
    setIsGenerating(true);
    setError('');
    setStats(null);

    try {
      await generateAndSaveAllSitemaps();
      setStats({
        type: 'All Sitemaps',
        urlCount: 'Multiple files generated',
        generatedAt: new Date().toLocaleString()
      });
    } catch (err) {
      setError(`Error generating all sitemaps: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!sitemapContent) return;
    
    navigator.clipboard.writeText(sitemapContent).then(() => {
      // You could add a toast notification here
      alert('Sitemap content copied to clipboard!');
    }).catch(() => {
      setError('Failed to copy to clipboard');
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Sitemap Generator</h1>
        <p className="text-gray-600">
          Generate comprehensive sitemaps for your website including static routes, dynamic content, 
          doctor profiles, blog posts, and search results.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button
          onClick={handleGenerateAllSitemaps}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg"
        >
          {isGenerating ? 'Generating...' : '🎯 Generate All Sitemaps'}
        </button>

        <button
          onClick={handleQuickDownload}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          {isGenerating ? 'Generating...' : '🚀 Quick Download'}
        </button>

        <button
          onClick={() => handleGenerateSitemap('all')}
          disabled={isGenerating}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          {isGenerating ? 'Generating...' : '📋 Complete Sitemap'}
        </button>

        <button
          onClick={() => handleGenerateSitemap('static')}
          disabled={isGenerating}
          className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          {isGenerating ? 'Generating...' : '🏠 Static Routes'}
        </button>
      </div>

      {/* Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Generate Specific Sitemap Type:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            'blogs', 'doctors', 'categories', 'locations',
            'tier1-locations', 'tier2-locations', 'tier3-locations',
            'conditions', 'search'
          ].map((type) => (
            <button
              key={type}
              onClick={() => handleGenerateSitemap(type)}
              disabled={isGenerating}
              className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                selectedType === type
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Stats Display */}
      {stats && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <strong>Type:</strong> {stats.type}
            </div>
            <div>
              <strong>URLs Generated:</strong> {stats.urlCount}
            </div>
            <div>
              <strong>Generated At:</strong> {stats.generatedAt}
            </div>
          </div>
        </div>
      )}

      {/* Sitemap Content Display */}
      {sitemapContent && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Generated Sitemap</h3>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                📋 Copy to Clipboard
              </button>
              <button
                onClick={handleDownloadSitemap}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                💾 Download XML
              </button>
            </div>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap">
              {sitemapContent}
            </pre>
          </div>
        </div>
      )}

      {/* Information Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">🎯 Comprehensive SEO Sitemap Coverage</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-semibold mb-3 text-blue-900 flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              Static Routes
            </h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Home page and navigation</li>
              <li>• About, Contact, Help pages</li>
              <li>• Legal pages (Privacy, Terms)</li>
              <li>• Search and directory pages</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-blue-900 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              Location Coverage
            </h4>
            <ul className="space-y-1 text-blue-700">
              <li>• 200+ Indian cities</li>
              <li>• Tier-based prioritization</li>
              <li>• City-specific doctor pages</li>
              <li>• Regional specialization pages</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-blue-900 flex items-center">
              <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
              Medical Content
            </h4>
            <ul className="space-y-1 text-blue-700">
              <li>• 20+ medical specializations</li>
              <li>• Subspecialization pages</li>
              <li>• Treatment condition pages</li>
              <li>• Healthcare facility types</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <h4 className="font-semibold mb-3 text-blue-900 flex items-center">
              <span className="w-2 h-2 bg-orange-600 rounded-full mr-2"></span>
              Dynamic Content
            </h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Published blog posts</li>
              <li>• Individual doctor profiles</li>
              <li>• Search result pages</li>
              <li>• Category landing pages</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-blue-900 flex items-center">
              <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
              Emergency Services
            </h4>
            <ul className="space-y-1 text-blue-700">
              <li>• 24x7 availability pages</li>
              <li>• Emergency care services</li>
              <li>• Ambulance services</li>
              <li>• Home visit services</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">SEO Optimization Features</h4>
              <p className="text-blue-800 text-sm">
                Each URL includes priority levels, change frequency metadata, and last modification dates.
                Location-based pages are prioritized by city tier (Tier 1 cities get higher priority).
                Dynamic content is fetched in real-time from your APIs for maximum freshness.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
          <p className="text-green-800 text-sm font-medium">
            🚀 <strong>Pro Tip:</strong> Use "Generate All Sitemaps" to create a complete sitemap index with
            separate files for different content types, providing better SEO organization and faster crawling.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SitemapGenerator;
