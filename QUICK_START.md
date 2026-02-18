# Quick Start Guide - Activity Dashboard

## What's Been Built

Your React dashboard now has:

### 1. **State Management**
- ✅ Running state: Shows active processing with animations
- ✅ Completed state: Shows finished processes with full data access
- ✅ Pending state: Shows disabled/locked phases until they're ready

### 2. **7-Phase Pipeline**
```
Phase 1: Fetch Product    → Validate & fetch product data
Phase 2: Keywords         → Generate search keywords & subreddits
Phase 3: Video Scrape     → Scrape videos from multiple platforms
Phase 4: Download         → Download and process videos
Phase 5: Analysis         → Extract insights and sentiment
Phase 6: Report           → Generate comprehensive report (PDF/Markdown)
Phase 7: Scripts          → Create platform-specific video scripts
```

### 3. **Interactive Features**
- Click on completed/active phases to see detailed data
- Pending phases are disabled and grayed out
- Real-time progress bar
- Live statistics during processing
- Report preview with markdown formatting

### 4. **Report Management**
In Phase 6 (Report), you can:
- 📄 **Download as PDF** - One-click PDF generation
- 📝 **Download as Markdown** - Raw markdown file
- 👁️ **Preview Report** - View formatted report inline

## Running the Application

### Start Development Server
```bash
cd /Users/arjunbr/Desktop/test_practise/activity-dashboard
npm run dev
```

Visit `http://localhost:5173` in your browser

### Build for Production
```bash
npm run build
```

## How to Use

1. **Enter a Product URL**
   - Paste any e-commerce product URL
   - Click "Start" or press Enter
   - Example: `https://amazon.com/dp/B0123456789`

2. **Watch the Pipeline**
   - Progress bar shows overall completion
   - Each phase box updates as it processes
   - Completed phases turn green
   - Active phase shows cyan with animation

3. **Explore Phase Details**
   - Click on any green (completed) phase
   - Click on the currently active phase
   - See extracted data for that phase
   - Pending phases are locked (disabled)

4. **Download Report** (Phase 6)
   - Click the Phase 6 box when it completes
   - Choose PDF, Markdown, or Preview
   - PDF auto-downloads with current date

## API Response Integration

Your API returns data like this:

```javascript
{
  status: "running",           // or "completed"
  current_stage: "video_scrape",
  stages: [                    // Array of processing stages
    {
      stage_name: "fetch_product",
      status: "completed",     // or "running" or "pending"
      metadata: { ... }
    },
    // ... more stages
  ],
  report: "# Markdown Content...",
  keywords: { ... },
  scripts: "# Script Content..."
}
```

The dashboard maps this automatically to:
- **Status** → Phase visual state
- **Stages** → Phase completion tracking
- **Metadata** → Detailed phase information
- **Report** → PDF/Markdown download

## Key Files to Understand

### `src/utils/apiService.js`
- Maps API response to component data
- `extractPhaseData()` - Extracts info for each phase
- Update `fetchProductData()` to connect to your API

### `src/utils/pdfGenerator.js`
- Generates PDF from markdown
- `generatePDFFromMarkdown()` - Main function
- `downloadMarkdown()` - Save as .md file

### `src/components/Dashboard.jsx`
- Main dashboard logic
- Phase state management
- API data integration

### `src/components/PhaseDetail.jsx`
- Displays phase-specific information
- Download buttons for Phase 6
- Report preview functionality

## Connecting Your Real API

1. **Open** `src/utils/apiService.js`

2. **Find** `fetchProductData()` function

3. **Replace** with your API endpoint:
```javascript
export const fetchProductData = async (url) => {
  const response = await fetch(`https://your-api.com/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_url: url })
  });
  return response.json();
};
```

4. **Update** `getMockProductData()`:
```javascript
export const getMockProductData = async () => {
  return await fetchProductData(productUrl);
};
```

## Customization Examples

### Change Phase Colors
Edit phase status classes in `Dashboard.jsx`:
```javascript
// Active = Cyan
className="bg-cyan-500/30 border-cyan-500"

// Completed = Green
className="bg-emerald-500/20 border-emerald-500"

// Pending = Gray
className="bg-slate-800/50 border-slate-700"
```

### Add More Phases
1. Add to `phases` array in `Dashboard.jsx`
2. Add case in `extractPhaseData()` in `apiService.js`
3. Update ID mapping in `mapStagesToPhases()`

### Change PDF Styling
Edit `pdfGenerator.js` `markdownToHtml()` function

## Viewing Sample Data

The app ships with test data. To test:

1. Start the dev server: `npm run dev`
2. Enter any URL: `https://example.com`
3. Click "Start"
4. Watch it progress through all phases
5. Test PDF download in Phase 6

Sample data comes from `sampleApiResponse.js` - modify it to test different scenarios.

## Common Tasks

### Disable a Phase
In `Dashboard.jsx`, find the phase and change `status`:
```javascript
status: 'pending' // Won't be clickable
```

### Change Report Content
Edit `sampleApiResponse.js` `report` field with your markdown

### Add Loading Spinner
Wrap content with:
```javascript
{loading && <LoadingSpinner />}
```

### Add Error Boundary
```javascript
<ErrorBoundary>
  <PhaseDetail {...props} />
</ErrorBoundary>
```

## Troubleshooting

**PDF Download Not Working?**
- Check browser console (F12) for errors
- Ensure popup blocker is disabled
- Try a different browser

**Report Not Showing?**
- Verify `apiData.report` has content
- Check PhaseDetail component console logs
- Ensure phase is completed (Phase 6)

**Phases Not Updating?**
- Verify API response has `stages` array
- Check `currentPhase` state in Dashboard
- Review `getPhaseStatus()` logic

**Performance Issues?**
- PDF generation is CPU-intensive
- Reduce report size
- Use browser DevTools to profile

## Next Steps

1. ✅ Install and test locally
2. ✅ Connect your real API
3. ✅ Customize colors/styling
4. ✅ Test all phases with real data
5. ✅ Deploy to production

## Support Resources

- **React Docs**: https://react.dev
- **Framer Motion**: https://www.framer.com/motion
- **Tailwind CSS**: https://tailwindcss.com
- **jsPDF**: https://github.com/parallax/jsPDF

---

**Ready to go!** Start with `npm run dev` and test it out. 🚀
