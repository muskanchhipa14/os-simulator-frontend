import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const MetricCard = ({ title, value, unit, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 flex flex-col relative overflow-hidden group hover:border-cyan-500/30 transition-all"
  >
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 rounded-full blur-2xl group-hover:from-cyan-500/20 group-hover:to-fuchsia-500/20 transition-all"></div>
    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 relative z-10">{title}</span>
    <div className="flex items-baseline gap-1 relative z-10">
      <span className="text-3xl font-bold text-white">{value}</span>
      {unit && <span className="text-sm text-slate-400 font-medium">{unit}</span>}
    </div>
  </motion.div>
);

const MetricsPanel = ({ result }) => {
  if (!result) return null;

  return (
    <div className="glass-panel p-6 mt-8">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <Activity className="text-fuchsia-400" size={24} />
        <h2 className="text-xl font-bold text-white tracking-wide">Simulation Metrics</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <MetricCard title="Avg Waiting" value={result.average_waiting_time} unit="ms" delay={0.1} />
        <MetricCard title="Avg Turnaround" value={result.average_turnaround_time} unit="ms" delay={0.2} />
        <MetricCard title="Avg Response" value={result.average_response_time} unit="ms" delay={0.3} />
        <MetricCard title="CPU Util" value={result.cpu_utilization} unit="%" delay={0.4} />
        <MetricCard title="Throughput" value={result.throughput} unit="p/ms" delay={0.5} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-900/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/80 text-slate-300 text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold">ID</th>
              <th className="p-4 font-semibold">Arrival</th>
              <th className="p-4 font-semibold">Burst</th>
              {result.per_process[0]?.priority !== undefined && <th className="p-4 font-semibold text-cyan-400">Priority</th>}
              <th className="p-4 font-semibold">Completion</th>
              <th className="p-4 font-semibold text-amber-400">Waiting</th>
              <th className="p-4 font-semibold text-blue-400">Turnaround</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {result.per_process.map((p, index) => (
              <motion.tr 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                key={p.id} 
                className="hover:bg-slate-800/40 transition-colors text-slate-200"
              >
                <td className="p-4 font-bold text-white flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
                  P{p.id}
                </td>
                <td className="p-4">{p.arrival}</td>
                <td className="p-4">{p.burst}</td>
                {p.priority !== undefined && <td className="p-4 font-medium text-cyan-300">{p.priority}</td>}
                <td className="p-4">{p.completion}</td>
                <td className="p-4 text-amber-200">{p.waiting}</td>
                <td className="p-4 text-blue-200">{p.turnaround}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetricsPanel;
