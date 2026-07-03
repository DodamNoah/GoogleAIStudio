import { useState, useEffect, useRef } from "react";
import { Cpu, Clock, Layers, Activity } from "lucide-react";

export default function Header() {
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString());
  const headerRenderCount = useRef<number>(0);
  headerRenderCount.current += 1;

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-xs" id="testbench-header">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="font-sans text-xl font-bold tracking-tight text-gray-900">
              React Interactive Test Bench
            </h1>
            <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
              Commit-ready
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            A sandbox for testing React 19 hooks, component lifecycle updates, state performance, and styling.
          </p>
        </div>

        {/* System Specs and Indicators */}
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-600">
            <Cpu className="h-3.5 w-3.5 text-blue-500" />
            <span>React 19.0.1</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-600">
            <Layers className="h-3.5 w-3.5 text-purple-500" />
            <span>Tailwind v4</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-600">
            <Clock className="h-3.5 w-3.5 text-emerald-500" />
            <span className="font-mono">{time}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-yellow-800">
            <Activity className="h-3.5 w-3.5 text-yellow-600" />
            <span>Header Renders: <strong className="font-mono">{headerRenderCount.current}</strong></span>
          </div>
        </div>
      </div>
    </header>
  );
}
