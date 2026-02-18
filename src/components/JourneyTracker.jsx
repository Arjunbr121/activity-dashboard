import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, Zap, Download } from 'lucide-react';
import PhaseDetail from './PhaseDetail';

const JourneyTracker = ({
  phases,
  currentPhase,
  productUrl,
  isProcessing,
  onReset,
}) => {
  const phaseStatuses = useMemo(() => {
    return phases.map((phase, idx) => {
      if (idx < currentPhase) {
        return { ...phase, status: 'completed' };
      } else if (idx === currentPhase && isProcessing) {
        return { ...phase, status: 'active' };
      }
      return { ...phase, status: 'pending' };
    });
  }, [phases, currentPhase, isProcessing]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="text-emerald-400" size={20} />;
      case 'active':
        return <Zap className="text-blue-400 animate-pulse" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const completionPercentage = !productUrl
    ? 0
    : Math.round(((currentPhase + (isProcessing ? 0 : 1)) / phases.length) * 100);

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      {productUrl && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/40 shadow-xl overflow-hidden group hover:border-slate-700/60 transition-colors"
        >
          {/* Background glow */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/15 transition-colors duration-500" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">Journey Progress</h3>
              <p className="text-sm text-slate-400 mt-1">Real-time pipeline execution</p>
            </div>
            <motion.span 
              className="text-5xl font-black bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              {completionPercentage}%
            </motion.span>
          </div>

          <div className="relative w-full h-2 bg-slate-700/40 rounded-full overflow-hidden border border-slate-600/40 backdrop-blur-sm group/progress">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/30"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
            {/* Animated shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: [-100, 400] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute inset-y-0 right-0 w-3 bg-gradient-to-r from-purple-400 to-pink-400 shadow-lg shadow-pink-500/60 rounded-r-full"
              initial={{ width: '3px', opacity: 0 }}
              animate={{ opacity: completionPercentage > 0 ? 1 : 0 }}
              style={{ right: `calc(${100 - completionPercentage}%)` }}
            />
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 relative z-10">
            <motion.div 
              className="text-center p-5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/40 hover:border-emerald-500/70 transition-all hover:bg-gradient-to-br hover:from-emerald-500/25 hover:to-emerald-500/10 group cursor-default"
              whileHover={{ scale: 1.08, translateY: -4 }}
            >
              <motion.p 
                className="text-3xl font-black text-emerald-300 group-hover:text-emerald-200 transition-colors"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              >
                {phaseStatuses.filter((p) => p.status === 'completed').length}
              </motion.p>
              <p className="text-xs text-emerald-300/70 mt-2 font-semibold uppercase tracking-wider">Completed</p>
            </motion.div>
            <motion.div 
              className="text-center p-5 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/40 hover:border-blue-500/70 transition-all hover:bg-gradient-to-br hover:from-blue-500/25 hover:to-blue-500/10 group cursor-default"
              whileHover={{ scale: 1.08, translateY: -4 }}
            >
              <motion.p 
                className="text-3xl font-black text-blue-300 group-hover:text-blue-200 transition-colors"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              >
                {phaseStatuses.filter((p) => p.status === 'active').length}
              </motion.p>
              <p className="text-xs text-blue-300/70 mt-2 font-semibold uppercase tracking-wider">In Progress</p>
            </motion.div>
            <motion.div 
              className="text-center p-5 rounded-xl bg-gradient-to-br from-slate-600/20 to-slate-600/5 border border-slate-600/40 hover:border-slate-600/70 transition-all hover:bg-gradient-to-br hover:from-slate-600/25 hover:to-slate-600/10 group cursor-default"
              whileHover={{ scale: 1.08, translateY: -4 }}
            >
              <motion.p 
                className="text-3xl font-black text-slate-300 group-hover:text-slate-200 transition-colors"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
              >
                {phaseStatuses.filter((p) => p.status === 'pending').length}
              </motion.p>
              <p className="text-xs text-slate-400/70 mt-2 font-semibold uppercase tracking-wider">Pending</p>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Journey Timeline */}
      <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/40 shadow-xl overflow-hidden group hover:border-slate-700/60 transition-colors">
        {/* Background glow */}
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/15 transition-colors duration-500" />
        
        <div className="relative z-10 mb-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">Processing Pipeline</h3>
          <p className="text-sm text-slate-400 mt-2">7-phase real-time analysis workflow</p>
        </div>

        <div className="space-y-3">
          {phaseStatuses.map((phase, idx) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="group"
            >
              <div className="flex gap-4 items-start">
                {/* Timeline Circle */}
                <div className="flex flex-col items-center pt-1">
                  <motion.div
                    animate={{
                      scale: phase.status === 'active' ? [1, 1.3, 1] : 1,
                    }}
                    transition={{
                      duration: 2,
                      repeat: phase.status === 'active' ? Infinity : 0,
                    }}
                    className={`relative w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                      phase.status === 'completed'
                        ? 'bg-emerald-500/20 border-emerald-400'
                        : phase.status === 'active'
                        ? 'bg-purple-500/30 border-purple-400 shadow-lg shadow-purple-500/50'
                        : 'bg-slate-600/20 border-slate-600'
                    }`}
                  >
                    {getStatusIcon(phase.status)}
                  </motion.div>

                  {/* Connector Line */}
                  {idx !== phaseStatuses.length - 1 && (
                    <motion.div
                      className={`w-0.5 h-12 mt-2 ${
                        phase.status === 'completed'
                          ? 'bg-gradient-to-b from-emerald-500/80 to-slate-600/20'
                          : phase.status === 'active'
                          ? 'bg-gradient-to-b from-purple-500 to-slate-600/20'
                          : 'bg-slate-600/20'
                      }`}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: idx * 0.08 + 0.2 }}
                    />
                  )}
                </div>

                {/* Phase Card */}
                <motion.div
                  className={`flex-1 rounded-xl p-5 transition-all border backdrop-blur-sm group/card ${
                    phase.status === 'completed'
                      ? 'bg-emerald-500/15 border-emerald-500/40 hover:bg-emerald-500/20 hover:border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                      : phase.status === 'active'
                      ? 'bg-purple-500/20 border-purple-500/50 hover:bg-purple-500/25 shadow-xl shadow-purple-500/25'
                      : 'bg-slate-700/20 border-slate-600/40 hover:bg-slate-700/30 hover:border-slate-600/60'
                  }`}
                  whileHover={{ translateX: 10, scale: 1.02 }}
                >
                  <div className="flex items-start justify-between gap-4">
                     <div className="flex-1">
                       <div className="flex items-center gap-3 mb-2">
                         <motion.span 
                           className="text-2xl"
                           animate={{ scale: phase.status === 'active' ? [1, 1.2, 1] : 1 }}
                           transition={{ duration: 1.5, repeat: Infinity }}
                         >
                           {phase.icon}
                         </motion.span>
                         <div>
                           <h4 className="font-bold text-white text-sm group-hover/card:text-cyan-200 transition-colors">
                             {phase.name}
                           </h4>
                           <p className="text-xs text-slate-400 group-hover/card:text-slate-300 transition-colors">
                             {phase.description}
                           </p>
                         </div>
                       </div>
                     </div>
                     <motion.span
                       initial={{ scale: 0 }}
                       animate={{ scale: 1 }}
                       className={`text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap backdrop-blur-sm transition-all ${
                         phase.status === 'completed'
                           ? 'bg-emerald-500/40 text-emerald-200 border border-emerald-500/50'
                           : phase.status === 'active'
                           ? 'bg-purple-500/40 text-purple-200 border border-purple-500/60 animate-pulse shadow-lg shadow-purple-500/30'
                           : 'bg-slate-700/40 text-slate-300 border border-slate-600/40'
                       }`}
                     >
                       {phase.status === 'completed'
                         ? '✓ Complete'
                         : phase.status === 'active'
                         ? '◆ Active'
                         : '○ Pending'}
                     </motion.span>
                   </div>

                  {/* Sample Data for Active Phase */}
                  {phase.status === 'active' && (
                    <PhaseDetail phase={phase} productUrl={productUrl} />
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        {productUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 pt-8 border-t border-slate-700/30 flex gap-4 relative z-10"
          >
            <motion.button
              onClick={onReset}
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-4 px-6 bg-slate-700/30 hover:bg-slate-700/50 text-white rounded-xl transition-all font-semibold border border-slate-600/40 hover:border-slate-600/70 shadow-lg hover:shadow-xl hover:shadow-slate-700/30 group"
            >
              <motion.span 
                className="group-hover:text-slate-100 transition-colors"
                animate={{ x: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⟲ Reset
              </motion.span>
            </motion.button>
            {!isProcessing && currentPhase === phases.length - 1 && (
              <motion.button 
                whileHover={{ scale: 1.05, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl hover:shadow-emerald-500/40 flex items-center justify-center gap-3 relative overflow-hidden group/download"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/0 opacity-0 group-hover/download:opacity-30 transition-opacity" />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Download size={20} />
                </motion.div>
                Download Report
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JourneyTracker;
