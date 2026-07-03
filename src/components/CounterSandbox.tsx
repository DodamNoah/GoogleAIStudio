import { useState, useEffect, useRef } from "react";
import { Plus, Minus, RotateCcw, Play, Pause, ListCollapse } from "lucide-react";
import { RenderLog } from "../types";

interface CounterSandboxProps {
  onAddLog: (action: string, details: string) => void;
}

export default function CounterSandbox({ onAddLog }: CounterSandboxProps) {
  const [count, setCount] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [tickerActive, setTickerActive] = useState<boolean>(false);
  const [tickSpeed, setTickSpeed] = useState<number>(1000); // ms
  const [tickCount, setTickCount] = useState<number>(0);

  const componentRenderCount = useRef<number>(0);
  componentRenderCount.current += 1;

  // Interval ticker effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (tickerActive) {
      onAddLog("Ticker Started", `Interval set to ${tickSpeed}ms`);
      intervalId = setInterval(() => {
        setCount((prev) => prev + multiplier);
        setTickCount((prev) => prev + 1);
      }, tickSpeed);
    } else {
      onAddLog("Ticker Stopped", "Manual pause or unmount");
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [tickerActive, tickSpeed, multiplier]);

  const handleIncrement = () => {
    setCount((prev) => prev + multiplier);
    onAddLog("Increment", `Added ${multiplier} to reach ${count + multiplier}`);
  };

  const handleDecrement = () => {
    setCount((prev) => prev - multiplier);
    onAddLog("Decrement", `Subtracted ${multiplier} to reach ${count - multiplier}`);
  };

  const handleReset = () => {
    setCount(0);
    setTickCount(0);
    setTickerActive(false);
    onAddLog("Reset", "Counters reverted to initial state");
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs" id="counter-sandbox-card">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
        <h2 className="font-sans text-base font-semibold text-gray-900">
          State & Rendering Counter
        </h2>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 font-mono">
          Renders: {componentRenderCount.current}
        </span>
      </div>

      {/* Primary Display */}
      <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 py-6 border border-gray-100 mb-4">
        <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Current Value</span>
        <span className="text-4xl font-extrabold font-mono text-gray-900 mt-1 transition-all">
          {count}
        </span>
        <div className="mt-2 flex items-center gap-1 text-[11px] text-gray-400">
          <span>Ticks Triggered:</span>
          <span className="font-mono font-bold text-gray-600">{tickCount}</span>
        </div>
      </div>

      {/* Multiplier & Manual Step Adjuster */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          Step Multiplier: <span className="font-mono font-bold text-blue-600">{multiplier}</span>
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[1, 5, 10, 50].map((val) => (
            <button
              key={val}
              onClick={() => {
                setMultiplier(val);
                onAddLog("Multiplier Change", `Set step to ${val}`);
              }}
              className={`rounded-md py-1.5 text-xs font-medium border transition-all ${
                multiplier === val
                  ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
              id={`multiplier-btn-${val}`}
            >
              ±{val}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleDecrement}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100 transition-colors"
          id="count-decrement-btn"
        >
          <Minus className="h-3.5 w-3.5" />
          Sub
        </button>
        <button
          onClick={handleIncrement}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:bg-blue-800 shadow-xs transition-colors"
          id="count-increment-btn"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      <hr className="border-gray-100 my-4" />

      {/* Auto Ticker Sandbox */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Auto Ticker</h3>
          <button
            onClick={() => setTickerActive(!tickerActive)}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
              tickerActive
                ? "bg-red-50 text-red-700 hover:bg-red-100"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
            id="ticker-toggle-btn"
          >
            {tickerActive ? (
              <>
                <Pause className="h-3 w-3" /> Pause
              </>
            ) : (
              <>
                <Play className="h-3 w-3" /> Resume
              </>
            )}
          </button>
        </div>

        {/* Speed Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Ticker Delay:</span>
            <span className="font-mono text-blue-600 font-bold">{tickSpeed}ms</span>
          </div>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={tickSpeed}
            onChange={(e) => setTickSpeed(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            id="ticker-speed-slider"
          />
          <div className="flex justify-between text-[10px] text-gray-400 font-mono">
            <span>Fast (100ms)</span>
            <span>Slow (2s)</span>
          </div>
        </div>
      </div>

      {/* Reset Operations */}
      <button
        onClick={handleReset}
        className="mt-4 w-full flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50/50 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 hover:text-red-800 transition-colors"
        id="counter-reset-btn"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset Counter & Ticker
      </button>
    </div>
  );
}
