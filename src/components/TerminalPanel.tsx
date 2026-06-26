import React, { useState } from "react";
import {
  Terminal as TermIcon,
  FileText,
  Activity,
  Cpu,
  RefreshCw,
  Send,
} from "lucide-react";

interface TerminalPanelProps {
  logs: { text: string; type: "info" | "success" | "error" | "system"; time: string }[];
  clearLogs: () => void;
  logMessage: (msg: string, type?: "info" | "success" | "error" | "system") => void;
}

export default function TerminalPanel({
  logs,
  clearLogs,
  logMessage,
}: TerminalPanelProps) {
  const [activeTab, setActiveTab] = useState<"terminal" | "logs" | "cuda">("logs");
  const [consoleInput, setConsoleInput] = useState("");
  const [stdout, setStdout] = useState<string[]>([
    "Wiroxa Core Workspace Kernel: Online",
    "CUDA cluster standard units mapping initiated...",
    "Enter command e.g. 'python train.py', 'pip install sklearn', 'docker compose'"
  ]);

  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;

    const cmd = consoleInput.trim();
    setStdout((prev) => [...prev, `$ ${cmd}`]);
    logMessage(`Shell evaluation input: ${cmd}`, "system");

    setTimeout(() => {
      let output = `Command not found: '${cmd}'. Enter 'help' for support parameters.`;
      const c = cmd.toLowerCase();

      if (c === "help") {
        output = "Available shell triggers:\n  python train.py     - Starts neural training epoch graphs\n  pip install sklearn - Loads scikit-learn namespaces\n  docker compose      - Lists microservices stack indicators\n  nvidia-smi          - Check active GPU cores telemetry\n  clear               - Reset terminal console stdout logs";
      } else if (c.includes("train") || c.includes("python")) {
        output = "Enabling training console monitors...\nEpoch 1/5 - loss: 0.6124 - accuracy: 0.7241\nEpoch 2/5 - loss: 0.4355 - accuracy: 0.8105\nEpoch 5/5 - loss: 0.1582 - accuracy: 0.9654\nModel fit completed successfully. Checkpoints saved.";
      } else if (c.includes("nvidia") && c.includes("smi")) {
        output = "+-----------------------------------------------------------------------------+\n| NVIDIA-SMI 525.60.13    Driver Version: 525.60.13    CUDA Version: 12.0     |\n|-------------------------------+----------------------+----------------------|\n| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |\n| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |\n|===============================+======================+======================|\n|   0  NVIDIA A100-SXM4...  On  | 00000000:00:04.0 Off |                    0 |\n|             34C    P0    52W / 400W |    512MiB / 40960MiB |      0%      Default |\n+-----------------------------------------------------------------------------+";
      } else if (c.includes("pip") && c.includes("install")) {
        output = "Default channel mirror checked: https://pypi.org\nCollecting scikit-learn>=1.2.0\nDownloading scikit_learn-1.2.2-cp310-manylinux_x86_64.whl (12.1 MB)\nInstalling compiled classes... Successful.";
      } else if (c.includes("docker") && c.includes("compose")) {
        output = "Wiroxa Compose stack context:\n  [api-gateway]       localhost:8000 / running (Postgres REST)\n  [celery-worker]     distributed / connected (Redis Broker)\n  [redis]             localhost:6379 / online\n  [db]                localhost:5432 / query ready";
      } else if (c === "clear") {
        setStdout([]);
        setConsoleInput("");
        return;
      }

      setStdout((prev) => [...prev, output]);
    }, 400);

    setConsoleInput("");
  };

  return (
    <div id="bottom-terminal-editor" className="h-44 bg-[#08080a] border-t border-[#1a1a1e] flex flex-col font-mono text-xs text-neutral-400 select-none shrink-0">
      {/* Tab Horizontal Bar */}
      <div className="flex items-center justify-between px-3 h-8 border-b border-[#1a1a1e] bg-[#050507]">
        <div className="flex gap-1.5 h-full">
          <button
            id="term-logs-tab"
            onClick={() => setActiveTab("logs")}
            className={`flex items-center gap-1.5 px-3 border-r border-[#1a1a1e] h-full transition-colors cursor-pointer ${
              activeTab === "logs" ? "bg-[#0c0c0e] text-amber-500 font-bold" : "hover:text-neutral-250"
            }`}
          >
            <FileText size={12} />
            <span>Operational Logs ({logs.length})</span>
          </button>
          <button
            id="term-shell-tab"
            onClick={() => setActiveTab("terminal")}
            className={`flex items-center gap-1.5 px-3 border-r border-[#1a1a1e] h-full transition-colors cursor-pointer ${
              activeTab === "terminal" ? "bg-[#0c0c0e] text-amber-500 font-bold" : "hover:text-neutral-250"
            }`}
          >
            <TermIcon size={12} />
            <span>Console Shell Emulator</span>
          </button>
          <button
            id="term-cuda-tab"
            onClick={() => setActiveTab("cuda")}
            className={`flex items-center gap-1.5 px-3 h-full transition-colors cursor-pointer ${
              activeTab === "cuda" ? "bg-[#0c0c0e] text-amber-500 font-bold" : "hover:text-neutral-250"
            }`}
          >
            <Activity size={12} />
            <span>Hardware Telemetry</span>
          </button>
        </div>

        {activeTab === "logs" && (
          <button
            id="clear-logs"
            onClick={clearLogs}
            className="text-[10px] text-neutral-500 hover:text-rose-400 transition cursor-pointer font-bold"
          >
            CLEAR LOG HISTORIES
          </button>
        )}
      </div>

      {/* Dynamic Tab Body */}
      <div className="flex-1 overflow-y-auto p-3 select-text bg-[#0c0c0e]">
        {activeTab === "logs" && (
          <div className="space-y-1 text-[11px]">
            {logs.slice().reverse().map((lg, idx) => {
              const marker =
                lg.type === "success"
                  ? "text-emerald-400 font-bold"
                  : lg.type === "error"
                  ? "text-rose-400 font-bold"
                  : lg.type === "system"
                  ? "text-amber-500 font-bold"
                  : "text-neutral-400";

              return (
                <div key={idx} className="flex gap-2 leading-relaxed">
                  <span className="text-neutral-600 shrink-0 font-medium select-none">[{lg.time}]</span>
                  <span className={marker}>{lg.text}</span>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "terminal" && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-1 text-[11px] font-mono leading-relaxed pb-2">
              {stdout.map((line, idx) => (
                <div key={idx} className="whitespace-pre-wrap select-text">
                  {line}
                </div>
              ))}
            </div>
            <form onSubmit={handleConsoleSubmit} className="flex items-center shrink-0 pt-1 border-t border-[#1a1a1e] bg-[#08080a] z-10">
              <span className="text-amber-500 mr-2 shrink-0 select-none">nmll-workspace-sh $</span>
              <input
                id="shell-input"
                type="text"
                value={consoleInput}
                onChange={(e) => setConsoleInput(e.target.value)}
                placeholder="Type e.g. 'nvidia-smi', 'help'"
                className="flex-1 bg-transparent outline-none text-xs text-white placeholder-neutral-700 p-1 font-mono"
              />
              <button type="submit" className="hidden" />
            </form>
          </div>
        )}

        {activeTab === "cuda" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2 text-[11px] font-mono">
            <div className="bg-[#121214] border border-neutral-800/80 p-3 rounded">
              <span className="text-neutral-500 uppercase block font-bold text-[9px] mb-1">Compute Core CPU</span>
              <div className="text-xs font-bold text-neutral-300">Intel Xeon v4: 8 Cores Active</div>
              <div className="w-full bg-neutral-900 h-1 mt-2.5 overflow-hidden rounded">
                <div className="bg-emerald-500 h-full rounded" style={{ width: "32%" }} />
              </div>
            </div>

            <div className="bg-[#121214] border border-neutral-800/80 p-3 rounded">
              <span className="text-neutral-500 uppercase block font-bold text-[9px] mb-1">Accelerators GPU</span>
              <div className="text-xs font-bold text-neutral-350">NVIDIA A100 TensorCore</div>
              <div className="w-full bg-neutral-900 h-1 mt-2.5 overflow-hidden rounded">
                <div className="bg-amber-500 h-full rounded glow-beacon-amber" style={{ width: "74%" }} />
              </div>
            </div>

            <div className="bg-[#121214] border border-neutral-800/80 p-3 rounded">
              <span className="text-neutral-500 uppercase block font-bold text-[9px] mb-1">System Memory RAM</span>
              <div className="text-xs font-bold text-neutral-350">32.1 GB / 64.0 GB Allocation</div>
              <div className="w-full bg-neutral-900 h-1 mt-2.5 overflow-hidden rounded">
                <div className="bg-amber-650 h-full rounded" style={{ width: "50%" }} />
              </div>
            </div>

            <div className="bg-[#121214] border border-neutral-800/80 p-3 rounded">
              <span className="text-neutral-500 uppercase block font-bold text-[9px] mb-1">Dynamic Kernels Sandbox</span>
              <div className="text-xs font-bold text-neutral-350">Docker Pods: Standard Host Mode</div>
              <div className="text-[10px] text-emerald-400 mt-2 font-bold flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                <span>Docker-Daemon Responsive (OK)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
