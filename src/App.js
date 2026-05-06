import React, { useState } from "react";
import ProcessInputList from "./components/ProcessInputList";
import GanttChart from "./components/GanttChart";
import MetricsPanel from "./components/MetricsPanel";
import { Play, Cpu, AlertTriangle, Info } from "lucide-react";

const API_URL = "https://os-simulator-backend.onrender.com/"; 

function App() {
  const [processes, setProcesses] = useState([
    { id: 1, arrival: 0, burst: 5, priority: 2 },
    { id: 2, arrival: 1, burst: 3, priority: 1 },
    { id: 3, arrival: 2, burst: 8, priority: 3 }
  ]);

  const [algorithm, setAlgorithm] = useState("fcfs");
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleProcessChange = (index, field, value) => {
    const updated = [...processes];
    updated[index][field] = Number(value);
    setProcesses(updated);
  };

  const addProcess = () => {
    setProcesses([
      ...processes,
      { id: processes.length + 1, arrival: 0, burst: 1, priority: 0 }
    ]);
  };

  const removeProcess = (index) => {
    const updated = processes.filter((_, i) => i !== index);
    updated.forEach((p, i) => { p.id = i + 1; });
    setProcesses(updated);
  };

  // MOCK DATA FALLBACK IF BACKEND IS DOWN
  const generateMockData = () => {
    console.warn("Using mock data because backend is unreachable.");
    return {
      average_waiting_time: 3.33,
      average_turnaround_time: 8.67,
      average_response_time: 3.33,
      cpu_utilization: 100.0,
      throughput: 0.19,
      total_time: 16,
      per_process: processes.map(p => ({
        id: p.id, arrival: p.arrival, burst: p.burst, priority: p.priority,
        completion: p.arrival + p.burst + 3, waiting: 3, turnaround: p.burst + 3, response: 3
      })),
      gantt_chart: processes.map((p, i) => ({
        process_id: p.id, start: i * 5, end: (i + 1) * 5
      }))
    };
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    const endpoint = algorithm; 
    const bodyData = algorithm === "round-robin"
      ? { processes, time_quantum: Number(timeQuantum) }
      : { processes };

    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to connect to backend server. Using simulated offline results.");
      // Provide an impactful fallback so the UI isn't broken
      setTimeout(() => {
        setResult(generateMockData());
        setLoading(false);
      }, 800);
      return;
    } 
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
      
      {/* Header */}
      <header className="mb-12 text-center flex flex-col items-center">
        <div className="inline-flex items-center justify-center p-3 bg-cyan-500/10 rounded-2xl mb-4 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          <Cpu size={40} className="text-cyan-400" />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 drop-shadow-lg">
          OS Scheduler Pro
        </h1>
        <p className="text-slate-400 max-w-2xl text-lg">
          Advanced CPU Scheduling Visualization Engine. Configure your processes, select an algorithm, and analyze the metrics in real-time.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Algorithm Config */}
        <div className="lg:col-span-4 glass-panel p-6 flex flex-col gap-6 sticky top-8">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wide">
              Select Algorithm
            </label>
            <div className="relative">
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="input-field appearance-none cursor-pointer pr-10 bg-slate-900 border-slate-700 font-medium"
              >
                <option value="fcfs">First-Come, First-Served (FCFS)</option>
                <option value="sjf">Shortest Job First (SJF)</option>
                <option value="srtf">Shortest Remaining Time First (SRTF)</option>
                <option value="round-robin">Round Robin (RR)</option>
                <option value="priority-np">Priority (Non-Preemptive)</option>
                <option value="priority-p">Priority (Preemptive)</option>
                <option value="hrrn">Highest Response Ratio Next (HRRN)</option>
                <option value="ljf">Longest Job First (LJF)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-cyan-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {algorithm === "round-robin" && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
              <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wide">
                Time Quantum
              </label>
              <input
                type="number"
                value={timeQuantum}
                min="1"
                onChange={(e) => setTimeQuantum(e.target.value)}
                className="input-field bg-slate-900 border-slate-700 font-medium"
              />
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200 text-sm">
              <AlertTriangle className="shrink-0 text-amber-500" size={18} />
              <p>{error}</p>
            </div>
          )}
          
          <div className="flex items-start gap-3 p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-400 text-sm mt-auto">
            <Info className="shrink-0 text-cyan-500" size={18} />
            <p>Modify the processes on the right and run the simulation to see the generated Gantt Chart.</p>
          </div>

          <button 
            className="btn-primary mt-2" 
            onClick={handleSubmit} 
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <Play size={20} fill="currentColor" />
                Run Simulation
              </>
            )}
          </button>
        </div>

        {/* Right Column: Process Input */}
        <div className="lg:col-span-8">
          <ProcessInputList 
            processes={processes} 
            onChange={handleProcessChange} 
            onAdd={addProcess} 
            onRemove={removeProcess}
            algorithm={algorithm}
          />
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <MetricsPanel result={result} />
          <GanttChart blocks={result.gantt_chart} />
        </div>
      )}
    </div>
  );
}

export default App;