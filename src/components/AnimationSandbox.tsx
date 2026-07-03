import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Sparkles, Sliders, PlayCircle } from "lucide-react";

interface AnimationSandboxProps {
  onAddLog: (action: string, details: string) => void;
}

export default function AnimationSandbox({ onAddLog }: AnimationSandboxProps) {
  const [bubbleCount, setBubbleCount] = useState<number>(5);
  const [physicsType, setPhysicsType] = useState<"spring" | "tween">("spring");
  const [boxActive, setBoxActive] = useState<boolean>(false);

  const renderCount = useRef<number>(0);
  renderCount.current += 1;

  const toggleBox = () => {
    setBoxActive(!boxActive);
    onAddLog("Spring Animation", `Box size: ${!boxActive ? "expanded" : "collapsed"}`);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs" id="animation-sandbox-card">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
        <h2 className="font-sans text-base font-semibold text-gray-900 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-purple-500 animate-spin" />
          Framer Motion Physics
        </h2>
        <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700 font-mono">
          Renders: {renderCount.current}
        </span>
      </div>

      {/* Physics Toggle and Slider controls */}
      <div className="space-y-3 mb-5">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Interpolation Mode
          </label>
          <div className="flex rounded-lg bg-gray-100 p-0.5" id="physics-type-toggle">
            <button
              onClick={() => {
                setPhysicsType("spring");
                onAddLog("Physics Mode", "Switched to Spring simulation");
              }}
              className={`flex-1 rounded-md py-1 text-xs font-medium transition-all ${
                physicsType === "spring"
                  ? "bg-white text-gray-900 shadow-2xs font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Spring Physics
            </button>
            <button
              onClick={() => {
                setPhysicsType("tween");
                onAddLog("Physics Mode", "Switched to Tween (linear) simulation");
              }}
              className={`flex-1 rounded-md py-1 text-xs font-medium transition-all ${
                physicsType === "tween"
                  ? "bg-white text-gray-900 shadow-2xs font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Linear Tween
            </button>
          </div>
        </div>

        {/* Bubble Count Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Sliders className="h-3 w-3" /> Animated Spheres:
            </span>
            <span className="font-mono text-purple-600 font-bold">{bubbleCount}</span>
          </div>
          <input
            type="range"
            min="2"
            max="12"
            step="1"
            value={bubbleCount}
            onChange={(e) => {
              const val = Number(e.target.value);
              setBubbleCount(val);
              onAddLog("Sphere Scaler", `Adjusted active rendering items to ${val}`);
            }}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            id="bubble-count-slider"
          />
        </div>
      </div>

      {/* Animation Stage Canvas */}
      <div className="relative h-[180px] rounded-lg bg-slate-950 border border-slate-900 overflow-hidden flex items-center justify-center p-4">
        {/* Absolute floating items */}
        <div className="absolute inset-0 overflow-hidden opacity-40">
          {Array.from({ length: bubbleCount }).map((_, index) => (
            <motion.div
              key={index}
              className="absolute rounded-full bg-linear-to-tr from-purple-500 to-indigo-500"
              style={{
                width: 12 + (index % 3) * 8,
                height: 12 + (index % 3) * 8,
                left: `${15 + (index * 75) % 70}%`,
                top: `${20 + (index * 45) % 65}%`,
              }}
              animate={{
                y: [0, -15, 15, 0],
                x: [0, 10, -10, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 4 + (index % 4) * 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Dynamic Spring Box */}
        <motion.div
          layout
          onClick={toggleBox}
          className="relative z-10 flex flex-col items-center justify-center cursor-pointer shadow-xl select-none"
          animate={{
            width: boxActive ? 110 : 80,
            height: boxActive ? 110 : 80,
            borderRadius: boxActive ? "24px" : "12px",
            rotate: boxActive ? 135 : 0,
            backgroundColor: boxActive ? "#3b82f6" : "#8b5cf6",
          }}
          transition={
            physicsType === "spring"
              ? { type: "spring", stiffness: 200, damping: 15 }
              : { duration: 0.3, ease: "easeInOut" }
          }
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          id="spring-interactive-box"
        >
          <div
            style={{ transform: boxActive ? "rotate(-135deg)" : "none" }}
            className="text-center text-white flex flex-col items-center justify-center transition-all"
          >
            <PlayCircle className="h-5 w-5 mb-0.5 opacity-90" />
            <span className="text-[9px] font-bold tracking-wide uppercase">Click Me</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
