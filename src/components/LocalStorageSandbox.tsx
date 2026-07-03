import { useState, useEffect, useRef, FormEvent } from "react";
import { Save, Trash2, Database, AlertCircle } from "lucide-react";
import { StorageItem } from "../types";

interface LocalStorageSandboxProps {
  onAddLog: (action: string, details: string) => void;
}

export default function LocalStorageSandbox({ onAddLog }: LocalStorageSandboxProps) {
  const [items, setItems] = useState<StorageItem[]>([]);
  const [newKey, setNewKey] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const storageRenderCount = useRef<number>(0);
  storageRenderCount.current += 1;

  // Load all items prefixed with 'rtb_' (React Test Bench)
  const loadStoredItems = () => {
    try {
      const list: StorageItem[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("rtb_")) {
          const value = localStorage.getItem(key) || "";
          list.push({
            key: key.replace("rtb_", ""),
            value,
            updatedAt: new Date().toLocaleTimeString(),
          });
        }
      }
      setItems(list);
    } catch (e) {
      setError("Failed to load items from localStorage.");
    }
  };

  useEffect(() => {
    loadStoredItems();
  }, []);

  const handleSaveItem = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const formattedKey = newKey.trim().toLowerCase();
    if (!formattedKey) {
      setError("Key cannot be empty.");
      return;
    }

    if (!newValue.trim()) {
      setError("Value cannot be empty.");
      return;
    }

    try {
      const fullKey = `rtb_${formattedKey}`;
      localStorage.setItem(fullKey, newValue);
      onAddLog("Storage Save", `Saved Key: ${formattedKey}`);
      setNewKey("");
      setNewValue("");
      loadStoredItems();
    } catch (e) {
      setError("Failed to save item. Storage may be blocked or full.");
    }
  };

  const handleDeleteItem = (rawKey: string) => {
    try {
      localStorage.removeItem(`rtb_${rawKey}`);
      onAddLog("Storage Delete", `Removed Key: ${rawKey}`);
      loadStoredItems();
    } catch (e) {
      setError("Failed to delete item.");
    }
  };

  const handleClearAll = () => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("rtb_")) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      onAddLog("Storage Clear", "Purged all React Test Bench keys");
      loadStoredItems();
    } catch (e) {
      setError("Failed to purge storage.");
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs" id="storage-sandbox-card">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
        <h2 className="font-sans text-base font-semibold text-gray-900 flex items-center gap-1.5">
          <Database className="h-4 w-4 text-emerald-500" />
          LocalStorage Sandbox
        </h2>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 font-mono">
          Renders: {storageRenderCount.current}
        </span>
      </div>

      {/* Save Input Form */}
      <form onSubmit={handleSaveItem} className="space-y-2 mb-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="key"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-xs font-mono text-gray-800 placeholder-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
              id="storage-key-input"
            />
          </div>
          <div className="flex-1.5">
            <input
              type="text"
              placeholder="value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-xs font-mono text-gray-800 placeholder-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
              id="storage-val-input"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-1 rounded-md bg-red-50 p-2 text-[11px] text-red-600">
            <AlertCircle className="h-3 w-3" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-xs transition-colors"
          id="storage-save-btn"
        >
          <Save className="h-3.5 w-3.5" />
          Store Pair
        </button>
      </form>

      {/* List of saved pairs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stored Sandbox Items ({items.length})</h3>
          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-[10px] text-red-600 hover:text-red-800 font-semibold"
              id="storage-clear-all"
            >
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-100 p-4 text-center text-xs text-gray-400">
            No items saved. Store some keys above to verify client-side storage persistence!
          </div>
        ) : (
          <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1" id="storage-items-list">
            {items.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-2 text-xs"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono font-bold text-gray-700 truncate">{item.key}</span>
                    <span className="text-[9px] text-gray-400 font-mono">{item.updatedAt}</span>
                  </div>
                  <p className="font-mono text-gray-500 truncate mt-0.5">{item.value}</p>
                </div>
                <button
                  onClick={() => handleDeleteItem(item.key)}
                  className="rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Delete key"
                  id={`storage-delete-${item.key}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
