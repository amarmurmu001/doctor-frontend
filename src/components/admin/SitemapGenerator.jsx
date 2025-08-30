import React, { useState } from 'react';
import { 
  generateCompleteSitemap, 
  generateSitemapByType, 
  generateAndSaveSitemap 
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={handleQuickDownload}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {isGenerating ? 'Generating...' : '🚀 Quick Download'}
        </button>
        
        <button
          onClick={() => handleGenerateSitemap('all')}
          disabled={isGenerating}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {isGenerating ? 'Generating...' : '📋 Generate Complete Sitemap'}
        </button>
        
        <button
          onClick={() => handleGenerateSitemap('static')}
          disabled={isGenerating}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {isGenerating ? 'Generating...' : '🏠 Static Routes Only'}
        </button>
      </div>

      {/* Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Generate Specific Sitemap Type:
        </label>
        <div className="flex flex-wrap gap-2">
          {['blogs', 'doctors', 'categories'].map((type) => (
            <button
              key={type}
              onClick={() => handleGenerateSitemap(type)}
              disabled={isGenerating}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === type
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
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
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">What's Included in Your Sitemap</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h4 className="font-medium mb-2">Static Routes:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Home page and main navigation</li>
              <li>About, Contact, Help pages</li>
              <li>Legal pages (Privacy, Terms)</li>
              <li>Search and directory pages</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Dynamic Content:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>All published blog posts</li>
              <li>Doctor profiles by location</li>
              <li>Specialization-based pages</li>
              <li>Category and search result pages</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> The sitemap includes priority and change frequency metadata 
            to help search engines understand your content structure. Dynamic content is fetched 
            from your APIs in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SitemapGenerator;
