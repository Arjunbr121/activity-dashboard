import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Zap,
  TrendingUp,
  Clock,
} from 'lucide-react';

const StatsPanel = ({ currentPhase, totalPhases, isProcessing }) => {
  const timePerPhase = 2.5; // seconds
  const elapsedTime = (currentPhase * timePerPhase).toFixed(1);
  const remainingTime = ((totalPhases - currentPhase - 1) * timePerPhase).toFixed(1);

  const stats = [
    {
      icon: BarChart3,
      label: 'Current Phase',
      value: `${currentPhase + 1}/${totalPhases}`,
      color: 'text-blue-300',
      bgColor: 'from-blue-500/20 to-blue-500/5',
      border: 'border-blue-500/30',
    },
    {
      icon: TrendingUp,
      label: 'Progress',
      value: `${Math.round(((currentPhase + 1) / totalPhases) * 100)}%`,
      color: 'text-emerald-300',
      bgColor: 'from-emerald-500/20 to-emerald-500/5',
      border: 'border-emerald-500/30',
    },
    {
      icon: Clock,
      label: 'Elapsed Time',
      value: `${elapsedTime}s`,
      color: 'text-purple-300',
      bgColor: 'from-purple-500/20 to-purple-500/5',
      border: 'border-purple-500/30',
    },
    {
      icon: Zap,
      label: 'Remaining',
      value: `${remainingTime}s`,
      color: 'text-orange-300',
      bgColor: 'from-orange-500/20 to-orange-500/5',
      border: 'border-orange-500/30',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-5"
    >
      <div>
        <h3 className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 uppercase tracking-[0.1em]">
          Live Stats
        </h3>
        <div className="h-0.5 w-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mt-2" />
      </div>

      <div className="space-y-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ scale: 1.02, translateX: 6 }}
              className={`group bg-gradient-to-br ${stat.bgColor} rounded-xl p-4 border ${stat.border} hover:border-opacity-100 hover:shadow-lg hover:shadow-${stat.color.split('-')[1]}-500/20 transition-all backdrop-blur-sm cursor-default overflow-hidden relative`}
            >
              {/* Animated gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity" />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor} border ${stat.border}`}>
                    <Icon className={`${stat.color}`} size={16} />
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{stat.label}</p>
                </div>
                <motion.p 
                  className={`text-xl font-bold ${stat.color}`}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.value}
                </motion.p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Activity Indicator */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 border border-purple-500/40 rounded-xl p-4 mt-6 backdrop-blur-sm overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="flex gap-1">
              <motion.div 
                className="w-2.5 h-2.5 bg-purple-400 rounded-full shadow-lg shadow-purple-500/50" 
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
              />
              <motion.div 
                className="w-2.5 h-2.5 bg-blue-400 rounded-full shadow-lg shadow-blue-500/50" 
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div 
                className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-500/50" 
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
              />
            </div>
            <p className="text-xs text-purple-200 font-semibold">
              Pipeline processing...
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StatsPanel;
