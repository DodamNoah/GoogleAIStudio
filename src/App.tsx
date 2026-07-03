import { useState, useRef } from "react";
import Header from "./components/Header";
import CounterSandbox from "./components/CounterSandbox";
import TextTransformer from "./components/TextTransformer";
import LocalStorageSandbox from "./components/LocalStorageSandbox";
import AnimationSandbox from "./components/AnimationSandbox";
import { RenderLog } from "./types";
import { Terminal, Trash2 } from "lucide-react";

export default function App() {
  const [logs, setLogs] = useState<RenderLog[]>([
    {
      id: "init",
      timestamp: new Date().toLocaleTimeString(),
      action: "App Boot",
      details: "React Interactive Test Bench initialized successfully.",
    },
  ]);

  const appRenderCount = useRef<number>(0);
  appRenderCount.current += 1;

  const addLog = (action: string, details: string) => {
    const newLog: RenderLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      action,
      details,
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 50)); // Limit to last 50 logs
  };

  const clearLogs = () => {
    setLogs([
      {
        id: "cleared",
        timestamp: new Date().toLocaleTimeString(),
        action: "Console Purged",
        details: "Render event log console cleared manually.",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-800 selection:bg-blue-500 selection:text-white font-sans" id="app-root">
      {/* Top Header */}
      <Header />

      {/* Main Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* Render Count Banner */}
        <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 p-4" id="app-status-banner">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 animate-ping" />
            <span className="text-xs font-semibold text-blue-800">
              Live Evaluation State is Active
            </span>
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-100/80 rounded-md px-2.5 py-1 font-mono">
            Master App Renders: <strong>{appRenderCount.current}</strong>
          </span>
        </div>

        {/* 2-Column Responsive Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Column Controls */}
          <div className="space-y-6">
            <CounterSandbox onAddLog={addLog} />
            <LocalStorageSandbox onAddLog={addLog} />
          </div>

          {/* Right Column Controls */}
          <div className="space-y-6">
            <TextTransformer onAddLog={addLog} />
            <AnimationSandbox onAddLog={addLog} />
          </div>

        </div>

        {/* Real-time Event Console */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs" id="sandbox-event-console">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="h-4.5 w-4.5 text-blue-600" />
              <h2 className="font-sans text-base font-semibold text-gray-900">
                Interactive Render & Event Logger
              </h2>
            </div>
            <button
              onClick={clearLogs}
              className="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-red-600 transition-colors"
              id="clear-logs-btn"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear Console
            </button>
          </div>

          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            Every button press, typing event, ticker event, local storage action, or visual animation choice registers a log here. This proves that standard event listeners and state synchronization hooks fire in the precise sequential orders.
          </p>

          {/* Log Stream Terminal */}
          <div className="rounded-lg bg-gray-900 p-4 font-mono text-[11px] text-gray-300 border border-gray-800 shadow-inner max-h-[220px] overflow-y-auto space-y-2" id="log-terminal-output">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-2 hover:bg-gray-800/50 py-0.5 rounded transition-colors px-1">
                <span className="text-gray-500 shrink-0 select-none">[{log.timestamp}]</span>
                <span className="text-cyan-400 font-bold shrink-0">{log.action}:</span>
                <span className="text-gray-300 break-all">{log.details}</span>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Humble Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-400" id="testbench-footer">
        <p>© 2026 React Interactive Test Bench • All React 19 lifecycles running cleanly</p>
      </footer>
    </div>
  );
}
