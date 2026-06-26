import React, { useState } from "react";
import {
  Play,
  Trash2,
  Plus,
  RefreshCw,
  Terminal,
  FileCode,
  CheckCircle,
  AlertTriangle,
  PlayCircle,
  Sliders,
} from "lucide-react";

interface NotebookCell {
  id: string;
  type: "code" | "markdown";
  source: string;
  output?: string;
  running?: boolean;
}

interface NotebookPanelProps {
  logMessage: (msg: string, type?: "info" | "success" | "error" | "system") => void;
}

export default function NotebookPanel({ logMessage }: NotebookPanelProps) {
  const [cells, setCells] = useState<NotebookCell[]>([
    {
      id: "cell_1",
      type: "markdown",
      source: "### Neura Machine Learning (NMLL) Interactive Notebook Workspace\nRun cells sequentially to check parameters and initiate model features.",
    },
    {
      id: "cell_2",
      type: "code",
      source: "import pandas as pd\nimport numpy as np\n\ndf = pd.read_csv('dataset.csv')\nprint(df)",
    },
    {
      id: "cell_3",
      type: "code",
      source: "from sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\n\n# Split features and train RandomForest model\nX_train, X_test, y_train, y_test = train_test_split('dataset')\nmodel = RandomForestClassifier(n_estimators=100)\nmodel.fit(X_train, y_train)\nprint(model)",
    },
  ]);

  const [kernelStateState, setKernelStateState] = useState<Record<string, any>>({});
  const [kernelLoading, setKernelLoading] = useState(false);

  const runCell = async (cellId: string) => {
    const targetCell = cells.find((c) => c.id === cellId);
    if (!targetCell || targetCell.type === "markdown") return;

    // Trigger loader state
    setCells((prev) => prev.map((c) => (c.id === cellId ? { ...c, running: true } : c)));
    logMessage(`Triggering Python sandboxed cell execution: ${cellId}`, "info");

    try {
      const response = await fetch("/api/execute-python", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: targetCell.source,
          state: kernelStateState,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setCells((prev) =>
          prev.map((c) => (c.id === cellId ? { ...c, output: result.stdout, running: false } : c))
        );
        setKernelStateState(result.state);
        if (result.error) {
          logMessage(`Cell execution generated exception bounds: ${result.error}`, "error");
        } else {
          logMessage(`Cell ${cellId} completed evaluation successfully.`, "success");
        }
      }
    } catch {
      setCells((prev) =>
        prev.map((c) => (c.id === cellId ? { ...c, output: "System kernel execution breakdown.", running: false } : c))
      );
      logMessage(`Runtime environment fault evaluating cell ${cellId}`, "error");
    }
  };

  const addCell = (type: "code" | "markdown") => {
    const id = `cell_${Date.now().toString().slice(-4)}`;
    const newCell: NotebookCell = {
      id,
      type,
      source: type === "code" ? "# Enter clean python code in workspace cell\nprint('Wiroxa cell online')" : "### New markdown header section",
    };
    setCells((prev) => [...prev, newCell]);
    logMessage(`Added interactive ${type} block: ${id}`, "info");
  };

  const deleteCell = (id: string) => {
    setCells((prev) => prev.filter((c) => c.id !== id));
    logMessage(`Removed cell block: ${id}`, "info");
  };

  const updateCellSource = (id: string, text: string) => {
    setCells((prev) => prev.map((c) => (c.id === id ? { ...c, source: text } : c)));
  };

  const restartKernel = () => {
    setKernelLoading(true);
    setKernelStateState({});
    setCells((prev) => prev.map((c) => ({ ...c, output: undefined })));
    logMessage("Resetting sandboxed Python 3.10 Kernel variables and namespaces...", "system");
    setTimeout(() => {
      setKernelLoading(false);
      logMessage("Jupyter Kernel environment initialized. Workspace idle.", "success");
    }, 1200);
  };

  return (
    <div id="notebook-panel" className="flex-1 flex flex-col bg-[#0c0c0e] text-neutral-300 overflow-hidden h-full">
      {/* Notebook Toolbar */}
      <div className="flex items-center justify-between px-4 h-11 bg-[#050507] border-b border-neutral-850 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal size={15} className="text-amber-500" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-250">Interactive Jupyter Space</span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/30 text-[10px] text-emerald-400 border border-emerald-555/20 font-mono font-bold">
            KERNEL STATE: ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <button
            id="add-code-cell-btn"
            onClick={() => addCell("code")}
            className="flex items-center gap-1 hover:text-white bg-[#121214] border border-neutral-800 px-2.5 py-1 rounded text-xs transition cursor-pointer font-bold"
          >
            <Plus size={13} className="text-amber-500" />
            <span>Code Block</span>
          </button>
          <button
            id="add-md-cell-btn"
            onClick={() => addCell("markdown")}
            className="flex items-center gap-1 hover:text-white bg-[#121214] border border-neutral-800 px-2.5 py-1 rounded text-xs transition cursor-pointer font-bold"
          >
            <Plus size={13} className="text-emerald-500" />
            <span>Markdown Block</span>
          </button>
          <button
            id="restart-kernel-btn"
            onClick={restartKernel}
            disabled={kernelLoading}
            className="flex items-center gap-1 text-yellow-500 bg-yellow-950/15 border border-yellow-555/20 hover:bg-yellow-950/35 px-3 py-1 rounded text-xs transition cursor-pointer font-bold disabled:opacity-50"
          >
            <RefreshCw size={13} className={kernelLoading ? "animate-spin" : ""} />
            <span>{kernelLoading ? "Rebooting..." : "Restart Kernel"}</span>
          </button>
        </div>
      </div>

      {/* Grid container: Cells and Workspace variable stack inspector */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left main cell scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cells.map((cell, index) => (
            <div key={cell.id} className="relative group/cell border-l-2 border-neutral-800 hover:border-amber-500/40 pl-4 transition-all">
              {/* Cell index labels */}
              <div className="absolute -left-12 top-2 text-[10px] font-mono text-neutral-500">
                {cell.type === "code" ? `[${index + 1}]:` : "Markdown"}
              </div>

              {/* Action buttons (Trash and run) */}
              <div className="absolute right-0 -top-3 hidden group-hover/cell:flex items-center gap-1.5 bg-[#121214] p-1 rounded border border-neutral-800 z-20 shadow-lg">
                {cell.type === "code" && (
                  <button
                    id={`run-cell-${cell.id}`}
                    onClick={() => runCell(cell.id)}
                    disabled={cell.running}
                    className="p-1 hover:bg-neutral-800 hover:text-amber-500 rounded transition text-neutral-400 cursor-pointer"
                    title="Execute cell block"
                  >
                    <Play size={14} fill="currentColor" className={cell.running ? "animate-pulse" : ""} />
                  </button>
                )}
                <button
                  id={`delete-cell-${cell.id}`}
                  onClick={() => deleteCell(cell.id)}
                  className="p-1 hover:bg-neutral-800 hover:text-rose-450 rounded transition text-neutral-400 cursor-pointer"
                  title="Remove cell"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Cell source editor view */}
              <div className="space-y-2 mt-1 font-mono">
                {cell.type === "markdown" ? (
                  <textarea
                    id={`cell-editor-${cell.id}`}
                    className="w-full bg-[#09090b] border border-neutral-850 hover:border-neutral-700 focus:border-amber-500 p-3 rounded text-xs leading-relaxed text-emerald-400 resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/20"
                    rows={2}
                    value={cell.source}
                    onChange={(e) => updateCellSource(cell.id, e.target.value)}
                  />
                ) : (
                  <div className="rounded border border-neutral-800 bg-[#121214] overflow-hidden">
                    <div className="flex h-7 bg-[#09090b] border-b border-neutral-850 items-center px-3 justify-between text-[10px] font-mono text-neutral-500">
                      <div className="flex items-center gap-1.5">
                        <FileCode size={11} className="text-amber-550" />
                        <span>python_block.py</span>
                      </div>
                      <span>Python compiler engine</span>
                    </div>
                    <textarea
                      id={`cell-editor-${cell.id}`}
                      className="w-full bg-[#08080a] text-amber-100 font-mono text-xs p-3 min-h-[80px] focus:outline-none resize-y"
                      value={cell.source}
                      onChange={(e) => updateCellSource(cell.id, e.target.value)}
                    />
                  </div>
                )}

                {/* Outputs Panel */}
                {cell.output !== undefined && (
                  <div className="rounded bg-[#08080a] border border-neutral-850 p-3 text-xs font-mono text-neutral-300 whitespace-pre-wrap leading-relaxed">
                    <div className="text-[10px] text-neutral-500 border-b border-neutral-850 pb-1 mb-1 font-mono uppercase tracking-widest font-bold">
                      Stdout terminal outputs
                    </div>
                    {cell.output}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Active Variables panel */}
        <div className="w-64 border-l border-neutral-850 bg-[#121214]/80 p-4 overflow-y-auto shrink-0">
          <div className="flex items-center gap-1.5 mb-4 border-b border-neutral-850 pb-2">
            <Sliders size={14} className="text-amber-500" />
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400">
              Active Kernel Variables
            </span>
          </div>

          {Object.keys(kernelStateState).length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 italic font-sans leading-normal">
              Runtime namespaces empty. Evaluate code cells above to generate active state instances.
            </div>
          ) : (
            <div className="space-y-3 font-mono text-[11px]">
              {Object.entries(kernelStateState).map(([key, value]) => (
                <div key={key} className="p-2.5 rounded bg-[#09090b] border border-neutral-800 flex flex-col gap-1">
                  <span className="text-amber-400 font-bold">{key}</span>
                  <span className="text-emerald-400 text-[10px] truncate" title={String(value)}>
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
