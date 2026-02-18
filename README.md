# Activity Status Dashboard

An interactive React dashboard for tracking product analysis activities with a beautiful UI/UX built with React, Tailwind CSS, and Framer Motion.

## Features

✨ **Interactive Journey Tracker** - Visualize 7 phases of product analysis
- URL Input
- Keyword Generation
- Data Scraping (Reddit, Instagram, YouTube)
- Video Analysis & Transcription
- Insights & Analysis (Pros/Cons)
- Competitive Search
- Report Generation

🎨 **Beautiful UI/UX**
- Dark theme with gradient backgrounds
- Smooth animations with Framer Motion
- Real-time progress tracking
- Live statistics panel
- Responsive design (mobile-friendly)

⚡ **Tech Stack**
- React 18 with Hooks
- Vite (blazing fast dev server)
- Tailwind CSS (utility-first CSS)
- Framer Motion (animations)
- Lucide React (icons)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd activity-dashboard
npm install
```

### Development Server

Start the dev server on **port 5173**:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## How to Use

1. **Enter Product URL** - Input any valid URL (e.g., https://amazon.com/product)
2. **Start Analysis** - Click "Start Analysis" button
3. **Watch Journey** - See the progress as it moves through 7 phases
4. **View Details** - Each active phase shows:
   - Generated keywords
   - Data sources found
   - Pros/Cons analysis
   - Competitive analysis
5. **Download Report** - Once complete, download the analysis report

## Project Structure

```
activity-dashboard/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx       # Main dashboard component
│   │   ├── URLInput.jsx        # URL input form
│   │   ├── JourneyTracker.jsx  # Phase timeline
│   │   ├── PhaseDetail.jsx     # Dummy data for phases
│   │   └── StatsPanel.jsx      # Live statistics
│   ├── App.jsx                 # App root
│   ├── index.css               # Global styles
│   └── main.jsx                # Entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Customization

### Adding Real API Integration

The dashboard currently uses dummy data. To integrate with real APIs:

1. Update `src/components/Dashboard.jsx` - Replace `simulateProcessing()` with actual API calls
2. Modify `src/components/PhaseDetail.jsx` - Add real data from your backend
3. Update phase descriptions based on actual data

### Theming

Customize colors in `tailwind.config.js`:
- Change primary colors in `theme.extend.colors`
- Modify animations in `theme.extend.animation`

## API Integration Guide (For Future)

The dashboard is ready for API integration. Key areas to update:

1. **URL Validation API** - Validate product URLs
2. **Keyword Generation API** - Generate keywords for products
3. **Scraping API** - Integrate Reddit, Instagram, YouTube scrapers
4. **Video Processing API** - Send videos to Gemini for transcription
5. **Analysis API** - Get pros/cons and insights
6. **Competitive Search API** - Find competitors
7. **Report Generation API** - Create PDF reports

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- ⚡ Vite: ~300ms startup time
- 📦 Bundle size: ~330KB (gzipped: ~105KB)
- 🎨 Smooth 60fps animations

## Notes

- Currently using dummy data (2.5s per phase)
- All phase transitions are pre-configured
- Ready for real API integration
- Mobile responsive design included

## Future Enhancements

- [ ] Real API integration
- [ ] PDF report download
- [ ] Dark/Light theme toggle
- [ ] Export analysis data to CSV/JSON
- [ ] Save/load analysis history
- [ ] Advanced filtering options
- [ ] Dashboard analytics

## License

MIT
# activity-dashboard
