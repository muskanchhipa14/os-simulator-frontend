import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Settings2 } from 'lucide-react';

const ProcessInputList = ({ processes, onChange, onAdd, onRemove, algorithm }) => {
  const isPriority = algorithm === 'priority-np' || algorithm === 'priority-p';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 flex flex-col h-full"
    >
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <Settings2 className="text-cyan-400" size={24} />
        <h2 className="text-xl font-bold text-white tracking-wide">Process Configuration</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-6">
        <AnimatePresence>
          {processes.map((p, index) => (
            <motion.div 
              key={p.id} // use a unique id to animate properly
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 bg-slate-800/30 p-3 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
                P{p.id}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-auto flex-1 gap-3">
                <div>
                  <label className="text-[10px] uppercase text-slate-400 font-semibold pl-1 mb-1 block">Arrival</label>
                  <input
                    type="number"
                    value={p.arrival}
                    min="0"
                    onChange={(e) => onChange(index, 'arrival', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-slate-400 font-semibold pl-1 mb-1 block">Burst</label>
                  <input
                    type="number"
                    value={p.burst}
                    min="1"
                    onChange={(e) => onChange(index, 'burst', e.target.value)}
                    className="input-field"
                  />
                </div>
                {isPriority && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                  >
                    <label className="text-[10px] uppercase text-slate-400 font-semibold pl-1 mb-1 block flex items-center gap-1">
                      Priority <span className="text-[9px] text-slate-500">(1=Highest)</span>
                    </label>
                    <input
                      type="number"
                      value={p.priority !== undefined ? p.priority : 0}
                      onChange={(e) => onChange(index, 'priority', e.target.value)}
                      className="input-field"
                    />
                  </motion.div>
                )}
              </div>

              {processes.length > 1 && (
                <button 
                  onClick={() => onRemove(index)}
                  className="btn-icon self-end mb-1 hover:text-red-400 hover:border-red-400/50 hover:bg-red-400/10"
                  title="Remove Process"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button 
        onClick={onAdd}
        className="w-full py-3 flex items-center justify-center gap-2 border border-dashed border-slate-600 rounded-xl text-slate-300 hover:text-white hover:border-cyan-400 hover:bg-cyan-400/10 transition-all font-medium active:scale-[0.98]"
      >
        <Plus size={20} />
        Add Process
      </button>
    </motion.div>
  );
};

export default ProcessInputList;
