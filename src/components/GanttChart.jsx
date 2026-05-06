import React from 'react';
import { motion } from 'framer-motion';
import { AlignLeft } from 'lucide-react';

const GanttChart = ({ blocks }) => {
  if (!blocks || blocks.length === 0) return null;

  const totalTime = blocks[blocks.length - 1].end - blocks[0].start;

  // Generate distinct, vibrant neon colors for processes
  const getProcessColor = (pid) => {
    const colors = [
      'from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.5)]',
      'from-fuchsia-500 to-purple-600 shadow-[0_0_15px_rgba(217,70,239,0.5)]',
      'from-emerald-400 to-teal-500 shadow-[0_0_15px_rgba(52,211,153,0.5)]',
      'from-amber-400 to-orange-500 shadow-[0_0_15px_rgba(251,191,36,0.5)]',
      'from-rose-400 to-red-500 shadow-[0_0_15px_rgba(251,113,133,0.5)]',
      'from-indigo-400 to-blue-500 shadow-[0_0_15px_rgba(129,140,248,0.5)]'
    ];
    return colors[pid % colors.length];
  };

  return (
    <div className="glass-panel p-6 mt-8 mb-12">
      <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
        <AlignLeft className="text-cyan-400" size={24} />
        <h2 className="text-xl font-bold text-white tracking-wide">Execution Timeline</h2>
      </div>
      
      <div className="relative pt-6 pb-12 overflow-x-auto">
        <div className="flex items-center min-w-[600px] bg-slate-900/50 rounded-xl p-2 border border-slate-700/50">
          {blocks.map((block, index) => {
            const widthPercent = Math.max(5, ((block.end - block.start) / totalTime) * 100);
            
            return (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: `${widthPercent}%` }}
                transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 50 }}
                key={index} 
                className={`relative flex flex-col justify-center items-center h-16 bg-gradient-to-br ${getProcessColor(block.process_id)} text-white font-bold border-r border-white/20 group`}
                style={{
                  minWidth: '40px',
                  borderTopLeftRadius: index === 0 ? '8px' : '0',
                  borderBottomLeftRadius: index === 0 ? '8px' : '0',
                  borderTopRightRadius: index === blocks.length - 1 ? '8px' : '0',
                  borderBottomRightRadius: index === blocks.length - 1 ? '8px' : '0',
                }}
              >
                <span className="text-lg drop-shadow-md z-10">P{block.process_id}</span>
                
                {/* Hover Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-xs text-white px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity border border-slate-600 shadow-xl pointer-events-none whitespace-nowrap z-20">
                  Duration: {block.end - block.start}ms
                </div>
                
                {/* Start Time Label */}
                <div className="absolute -bottom-8 left-0 -translate-x-1/2 text-sm font-medium text-slate-400">
                  {block.start}
                </div>
                
                {/* Final End Time Label */}
                {index === blocks.length - 1 && (
                  <div className="absolute -bottom-8 right-0 translate-x-1/2 text-sm font-medium text-slate-400">
                    {block.end}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
