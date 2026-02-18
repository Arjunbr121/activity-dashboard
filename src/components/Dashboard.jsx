import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PhaseDetail from './PhaseDetail';
import { getMockProductData, extractPhaseData } from '../utils/apiService';

const Dashboard = () => {
  const [productUrl, setProductUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [error, setError] = useState('');
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [apiData, setApiData] = useState(null);

  const phases = [
    {
      id: 1,
      name: 'URL Input',
      description: 'Validate',
      icon: '🔗',
    },
    {
      id: 2,
      name: 'Keywords',
      description: 'Generate',
      icon: '🔑',
    },
    {
      id: 3,
      name: 'Scraping',
      description: 'Collect',
      icon: '🔍',
    },
    {
      id: 4,
      name: 'Video',
      description: 'Analyze',
      icon: '🎬',
    },
    {
      id: 5,
      name: 'Insights',
      description: 'Extract',
      icon: '💡',
    },
    {
      id: 6,
      name: 'Competitors',
      description: 'Compare',
      icon: '⚔️',
    },
    {
      id: 7,
      name: 'Report',
      description: 'Generate',
      icon: '📊',
    },
  ];

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleStartProcess = (url) => {
    setError('');
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Invalid URL format');
      return;
    }

    setProductUrl(url);
    setIsProcessing(true);
    setCurrentPhase(0);
    setSelectedPhase(null);
    
    // ✅ USING DUMMY DATA FOR UI TESTING
    // Load dummy data (your API JSON response structure)
    // Real API integration commented out - will be added later
    try {
      const data = getMockProductData();
      console.log('Loaded dummy data:', data);
      setApiData(data);
      simulateProcessing();
    } catch (err) {
      setError('Failed to load dummy data: ' + err.message);
      setIsProcessing(false);
    }
  };

  const simulateProcessing = () => {
    let phase = 0;
    const interval = setInterval(() => {
      if (phase < phases.length) {
        setCurrentPhase(phase);
        phase++;
      } else {
        clearInterval(interval);
        setIsProcessing(false);
      }
    }, 2500);
  };

  const handleReset = () => {
    setProductUrl('');
    setIsProcessing(false);
    setCurrentPhase(0);
    setError('');
    setSelectedPhase(null);
    setApiData(null);
  };

  const getPhaseStatus = (idx) => {
    if (idx < currentPhase) return 'completed';
    if (idx === currentPhase && isProcessing) return 'active';
    return 'pending';
  };

  const completionPercentage = !productUrl
    ? 0
    : Math.round(((currentPhase + (isProcessing ? 0 : 1)) / phases.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 border-b border-slate-700/30"
         >
           <div className="max-w-full mx-auto">
             <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
               Product Intelligence Dashboard
             </h1>
             <p className="text-slate-400 text-xs sm:text-sm">Real-time analysis pipeline with horizontal workflow</p>
          </div>
        </motion.div>

         {/* Main Content - Horizontal Flow */}
         <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
           <div className="max-w-full w-full">
            {/* URL Input Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
               <div className="space-y-4">
                 <label className="text-sm font-bold text-slate-300">Enter Product URL</label>
                 <div className="flex flex-col sm:flex-row gap-3">
                   <input
                     id="url-input"
                     type="text"
                     value={productUrl}
                     onChange={(e) => {
                       setProductUrl(e.target.value);
                       setError('');
                     }}
                     disabled={isProcessing}
                     placeholder="https://amazon.com/dp/..."
                     onKeyPress={(e) => {
                       if (e.key === 'Enter' && !isProcessing) {
                         handleStartProcess(e.target.value);
                       }
                     }}
                     className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50"
                   />
                   <motion.button
                     onClick={() => {
                       const input = document.getElementById('url-input');
                       handleStartProcess(input.value);
                     }}
                     disabled={isProcessing}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl hover:shadow-cyan-500/30 disabled:shadow-md disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Start'}
                  </motion.button>
                  {productUrl && (
                    <motion.button
                      onClick={handleReset}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-all"
                    >
                      Reset
                    </motion.button>
                  )}
                </div>
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm"
                  >
                    ⚠️ {error}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Progress Bar - Horizontal */}
            {productUrl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Pipeline Progress</h2>
                  <motion.span
                    className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {completionPercentage}%
                  </motion.span>
                </div>
                <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  />
                </div>
              </motion.div>
            )}

            {/* Horizontal Pipeline Timeline */}
            {productUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-12"
              >
                <h2 className="text-xl font-bold text-white mb-8">Processing Phases</h2>
                <div className="relative">
                  {/* Phase boxes - Horizontal and Responsive */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 relative z-10">
                       {phases.map((phase, idx) => {
                         const status = getPhaseStatus(idx);
                         const isActive = status === 'active';
                         const isCompleted = status === 'completed';
                         const isPending = status === 'pending';
                         const isSelected = selectedPhase === idx;
                         const isClickable = isActive || isCompleted;

                         return (
                           <motion.div
                              key={phase.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="w-full"
                            >
                             <motion.div
                               animate={{
                                 scale: isActive ? [1, 1.08, 1] : isSelected ? 1.05 : 1,
                                 boxShadow: isActive
                                   ? '0 0 20px rgba(34, 211, 238, 0.5)'
                                   : isSelected
                                   ? '0 0 15px rgba(168, 85, 247, 0.4)'
                                   : 'none',
                               }}
                               transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                               onClick={() => isClickable && setSelectedPhase(isSelected ? null : idx)}
                               className={`rounded-xl p-4 text-center border-2 transition-all ${
                                 isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                               } ${
                                 isSelected
                                   ? 'bg-purple-500/30 border-purple-500 text-purple-300 shadow-lg shadow-purple-500/50'
                                   : isCompleted
                                   ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-500/25'
                                   : isActive
                                   ? 'bg-cyan-500/30 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/50'
                                   : 'bg-slate-800/50 border-slate-700 text-slate-400 opacity-50'
                               }`}
                           >
                            <div className="text-2xl mb-2">{phase.icon}</div>
                            <h3 className="font-bold text-sm">{phase.name}</h3>
                            <p className="text-xs opacity-70 mt-1">{phase.description}</p>
                            <div className="mt-3 text-xs font-bold">
                              {isCompleted ? '✓ Done' : isActive ? '◆ Active' : '○ Waiting'}
                            </div>
                          </motion.div>
                          </motion.div>
                        );
                      })}
                    </div>
                    
                    {/* Phase Details - Show below cards when active or selected */}
                    {(isProcessing || selectedPhase !== null) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 p-6 bg-gradient-to-br from-slate-800/40 via-slate-800/30 to-slate-900/40 border border-slate-700/50 rounded-xl backdrop-blur-sm"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-cyan-300">
                              📊 {selectedPhase !== null ? phases[selectedPhase].name : phases[currentPhase].name} Details
                            </h3>
                            <p className="text-sm text-slate-400 mt-1">
                              {selectedPhase !== null ? phases[selectedPhase].description : phases[currentPhase].description}
                            </p>
                          </div>
                          {selectedPhase !== null && (
                            <button
                              onClick={() => setSelectedPhase(null)}
                              className="text-slate-400 hover:text-slate-200 transition-colors text-2xl font-bold"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <PhaseDetail 
                           phase={selectedPhase !== null ? phases[selectedPhase] : phases[currentPhase]} 
                           productUrl={productUrl}
                           apiData={apiData}
                           phaseData={apiData ? extractPhaseData(apiData, selectedPhase !== null ? selectedPhase + 1 : currentPhase + 1) : null}
                         />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stats Grid - Horizontal */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-xl font-bold text-white mb-6">Live Statistics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                    <p className="text-blue-300 text-sm font-bold">Current Phase</p>
                    <p className="text-2xl font-black text-blue-200 mt-1">{currentPhase + 1}/7</p>
                  </div>
                  <div className="bg-cyan-500/20 border border-cyan-500/50 rounded-lg p-4">
                    <p className="text-cyan-300 text-sm font-bold">Progress</p>
                    <p className="text-2xl font-black text-cyan-200 mt-1">{completionPercentage}%</p>
                  </div>
                  <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4">
                    <p className="text-purple-300 text-sm font-bold">Elapsed</p>
                    <p className="text-2xl font-black text-purple-200 mt-1">{(currentPhase * 2.5).toFixed(1)}s</p>
                  </div>
                  <div className="bg-pink-500/20 border border-pink-500/50 rounded-lg p-4">
                    <p className="text-pink-300 text-sm font-bold">Remaining</p>
                    <p className="text-2xl font-black text-pink-200 mt-1">{((phases.length - currentPhase - 1) * 2.5).toFixed(1)}s</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
