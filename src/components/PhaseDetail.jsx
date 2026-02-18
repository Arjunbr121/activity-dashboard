import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { generatePDFFromMarkdown, downloadMarkdown } from '../utils/pdfGenerator';

const PhaseDetail = ({ phase, productUrl, apiData, phaseData }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [showReportPreview, setShowReportPreview] = useState(false);

  // Use provided phaseData or fall back to dummy data
  const detail = phaseData || {
    1: {
      title: 'URL Input',
      data: ['URL validated successfully', 'Domain: example.com', 'Status: Ready for analysis'],
    },
    2: {
      title: 'Keywords Generated',
      keywords: [
        'product review',
        'unboxing',
        'features',
        'pricing',
        'comparison',
        'setup guide',
      ],
      subreddits: ['sneakers', 'streetwear', 'malefashionadvice'],
    },
    3: {
      title: 'Sources Found',
      sources: [
        { name: 'Reddit', count: 45, icon: '🔴' },
        { name: 'Instagram', count: 234, icon: '📷' },
        { name: 'YouTube', count: 78, icon: '🎥' },
        { name: 'TikTok', count: 156, icon: '🎬' },
      ],
    },
    4: {
      title: 'Videos Downloaded',
      data: ['Total Videos: 89', 'Transcribed: 87', 'In Progress: 2'],
    },
    5: {
      title: 'Analysis Summary',
      pros: ['High quality', 'Good value', 'Reliable', 'Great support'],
      cons: ['Expensive', 'Limited colors', 'Shipping delay'],
    },
    6: {
      title: 'Report Ready',
      data: ['Report generated successfully', 'Pages: 42', 'Size: 3.5 MB'],
    },
    7: {
      title: 'Scripts Created',
      data: ['Video scripts generated', 'TikTok scripts: 5', 'Instagram scripts: 3'],
    },
  }[phase.id];

  const handleDownloadPDF = async () => {
    if (!apiData?.report) {
      setDownloadError('No report content available');
      return;
    }

    setDownloading(true);
    setDownloadError('');

    try {
      const filename = `product-report-${new Date().toISOString().split('T')[0]}`;
      generatePDFFromMarkdown(apiData.report, filename);
    } catch (error) {
      setDownloadError('Failed to generate PDF: ' + error.message);
      console.error('PDF generation error:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!apiData?.report) {
      setDownloadError('No report content available');
      return;
    }

    try {
      const filename = `product-report-${new Date().toISOString().split('T')[0]}.md`;
      downloadMarkdown(apiData.report, filename);
    } catch (error) {
      setDownloadError('Failed to download markdown: ' + error.message);
      console.error('Markdown download error:', error);
    }
  };

  if (!detail) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 pt-4 border-t border-yellow-500/30"
    >
      {detail.keywords && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-blue-300 uppercase">
            Generated Keywords
          </p>
          <div className="flex flex-wrap gap-2">
            {detail.keywords.map((keyword, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="text-xs bg-blue-500/20 text-blue-200 px-2.5 py-1 rounded-full border border-blue-500/30"
              >
                {keyword}
              </motion.span>
            ))}
          </div>
        </div>
      )}

       {detail.sources && (
         <div className="space-y-2">
           <p className="text-xs font-semibold text-purple-300 uppercase">
             Data Sources
           </p>
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {detail.sources.map((source, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-xs bg-purple-500/10 rounded-lg p-2.5 border border-purple-500/20"
              >
                <div className="text-lg mb-1">{source.icon}</div>
                <div className="font-semibold text-purple-200">
                  {source.name}
                </div>
                <div className="text-purple-300/80 text-xs">{source.count} posts</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

       {detail.pros && (
         <div className="space-y-2">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold text-emerald-300 uppercase mb-2">
                ✓ Pros
              </p>
              <div className="space-y-1">
                {detail.pros.map((pro, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-xs text-emerald-200 bg-emerald-500/10 rounded px-2.5 py-1.5 border border-emerald-500/20"
                  >
                    {pro}
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-300 uppercase mb-2">
                ✗ Cons
              </p>
              <div className="space-y-1">
                {detail.cons.map((con, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-xs text-red-200 bg-red-500/10 rounded px-2.5 py-1.5 border border-red-500/20"
                  >
                    {con}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {detail.subreddits && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-indigo-300 uppercase">
            Relevant Subreddits
          </p>
          <div className="flex flex-wrap gap-2">
            {detail.subreddits.map((subreddit, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="text-xs bg-indigo-500/20 text-indigo-200 px-2.5 py-1 rounded-full border border-indigo-500/30"
              >
                r/{subreddit}
              </motion.span>
            ))}
          </div>
        </div>
      )}

       {detail.data && (
         <div className="space-y-1">
           {detail.data.map((item, idx) => (
             <motion.div
               key={idx}
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="text-xs text-gray-300 bg-white/5 rounded px-2.5 py-1.5 border border-white/10"
             >
               • {item}
             </motion.div>
           ))}
         </div>
       )}

       {/* Report Download Section - Phase 6 */}
       {phase.id === 6 && apiData?.report && (
         <div className="space-y-3 mt-4 pt-4 border-t border-yellow-500/30">
           <p className="text-xs font-semibold text-yellow-300 uppercase">
             Report Management
           </p>
           <div className="flex flex-col gap-2">
             <div className="flex flex-col sm:flex-row gap-2">
               <motion.button
                 onClick={handleDownloadPDF}
                 disabled={downloading}
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-600 text-white text-sm font-bold rounded-lg transition-all disabled:cursor-not-allowed"
               >
                 {downloading ? '⏳ Generating PDF...' : '📄 Download as PDF'}
               </motion.button>
               <motion.button
                 onClick={handleDownloadMarkdown}
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm font-bold rounded-lg transition-all"
               >
                 📝 Download as Markdown
               </motion.button>
               <motion.button
                 onClick={() => setShowReportPreview(!showReportPreview)}
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-bold rounded-lg transition-all"
               >
                 👁️ {showReportPreview ? 'Hide' : 'Preview'} Report
               </motion.button>
             </div>
             {showReportPreview && (
               <motion.div
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 exit={{ opacity: 0, height: 0 }}
                 className="mt-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 max-h-96 overflow-y-auto text-xs text-slate-300 leading-relaxed prose prose-invert prose-sm"
               >
                 {apiData.report.split('\n').map((line, idx) => {
                   if (line.startsWith('# ')) {
                     return (
                       <h1 key={idx} className="text-lg font-bold text-white mt-4 mb-2">
                         {line.replace(/^# /, '')}
                       </h1>
                     );
                   }
                   if (line.startsWith('## ')) {
                     return (
                       <h2 key={idx} className="text-base font-bold text-cyan-300 mt-3 mb-1">
                         {line.replace(/^## /, '')}
                       </h2>
                     );
                   }
                   if (line.startsWith('### ')) {
                     return (
                       <h3 key={idx} className="text-sm font-semibold text-purple-300 mt-2 mb-1">
                         {line.replace(/^### /, '')}
                       </h3>
                     );
                   }
                   if (line.startsWith('- ')) {
                     return (
                       <div key={idx} className="ml-4 my-1">
                         • {line.replace(/^- /, '')}
                       </div>
                     );
                   }
                   return line && <div key={idx}>{line}</div>;
                 })}
               </motion.div>
             )}
           </div>
           {downloadError && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-red-400 text-xs bg-red-500/10 p-2 rounded border border-red-500/30"
             >
               {downloadError}
             </motion.div>
           )}
         </div>
       )}
    </motion.div>
  );
};

export default PhaseDetail;
