import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertCircle, ArrowRight } from 'lucide-react';

const URLInput = ({ onStartProcess, isProcessing, productUrl }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    onStartProcess(url);
  };

  return (
    <motion.div
      className="relative bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/40 shadow-2xl overflow-hidden group"
      whileHover={{ borderColor: 'rgba(148, 113, 255, 0.6)' }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated gradient overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-purple-600/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        animate={{ opacity: [0, 0.05, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      {/* Glow effect */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/15 transition-colors duration-500" />
      
      <div className="relative z-10 mb-8 space-y-1">
        <motion.h2 
          className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Start Analysis
        </motion.h2>
        <p className="text-slate-400 text-sm font-light">Enter your product URL to begin deep analysis</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        <div className="space-y-3">
          <motion.div
            animate={{
              boxShadow: focused 
                ? '0 0 40px rgba(168, 85, 247, 0.25)' 
                : '0 0 0px rgba(168, 85, 247, 0)'
            }}
            className="relative rounded-xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity rounded-xl" />
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl opacity-0 group-focus-within:opacity-20 blur transition-all duration-300" />
            
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="https://amazon.com/dp/B089HQRV6M"
              disabled={isProcessing}
              className="relative w-full px-6 py-4 bg-slate-700/30 border border-slate-600/50 rounded-xl text-white placeholder-slate-500/70 focus:outline-none focus:border-purple-400/80 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm backdrop-blur-sm font-medium"
            />
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-purple-400 group-focus-within:text-cyan-300 transition-colors" size={18} />
          </motion.div>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, x: -10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-red-400 text-xs font-medium bg-red-500/10 border border-red-500/30 rounded-lg p-3"
            >
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </div>

        {productUrl && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-gradient-to-r from-cyan-500/15 to-purple-500/15 border border-cyan-500/40 rounded-xl p-4 backdrop-blur-sm group hover:border-cyan-500/60 transition-colors"
          >
            <p className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 uppercase mb-2 tracking-wider">Current URL</p>
            <p className="text-xs text-slate-300 truncate font-mono group-hover:text-cyan-200 transition-colors">{productUrl}</p>
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={isProcessing}
          whileHover={{ scale: 1.02, translateY: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 px-6 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:from-cyan-700 hover:via-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:via-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-xl hover:shadow-2xl hover:shadow-purple-500/40 disabled:shadow-md flex items-center justify-center gap-3 text-sm relative overflow-hidden group/btn"
        >
          {/* Gradient animation background */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/0 opacity-0 group-hover/btn:opacity-30 transition-opacity" />
          
          {isProcessing ? (
            <>
              <motion.div 
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Start Analysis</span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight size={18} />
              </motion.div>
            </>
          )}
        </motion.button>
      </form>

      {/* Quick Examples */}
      <div className="mt-10 pt-8 border-t border-slate-700/30 relative z-10">
        <p className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-300 uppercase tracking-widest mb-5">
          Quick Examples
        </p>
        <div className="space-y-2.5">
          {[
            'amazon.com/dp/B089HQRV6M',
            'etsy.com/listing/123456789',
            'instagram.com/productpage',
          ].map((exampleUrl, idx) => (
            <motion.button
              key={idx}
              onClick={() => setUrl(`https://${exampleUrl}`)}
              disabled={isProcessing}
              whileHover={{ x: 6, scale: 1.02 }}
              className="w-full text-left text-xs text-slate-400 hover:text-cyan-300 truncate disabled:opacity-50 disabled:cursor-not-allowed transition-all p-3 rounded-lg hover:bg-slate-700/40 border border-transparent hover:border-slate-600/50 font-mono group"
            >
              <span className="text-slate-500 group-hover:text-cyan-400 transition-colors">→</span> https://{exampleUrl}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default URLInput;
