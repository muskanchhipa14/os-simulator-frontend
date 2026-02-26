import React, { useState } from "react";
// App.js (near the top, below imports)
const API_URL = "https://os-simulator-backend.onrender.com"; // <-- replace with your deployed FastAPI URL

function App() {
  const [processes, setProcesses] = useState([
    { id: 1, arrival: 0, burst: 0 }
  ]);

  const [algorithm, setAlgorithm] = useState("fcfs");
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [result, setResult] = useState(null);

  const handleChange = (index, field, value) => {
    const updated = [...processes];
    updated[index][field] = Number(value);
    setProcesses(updated);
  };

  const addProcess = () => {
    setProcesses([
      ...processes,
      { id: processes.length + 1, arrival: 0, burst: 0 }
    ]);
  };

 const handleSubmit = async () => {
  // keep endpoint simple
  const endpoint =
    algorithm === "fcfs"
      ? "fcfs"
      : algorithm === "sjf"
      ? "sjf"
      : algorithm === "srtf"
      ? "srtf"
      : "round-robin";  // no query param here

  // only for Round Robin, include time_quantum in body
  const bodyData =
    algorithm === "round-robin"
      ? { processes, time_quantum: Number(timeQuantum) }
      : { processes };

  const response = await fetch(`${API_URL}/${endpoint}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(bodyData)
});

  const data = await response.json();
  setResult(data);
};

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>OS Scheduling Simulator</h1>

      {/* PROCESS INPUT */}
      <div style={styles.card}>
        <h2>Processes</h2>

        {processes.map((p, index) => (
          <div key={index} style={styles.processRow}>
            <span>P{index + 1}</span>
            <input
              type="number"
              placeholder="Arrival"
              style={styles.input}
              onChange={(e) =>
                handleChange(index, "arrival", e.target.value)
              }
            />
            <input
              type="number"
              placeholder="Burst"
              style={styles.input}
              onChange={(e) =>
                handleChange(index, "burst", e.target.value)
              }
            />
          </div>
        ))}

        <button style={styles.addBtn} onClick={addProcess}>
          + Add Process
        </button>
      </div>

      {/* ALGORITHM SECTION */}
      <div style={styles.card}>
        <h2>Algorithm</h2>

       <select
  style={styles.select}
  value={algorithm}
  onChange={(e) => setAlgorithm(e.target.value)}
>
  <option value="fcfs">FCFS</option>
  <option value="sjf">SJF</option>
  <option value="srtf">SRTF (Preemptive SJF)</option>
  <option value="round-robin">Round Robin</option>
</select>

        {algorithm === "round-robin" && (
          <input
            type="number"
            value={timeQuantum}
            onChange={(e) => setTimeQuantum(e.target.value)}
            style={styles.input}
            placeholder="Time Quantum"
          />
        )}

        <button style={styles.runBtn} onClick={handleSubmit}>
          Run Simulation
        </button>
      </div>

      {/* RESULTS SECTION */}
      {result && (
        <div style={styles.card}>
          <h2>Results</h2>

          {/* Metrics */}
          <div style={styles.resultRow}>
            <Metric title="Avg Waiting Time" value={result.average_waiting_time} />
            <Metric title="Avg Turnaround Time" value={result.average_turnaround_time} />
            <Metric title="Avg Response Time" value={result.average_response_time} />
            <Metric title="CPU Utilization (%)" value={result.cpu_utilization} />
            <Metric title="Throughput" value={result.throughput} />
          </div>

          {/* Gantt Chart */}
          <h3>Gantt Chart</h3>
          <div style={styles.ganttContainer}>
            {result.gantt_chart.map((block, index) => (
              <div
                key={index}
                style={{
                  ...styles.ganttBlock,
                  width: (block.end - block.start) * 40 + "px"
                }}
              >
                <div>P{block.process_id}</div>
                <div style={{ fontSize: "12px" }}>
                  {block.start} - {block.end}
                </div>
              </div>
            ))}
          </div>

          {/* Process Table */}
          <h3>Process Details</h3>
  <table style={styles.table}>
  <thead>
    <tr>
  <th style={styles.th}>ID</th>
  <th style={styles.th}>Arrival</th>
  <th style={styles.th}>Burst</th>
  <th style={styles.th}>Completion</th>
  <th style={styles.th}>Waiting</th>
  <th style={styles.th}>Turnaround</th>
  <th style={styles.th}>Response</th>
</tr>
</thead>

<tbody>
  {result.per_process.map((p, index) => (
    <tr key={index}>
      <td style={styles.td}>P{p.id}</td>
      <td style={styles.td}>{p.arrival}</td>
      <td style={styles.td}>{p.burst}</td>
      <td style={styles.td}>{p.completion}</td>
      <td style={styles.td}>{p.waiting}</td>
      <td style={styles.td}>{p.turnaround}</td>
      <td style={styles.td}>{p.response}</td>
    </tr>
  ))}
</tbody>
  </table>
        </div>
      )}
    </div>
  );
}

/* Metric Card Component */
function Metric({ title, value }) {
  return (
    <div style={styles.metric}>
      {title}
      <div style={styles.metricValue}>{value}</div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "40px",
    backgroundColor: "#f4f6f9",
    minHeight: "100vh"
  },
  title: {
    textAlign: "center",
    marginBottom: "30px"
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  processRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px"
  },
  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  select: {
    padding: "8px",
    borderRadius: "5px",
    marginBottom: "10px"
  },
  addBtn: {
    padding: "8px 12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  runBtn: {
    padding: "10px 15px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px"
  },
  resultRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "20px"
  },
  metric: {
    backgroundColor: "#eef2ff",
    padding: "15px",
    borderRadius: "8px",
    minWidth: "150px"
  },
  metricValue: {
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "5px"
  },
  ganttContainer: {
    display: "flex",
    marginTop: "10px",
    alignItems: "center"
  },
  ganttBlock: {
    backgroundColor: "#87CEEB",
    border: "1px solid #333",
    padding: "15px",
    textAlign: "center"
  },
  
  table: {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "15px"
},
th: {
  border: "1px solid #ccc",
  padding: "10px",
  backgroundColor: "#f0f2f5",
  fontWeight: "bold",
  textAlign: "center"
},
td: {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "center"
}
};

export default App;