# API Integration Example

This guide shows how to connect the dashboard to your actual backend API.

## Current Setup

The dashboard currently uses **mock data** from `src/utils/sampleApiResponse.js`.

To use real API calls, follow these steps:

## Step 1: Update `apiService.js`

Find `src/utils/apiService.js` and modify the `fetchProductData` function:

### Before (Mock):
```javascript
export const getMockProductData = () => {
  const { sampleCompletedResponse } = require('./sampleApiResponse');
  return sampleCompletedResponse;
};
```

### After (Real API):
```javascript
// For initial request
export const fetchProductData = async (url) => {
  try {
    const response = await fetch('https://your-api.com/api/products/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth headers if needed:
        // 'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ product_url: url }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch product data:', error);
    throw new Error('Could not process URL. Please check the URL and try again.');
  }
};

// For polling updates (if you want real-time updates)
export const pollProductStatus = async (productId, intervalMs = 2000) => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`https://your-api.com/api/products/${productId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch status');
        }

        const data = await response.json();
        
        // Call with data (you'll pass a callback from Dashboard)
        return data;
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, intervalMs);

    // Return interval ID so we can clear it later
    return interval;
  });
};

// Wrapper for testing
export const getMockProductData = async (url) => {
  // In development, use mock data
  if (process.env.NODE_ENV === 'development' && !url.includes('http')) {
    const { sampleCompletedResponse } = require('./sampleApiResponse');
    return sampleCompletedResponse;
  }

  // In production, use real API
  return await fetchProductData(url);
};
```

## Step 2: Update Dashboard Component

Modify `src/components/Dashboard.jsx` to use real API calls with polling:

### Current:
```javascript
const handleStartProcess = (url) => {
  // ... validation ...
  
  setProductUrl(url);
  setIsProcessing(true);
  setCurrentPhase(0);
  
  try {
    const data = getMockProductData();
    setApiData(data);
    simulateProcessing();
  } catch (err) {
    setError('Failed to fetch product data: ' + err.message);
    setIsProcessing(false);
  }
};
```

### Updated (with polling):
```javascript
const handleStartProcess = async (url) => {
  // ... validation ...
  
  setProductUrl(url);
  setIsProcessing(true);
  setCurrentPhase(0);
  setSelectedPhase(null);

  try {
    // Initial request
    const initialData = await fetchProductData(url);
    setApiData(initialData);
    
    // If already completed, skip polling
    if (initialData.status === 'completed') {
      setIsProcessing(false);
      return;
    }

    // Start polling for updates
    pollProductUpdates(initialData.id);
  } catch (err) {
    setError('Failed to process URL: ' + err.message);
    setIsProcessing(false);
  }
};

const pollProductUpdates = (productId) => {
  const intervalMs = 2000; // Poll every 2 seconds
  const maxAttempts = 180; // Max 6 minutes
  let attempts = 0;

  const interval = setInterval(async () => {
    attempts++;

    try {
      const response = await fetch(
        `https://your-api.com/api/products/${productId}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch status');
      }

      const data = await response.json();
      setApiData(data);

      // Map stages to phases for progress tracking
      const currentStageIndex = data.stages.findIndex(
        (s) => s.status === 'running'
      );
      setCurrentPhase(currentStageIndex >= 0 ? currentStageIndex : data.stages.length - 1);

      // Stop polling when complete
      if (data.status === 'completed') {
        clearInterval(interval);
        setIsProcessing(false);
      }

      // Give up after max attempts
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setError('Processing timeout. Please try again.');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Polling error:', error);
      clearInterval(interval);
      setError('Lost connection to server: ' + error.message);
      setIsProcessing(false);
    }
  }, intervalMs);

  return interval;
};
```

## Step 3: Add Import Statements

Add to top of `Dashboard.jsx`:

```javascript
import { fetchProductData, pollProductStatus } from '../utils/apiService';
```

## Step 4: Environment Variables

Create `.env` file in project root:

```env
VITE_API_BASE_URL=https://your-api.com/api
VITE_API_TIMEOUT=30000
```

Then use in `apiService.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000;

export const fetchProductData = async (url) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(`${API_BASE_URL}/products/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_url: url }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

## Step 5: Add Error Handling

Update `PhaseDetail.jsx` to handle API errors:

```javascript
const PhaseDetail = ({ phase, productUrl, apiData, phaseData, error }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [showReportPreview, setShowReportPreview] = useState(false);

  // Show error if phase failed
  if (apiData?.status === 'error' && phase.id - 1 === apiData?.error_stage) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm"
      >
        <strong>Error in {phase.name}:</strong>
        <p className="mt-2">{apiData?.error_message || 'Unknown error occurred'}</p>
      </motion.div>
    );
  }

  // ... rest of component
};
```

## Example: Complete Flow

Here's a complete example of how the flow works:

```javascript
// 1. User enters URL and clicks Start
const handleStartProcess = async (url) => {
  setIsProcessing(true);

  // 2. Make API request
  const data = await fetchProductData(url);
  console.log('Initial response:', data);
  // Output:
  // {
  //   id: "abc123",
  //   status: "running",
  //   current_stage: "keywords",
  //   stages: [
  //     { stage_name: "fetch_product", status: "completed" },
  //     { stage_name: "keywords", status: "running" },
  //     { stage_name: "video_scrape", status: "pending" },
  //     ...
  //   ]
  // }

  setApiData(data);

  // 3. Start polling for updates
  const interval = setInterval(async () => {
    const updated = await fetch(`/api/products/${data.id}`).then(r => r.json());
    
    console.log('Updated response:', updated);
    // After 10 seconds:
    // { ..., current_stage: "video_scrape", stages: [...updated...] }
    
    setApiData(updated);

    // 4. Stop when complete
    if (updated.status === 'completed') {
      clearInterval(interval);
      setIsProcessing(false);
      // User can now download report from Phase 6
    }
  }, 2000);
};
```

## Expected API Response Schema

Your API should return responses matching this schema:

```javascript
{
  // Unique identifier for this processing job
  id: string,

  // The product URL being processed
  product_url: string,

  // Current status of the entire job
  status: 'pending' | 'running' | 'completed' | 'error',

  // Which stage is currently active
  current_stage: string | null,

  // Error message if status is 'error'
  error_message: string | null,

  // ISO 8601 timestamps
  created_at: string,
  updated_at: string,
  completed_at: string | null,

  // Metadata about the process
  metadata: {
    summary: {
      video_counts: {
        tiktok: number,
        youtube: number,
        instagram: number,
        youtube_shorts: number
      },
      keywords_count: number
    },
    completed_stages: string[],
    stage_completed_at: {
      [stageName]: string // ISO timestamp
    }
  },

  // Array of all processing stages
  stages: [
    {
      stage_name: string,
      stage_order: number,
      status: 'pending' | 'running' | 'completed' | 'error',
      error_message: string | null,
      started_at: string | null,
      completed_at: string | null,
      metadata: object // Stage-specific data
    }
  ],

  // Final report in Markdown format
  report: string,

  // Generated video scripts
  scripts: string,

  // Keywords and search data
  keywords: {
    subreddits: string[],
    search_queries: string[]
  }
}
```

## Testing Integration

After updating the API calls:

```bash
# 1. Start dev server
npm run dev

# 2. Check browser DevTools (F12)
# - Console should show API requests
# - Network tab should show API calls
# - Vue/React DevTools should show state changes

# 3. Test with a real product URL
# - Enter URL in input
# - Click Start
# - Watch console for API responses
# - Verify phases update correctly
```

## Debugging Tips

```javascript
// Add logging to see all API calls
const originalFetch = fetch;
window.fetch = function(...args) {
  console.log('API Call:', args[0], args[1]?.body);
  return originalFetch.apply(this, args);
};

// Monitor state changes
useEffect(() => {
  console.log('API Data updated:', apiData);
}, [apiData]);

// Check phase mapping
console.log('Current phase:', currentPhase);
console.log('Phase status:', getPhaseStatus(currentPhase));
```

## Production Checklist

- [ ] Update `VITE_API_BASE_URL` env var
- [ ] Add authentication headers if needed
- [ ] Implement error boundaries
- [ ] Add request timeout handling
- [ ] Test with real API endpoint
- [ ] Monitor network requests
- [ ] Add analytics/logging
- [ ] Test error scenarios
- [ ] Verify PDF generation works
- [ ] Test on different browsers
- [ ] Load test with multiple requests
- [ ] Document API requirements

## Common Issues

### CORS Errors
If you see CORS errors, your backend needs to allow requests from your frontend:

```javascript
// Backend (Node.js/Express example):
app.use(cors({
  origin: 'https://your-dashboard-domain.com',
  methods: ['GET', 'POST'],
  credentials: true
}));
```

### Timeout
If processing takes longer than expected, increase timeout:

```javascript
export const POLL_TIMEOUT = 300000; // 5 minutes
```

### Missing Data
If phases show no data, check:
1. API returns proper `metadata` for each stage
2. `extractPhaseData()` handles your metadata structure
3. API response matches expected schema

## Support

For API integration help, check:
- Backend API documentation
- Network tab in DevTools (F12)
- Console errors and warnings
- Sample responses in `sampleApiResponse.js`
