// API Service for fetching product intelligence data
// Maps API response to component-friendly structure

// ⚠️ API INTEGRATION COMMENTED OUT - USING DUMMY DATA FOR UI TESTING
// To integrate real API later, uncomment the fetchProductData function below

/*
export const fetchProductData = async (url) => {
  // In production, this would call your actual backend API
  // For now, returning the structure that your API provides
  try {
    const response = await fetch(`/api/products/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product_url: url }),
    });
    
    if (!response.ok) throw new Error('Failed to fetch product data');
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
*/

// ✅ USING DUMMY DATA FOR UI TESTING
// Import sample data at the top level
import { sampleCompletedResponse } from './sampleApiResponse';

export const getMockProductData = () => {
  // Return completed response for testing the UI flow
  // This is your actual JSON structure from the API response
  return sampleCompletedResponse;
};

// Map API stages to UI phases
export const mapStagesToPhases = (stages) => {
  const stageNameToPhaseId = {
    fetch_product: 1,
    keywords: 2,
    video_scrape: 3,
    download: 4,
    analysis: 5,
    report: 6,
    scripts: 7,
  };

  return stages.map((stage) => ({
    ...stage,
    phaseId: stageNameToPhaseId[stage.stage_name] || 0,
  }));
};

// Extract data for each phase
export const extractPhaseData = (apiResponse, phaseId) => {
  const stageName = {
    1: 'fetch_product',
    2: 'keywords',
    3: 'video_scrape',
    4: 'download',
    5: 'analysis',
    6: 'report',
    7: 'scripts',
  }[phaseId];

  const stage = apiResponse.stages?.find((s) => s.stage_name === stageName);

  switch (phaseId) {
    case 1: // fetch_product
      return {
        title: 'Product Fetched',
        data: [
          `Product URL: ${apiResponse.product_url}`,
          `Product Name: ${stage?.metadata?.product_name || 'N/A'}`,
          `Category: ${stage?.metadata?.category || 'N/A'}`,
          `Status: ${apiResponse.status}`,
        ],
      };

    case 2: // keywords
      return {
        title: 'Keywords Generated',
        keywords: apiResponse.keywords?.search_queries?.slice(0, 6) || [
          'product review',
          'unboxing',
          'features',
          'pricing',
          'comparison',
          'setup guide',
        ],
        subreddits: apiResponse.keywords?.subreddits?.slice(0, 5) || [],
      };

    case 3: // video_scrape
      return {
        title: 'Videos Scraped',
        sources: [
          { name: 'YouTube', count: 10, icon: '🎥' },
          { name: 'TikTok', count: 3, icon: '🎬' },
          { name: 'Instagram', count: 3, icon: '📷' },
          { name: 'YouTube Shorts', count: 10, icon: '📹' },
        ],
      };

    case 4: // download
      return {
        title: 'Downloads Completed',
        data: [
          'Total Videos Downloaded: 26',
          'Transcripts Extracted: 24',
          'Analysis Ready',
        ],
      };

    case 5: // analysis
      return {
        title: 'Analysis Complete',
        pros: ['High engagement', 'Good quality', 'Authentic reviews'],
        cons: ['Limited diversity', 'Some fake reviews'],
      };

    case 6: // report
      return {
        title: 'Report Generated',
        data: [
          `Report Pages: ${stage?.metadata?.report_pages || '42'}`,
          `Sections: ${stage?.metadata?.sections || '10'}`,
          'Ready for download',
        ],
        hasReport: true,
      };

    case 7: // scripts
      return {
        title: 'Scripts Created',
        data: [
          `Scripts Generated: ${stage?.metadata?.scripts_generated || '3'}`,
          `Platforms: ${stage?.metadata?.platforms?.join(', ') || 'TikTok, Instagram, YouTube'}`,
          'All scripts ready for deployment',
        ],
        hasScripts: true,
      };

    default:
      return null;
  }
};
