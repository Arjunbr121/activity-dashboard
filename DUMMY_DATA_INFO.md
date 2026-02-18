# Dummy Data Configuration - UI Testing Mode

## Current Status

✅ **API Integration: COMMENTED OUT** - The dashboard is running in **DUMMY DATA MODE** for UI testing only.

The application uses the exact JSON response structure you provided as sample/dummy data to test the UI flow.

## How It Works

### 1. Data Source
- **File**: `src/utils/sampleApiResponse.js`
- **Format**: Your exact API JSON response structure
- **Status**: Running locally without API calls

### 2. Data Flow
```
User Input (any URL)
    ↓
Validation Check (OK)
    ↓
getMockProductData() [Returns dummy JSON]
    ↓
Component renders with dummy data
    ↓
UI simulation progresses through phases
```

### 3. What's Using Dummy Data

**Files that reference dummy data:**
- `src/utils/apiService.js` - `getMockProductData()` function
- `src/utils/sampleApiResponse.js` - `sampleCompletedResponse` object
- `src/components/Dashboard.jsx` - Phase simulation with dummy data

## Testing with Dummy Data

### To Test the UI:

1. **Start the app**
   ```bash
   npm run dev
   ```

2. **Enter ANY URL**
   ```
   Example: https://amazon.com/dp/B123456
   Example: https://example.com
   Example: https://test.com
   ```

3. **Click "Start"**
   - The app will load dummy data from `sampleApiResponse.js`
   - Console will show: "Loaded dummy data: {...}"
   - UI will simulate the processing pipeline

4. **Watch the UI Flow**
   - Phase 1: Shows as completed
   - Phase 2: Shows as completed
   - Phase 3: Shows as running (active)
   - Phases 4-7: Show as pending (disabled)

5. **Click on Phases**
   - Click Phase 1 or 2 (completed) to see details
   - Click Phase 3 (active) to see current data
   - Phases 4-7 won't be clickable (disabled)

6. **Test Report Download**
   - After all phases complete, Phase 6 will show download options
   - Try PDF download
   - Try Markdown export
   - Try Report preview

## Dummy Data Structure

The dummy data includes:

```javascript
{
  status: "completed",           // Pipeline status
  current_stage: null,           // Current active stage
  stages: [...],                 // Array of phase/stage info
  report: "# Markdown...",       // Report content
  scripts: "# Scripts...",       // Generated scripts
  keywords: {...},               // Keywords and subreddits
  metadata: {...}                // Summary data
}
```

## When Real API Integration Happens

### Files to Update:
1. `src/utils/apiService.js` - Uncomment `fetchProductData()` function
2. `src/components/Dashboard.jsx` - Switch from `getMockProductData()` to real API call
3. `.env` file - Add `VITE_API_BASE_URL` environment variable

### Steps to Integrate Later:

```javascript
// IN: src/utils/apiService.js

// Uncomment this:
export const fetchProductData = async (url) => {
  try {
    const response = await fetch(`YOUR_API_ENDPOINT/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_url: url }),
    });
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Then in Dashboard.jsx, call it like:
const data = await fetchProductData(url);
```

## Console Logging

When you use dummy data, check the browser console (F12):

```
Loaded dummy data: {
  id: "80ddcee1-bc18-444a-96ca-a5c5e40bd984",
  product_url: "https://www.amazon.in/Nike-Court-Vision...",
  status: "completed",
  ...
}
```

This confirms the dummy data is loaded and ready for UI testing.

## What You Can Test Right Now

✅ **Phase Display**
- All 7 phases render correctly
- Status indicators work (pending, running, completed)
- Colors and styling display properly

✅ **Phase Navigation**
- Click on completed phases to view details
- Click on active phases to see current data
- Pending phases are disabled

✅ **Phase Details**
- Phase 1 shows: Product info
- Phase 2 shows: Keywords and subreddits
- Phase 3 shows: Video sources
- Phase 4 shows: Download stats
- Phase 5 shows: Analysis data
- Phase 6 shows: Report options
- Phase 7 shows: Script info

✅ **Report Features**
- Download as PDF button works
- Download as Markdown button works
- Report preview displays formatted content

✅ **Responsive Design**
- Works on mobile
- Works on tablet
- Works on desktop
- Animations are smooth

✅ **Animations**
- Phase transitions are smooth
- Progress bar animates
- Active phase pulses
- Hover effects work

## Dummy Data vs Real API

### Dummy Data (Current)
- ✅ No network calls
- ✅ Instant loading
- ✅ Easy to test UI
- ✅ No server required
- ❌ Doesn't use real product data
- ❌ Doesn't make API calls

### Real API (Later)
- ✅ Real product data
- ✅ Real processing pipeline
- ✅ Live updates
- ❌ Requires server
- ❌ Slower initial load
- ❌ Network dependencies

## Quick Reference

**Current Mode**: 🧪 UI Testing with Dummy Data

**Dummy Data File**: `src/utils/sampleApiResponse.js`

**API Integration**: COMMENTED OUT (see `src/utils/apiService.js`)

**To Use Real API Later**: Uncomment `fetchProductData()` function

**To Change Dummy Data**: Edit `sampleApiResponse.js` → `sampleCompletedResponse` object

## Environment Check

To confirm dummy data is being used, add this to browser console:

```javascript
// In browser DevTools Console:
localStorage.setItem('uiTestMode', 'true');
console.log('UI Testing Mode with Dummy Data');
```

## FAQ

**Q: Why am I seeing dummy data?**
A: API integration is intentionally commented out for UI testing. The app loads sample JSON data.

**Q: Can I change the dummy data?**
A: Yes! Edit `src/utils/sampleApiResponse.js` to modify the sample response.

**Q: How do I know when real API is being used?**
A: Check browser Network tab (F12) - you'll see API calls going to your backend.

**Q: Will the dummy data work in production?**
A: No - you must integrate real API before deploying to production.

**Q: Can I test the UI without internet?**
A: Yes! Dummy data works completely offline since there are no API calls.

---

## Next Steps

1. ✅ Test UI flow with dummy data (RIGHT NOW!)
2. ✅ Verify all phases work as expected
3. ✅ Test PDF download
4. ✅ Explore all phase details
5. ⏭️ When ready, uncomment API integration
6. ⏭️ Connect to your real backend
7. ⏭️ Deploy to production

**Happy UI testing! 🚀**
