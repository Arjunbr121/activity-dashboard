# UI Testing Guide - Dummy Data Mode

## ✅ Current Status

**Dashboard is running in DUMMY DATA MODE** for UI testing.

**API Integration: COMMENTED OUT** (will add real API later)

**Using Your Exact JSON Structure** as sample data

---

## 🚀 Quick Start Testing

### Step 1: Start the App
```bash
cd /Users/arjunbr/Desktop/test_practise/activity-dashboard
npm run dev
```

### Step 2: Open in Browser
```
http://localhost:5173
```

### Step 3: Test the UI Flow
```
1. Enter any URL (e.g., https://amazon.com/dp/B123456)
2. Click "Start"
3. Watch the pipeline progress through phases
4. Click phases to view details
5. Download report as PDF or Markdown
```

---

## 📋 What to Test

### ✓ Phase Display
- [ ] All 7 phases render correctly
- [ ] Phases have correct names and icons
- [ ] Color coding is correct:
  - Green = Completed (Phase 1, 2)
  - Cyan = Running (Phase 3)
  - Gray = Pending (Phases 4-7)

### ✓ Phase Interactions
- [ ] Click Phase 1 (completed) → Shows product info
- [ ] Click Phase 2 (completed) → Shows keywords & subreddits
- [ ] Click Phase 3 (running) → Shows video sources
- [ ] Click Phase 4-7 (pending) → Does nothing (disabled)
- [ ] Click active/completed phase again → Details close

### ✓ Phase Details Content

**Phase 1 Details:**
- Product URL
- Product Name: Nike Mens Court Vision Low Next Nature Sneaker
- Category: Casual Shoes
- Status: Running

**Phase 2 Details:**
- Keywords list (12 items)
- Subreddits list (10 items)

**Phase 3 Details:**
- YouTube: 10 videos
- TikTok: 3 videos
- Instagram: 3 videos
- YouTube Shorts: 10 videos

**Phase 4 Details:**
- Downloaded videos count
- Transcribed videos count
- Processing status

**Phase 5 Details:**
- Pros/Cons analysis
- Sentiment data

**Phase 6 Details:**
- PDF Download button
- Markdown Download button
- Report Preview button
- Report pages: 42
- Report sections: 10

**Phase 7 Details:**
- Scripts generated count
- Platforms list

### ✓ Progress Tracking
- [ ] Progress bar visible
- [ ] Progress bar fills as phases complete
- [ ] Percentage shows correctly (0% → 100%)
- [ ] Current phase indicator (e.g., 3/7)
- [ ] Live statistics panel visible when processing

### ✓ Report Features
- [ ] PDF Download button appears in Phase 6
- [ ] Markdown Download button appears in Phase 6
- [ ] Report Preview button appears in Phase 6
- [ ] PDF downloads successfully
- [ ] Markdown file downloads successfully
- [ ] Preview shows formatted report
- [ ] Preview button toggles hide/show

### ✓ Responsive Design
- [ ] Works on mobile (375px width)
- [ ] Works on tablet (768px width)
- [ ] Works on desktop (1024px+ width)
- [ ] Phases grid adapts to screen size
- [ ] Buttons are clickable on all devices

### ✓ Animations
- [ ] Phase transitions are smooth
- [ ] Active phase pulses/animates
- [ ] Progress bar animates
- [ ] Content fades in smoothly
- [ ] Hover effects work on buttons

### ✓ Error Handling
- [ ] Empty URL shows error message
- [ ] Invalid URL shows error message
- [ ] Reset button clears data
- [ ] Error messages are readable

### ✓ Data Display
- [ ] All dummy data displays correctly
- [ ] No console errors (F12)
- [ ] No console warnings
- [ ] Report content displays properly

---

## 🧪 Testing Scenarios

### Scenario 1: Basic Flow
```
1. Enter: https://amazon.com/dp/B123456
2. Click: Start
3. Expected: Phases progress, data displays
4. Result: ✅ Pass / ❌ Fail
```

### Scenario 2: View Phase Details
```
1. After phases load, click Phase 1
2. Expected: Product info displays
3. Click Phase 1 again
4. Expected: Details hide
5. Result: ✅ Pass / ❌ Fail
```

### Scenario 3: Download Report
```
1. Wait for all phases to complete
2. Click Phase 6
3. Click "Download as PDF"
4. Expected: PDF file downloads
5. Result: ✅ Pass / ❌ Fail
```

### Scenario 4: Mobile View
```
1. Open on mobile device (375px width)
2. Enter URL and click Start
3. Expected: Layout adapts, phases stack vertically
4. Click phases to view details
5. Result: ✅ Pass / ❌ Fail
```

### Scenario 5: Reset
```
1. After pipeline completes, click Reset
2. Expected: All data clears, ready for new input
3. Result: ✅ Pass / ❌ Fail
```

---

## 🔍 Browser DevTools Debugging

### Console Logging (F12)
Look for:
```
✅ "Loaded dummy data: {object}"
✅ No console errors
✅ No console warnings
```

### Network Tab (F12 → Network)
Look for:
```
❌ NO API calls (since we're using dummy data)
✅ CSS loads successfully
✅ JS loads successfully
```

### Elements Tab (F12 → Elements)
Look for:
```
✅ 7 phase boxes rendered
✅ Correct CSS classes applied
✅ Correct color coding
```

---

## 📊 Dummy Data Details

### Your JSON Structure
The dashboard uses your exact API response:

```javascript
{
  id: "80ddcee1-bc18-444a-96ca-a5c5e40bd984",
  product_url: "https://www.amazon.in/Nike-Court-Vision...",
  status: "completed",
  current_stage: null,
  stages: [
    { stage_name: "fetch_product", status: "completed", ... },
    { stage_name: "keywords", status: "completed", ... },
    { stage_name: "video_scrape", status: "completed", ... },
    { stage_name: "download", status: "completed", ... },
    { stage_name: "analysis", status: "completed", ... },
    { stage_name: "report", status: "completed", ... },
    { stage_name: "scripts", status: "completed", ... }
  ],
  report: "# Creative Agency Research Report\n...",
  scripts: "# Video Scripts\n...",
  keywords: {
    subreddits: [...],
    search_queries: [...]
  }
}
```

### Where Dummy Data Comes From
- **File**: `src/utils/sampleApiResponse.js`
- **Function**: `sampleCompletedResponse` object
- **Called by**: `getMockProductData()` in `apiService.js`

### Modifying Dummy Data
To change the dummy data:

1. Open: `src/utils/sampleApiResponse.js`
2. Find: `sampleCompletedResponse` object
3. Edit: Any field (report, keywords, stages, etc.)
4. Save: File
5. Refresh: Browser (F5)
6. Test: With new data

---

## 🎯 Test Checklist

```
UI RENDERING:
☐ Header displays correctly
☐ URL input visible and functional
☐ All 7 phase boxes render
☐ Phase icons display
☐ Phase names correct
☐ Status indicators visible

INTERACTIONS:
☐ URL input accepts text
☐ Start button works
☐ Completed phases clickable
☐ Pending phases disabled
☐ Reset button works
☐ Details close when clicking again

PHASE DETAILS:
☐ Phase 1 shows product data
☐ Phase 2 shows keywords
☐ Phase 3 shows videos
☐ Phase 4 shows downloads
☐ Phase 5 shows analysis
☐ Phase 6 shows reports
☐ Phase 7 shows scripts

REPORT FEATURES:
☐ PDF download button visible
☐ Markdown download button visible
☐ Preview button visible
☐ PDF downloads successfully
☐ Markdown downloads successfully
☐ Preview shows formatted content

PROGRESS TRACKING:
☐ Progress bar visible
☐ Progress bar fills correctly
☐ Percentage accurate
☐ Phase indicator shows correct count
☐ Statistics panel displays

RESPONSIVE:
☐ Mobile (375px) works
☐ Tablet (768px) works
☐ Desktop (1024px+) works
☐ All elements clickable
☐ Text readable at all sizes

ANIMATIONS:
☐ Phases animate smoothly
☐ Active phase pulses
☐ Progress bar animates
☐ Content fades in
☐ Transitions are smooth

ERRORS:
☐ No console errors
☐ No console warnings
☐ Error messages display correctly
☐ Empty URL shows error
☐ Invalid URL shows error
```

---

## 📝 Testing Notes

### First Time Testing
```
URL to enter: https://amazon.com/dp/B098PC5X7X
Expected: Dashboard loads dummy data, phases display

Check console (F12):
  ✅ "Loaded dummy data: {...}"
  ✅ No red errors
```

### Report Testing
```
After all phases complete:
1. Click Phase 6 box
2. Click "Download as PDF"
3. Expected: PDF file downloads to Downloads folder
4. Filename: product-report-2026-02-16.pdf (with today's date)

Try Markdown:
1. Click "Download as Markdown"
2. Expected: .md file downloads
3. Open in text editor to verify content
```

### Mobile Testing
```
1. Open DevTools (F12)
2. Click device toggle (mobile icon)
3. Select iPhone 12 (390x844)
4. Refresh page
5. Test UI at mobile width
6. Phases should stack vertically
7. All buttons should be clickable
```

---

## 🐛 Troubleshooting

### Issue: Phases not displaying
- [ ] Check console (F12) for errors
- [ ] Refresh page (Ctrl+R)
- [ ] Check if dummy data loaded: "Loaded dummy data" in console

### Issue: Dummy data not showing
- [ ] Verify `sampleApiResponse.js` exists
- [ ] Check `getMockProductData()` function
- [ ] Look for error in console

### Issue: PDF download not working
- [ ] Check popup blocker is disabled
- [ ] Try different browser
- [ ] Check Downloads folder
- [ ] Look for errors in console

### Issue: Responsive design not working
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Check DevTools zoom is 100%
- [ ] Verify Tailwind CSS loaded
- [ ] Check viewport meta tag

### Issue: Animations not smooth
- [ ] Check browser GPU acceleration enabled
- [ ] Close other tabs
- [ ] Try different browser
- [ ] Check DevTools Performance tab

---

## ✅ Success Criteria

**All Tests Pass When:**
1. ✅ All 7 phases render with correct styling
2. ✅ Completed phases are clickable
3. ✅ Pending phases are disabled
4. ✅ Phase details display correct data
5. ✅ Progress bar fills correctly
6. ✅ PDF downloads successfully
7. ✅ Markdown exports successfully
8. ✅ Works on mobile, tablet, desktop
9. ✅ No console errors
10. ✅ Animations are smooth

---

## Next Steps After Testing

Once you've verified the UI flow:

1. ✅ Test all phases and interactions
2. ✅ Verify report download works
3. ✅ Test responsive design
4. ✅ Check animations are smooth
5. ⏭️ When ready: Uncomment API integration
6. ⏭️ Connect real API endpoint
7. ⏭️ Test with real product data
8. ⏭️ Deploy to production

---

## Quick Reference

| Item | Status | Location |
|------|--------|----------|
| Dummy Data | ✅ Active | `src/utils/sampleApiResponse.js` |
| API Integration | 🔴 Commented | `src/utils/apiService.js` |
| UI Testing | ✅ Ready | Start with `npm run dev` |
| Documentation | ✅ Complete | Multiple .md files |

---

**Happy Testing! 🚀**

Any issues? Check the browser console (F12) for detailed error messages.
