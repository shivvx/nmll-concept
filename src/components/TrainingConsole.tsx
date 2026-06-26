import React, { useState, useEffect, useRef } from "react";
import {
  Activity,
  Play,
  RotateCcw,
  Gauge,
  Cpu,
  Sparkles,
  Award,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface TrainingConsoleProps {
  logMessage: (msg: string, type?: "info" | "success" | "error" | "system") => void;
}

interface EpochMetric {
  epoch: number;
  loss: number;
  valLoss: number;
  accuracy: number;
  valAccuracy: number;
}

export default function TrainingConsole({ logMessage }: TrainingConsoleProps) {
  const [activeEpoch, setActiveEpoch] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [metrics, setMetrics] = useState<EpochMetric[]>([]);
  const [trainingConfig, setTrainingConfig] = useState({
    epochs: 15,
    lr: 0.001,
    batchSize: 32,
    optimizer: "AdamW",
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerTrainingLoop = () => {
    if (isTraining) return;

    setIsTraining(true);
    setActiveEpoch(0);
    setMetrics([]);
    logMessage(`Spinning up CUDA clusters. Deploying ${trainingConfig.optimizer} solver...`, "system");

    timerRef.current = setInterval(() => {
      setActiveEpoch((prev) => {
        const next = prev + 1;
        
        // Compute decaying logs
        const loss = Math.max(0.04, 0.72 / Math.pow(next, 0.4) - next * 0.005 + Math.random() * 0.02);
        const valLoss = loss * 1.05 + Math.random() * 0.03;
        const accuracy = Math.min(0.99, 0.65 + (0.33 * (1 - 1 / Math.sqrt(next))) + Math.random() * 0.015);
        const valAccuracy = accuracy * 0.97 - Math.random() * 0.01;

        setMetrics((curr) => [
          ...curr,
          {
            epoch: next,
            loss: round(loss),
            valLoss: round(valLoss),
            accuracy: round(accuracy),
            valAccuracy: round(valAccuracy),
          },
        ]);

        logMessage(`Epoch ${next}/${trainingConfig.epochs} >> train_loss: ${loss.toFixed(4)} | val_accuracy: ${(valAccuracy * 100).toFixed(2)}%`, "info");

        if (next >= trainingConfig.epochs) {
          clearInterval(timerRef.current!);
          setIsTraining(false);
          logMessage(`Model fitting complete. Saved weights file to s3://wiroxa-registry/checkpoints/best_weight_v1.pth`, "success");
        }
        return next;
      });
    }, 800);
  };

  const resetMetrics = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsTraining(false);
    setActiveEpoch(0);
    setMetrics([]);
    logMessage("Training configurations reset.", "info");
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const round = (val: number) => Math.round(val * 1000) / 1000;

  return (
    <div id="training-console" className="flex-1 flex flex-col bg-[#111317] text-gray-200 overflow-y-auto class-scrollbar-dark p-6">
      {/* Title block */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#21262d]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-cyan-500/10 text-cyan-400">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100 font-sans tracking-tight">Active Training & CUDA Console</h1>
            <p className="text-xs text-gray-400 font-sans mt-0.5">Traces high-density model fits, metric improvements, validation curves, and GPU telemetry.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="start-training-btn"
            onClick={triggerTrainingLoop}
            disabled={isTraining}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 hover:scale-103 font-bold transition text-white px-4 py-2 rounded-lg text-sm cursor-pointer disabled:opacity-50"
          >
            <Play size={14} fill="currentColor" />
            <span>{isTraining ? `Epoch ${activeEpoch} Fitting...` : "Initiate Fitting"}</span>
          </button>
          <button
            id="reset-training-btn"
            onClick={resetMetrics}
            className="flex items-center gap-1.5 bg-[#21262d] border border-[#30363d] px-3 py-2 rounded-lg text-xs text-gray-300 transition cursor-pointer hover:bg-gray-800"
          >
            <RotateCcw size={13} />
            <span>Reset Console</span>
          </button>
        </div>
      </div>

      {/* Grid: Hyperparameters Configuration & Real-Time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Parameters card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#161a22] rounded-lg border border-[#30363d] p-4 text-xs">
            <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-gray-400 block mb-3">Hyperparameters</span>
            <div className="space-y-3.5">
              <div>
                <label className="text-gray-400 block mb-1">Optimizer Solver</label>
                <select
                  id="opt-selector"
                  value={trainingConfig.optimizer}
                  onChange={(e) => setTrainingConfig((p) => ({ ...p, optimizer: e.target.value }))}
                  disabled={isTraining}
                  className="w-full bg-[#21262d] border border-[#30363d] rounded p-1.5 text-xs text-gray-100 outline-none"
                >
                  <option value="AdamW">AdamW (Weight Decay)</option>
                  <option value="SGD">Stochastic Gradient Descent</option>
                  <option value="RMSprop">RMSprop Solver</option>
                  <option value="AdaBelief">AdaBelief Optimizer</option>
                </select>
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Total Epoch Epochs</label>
                <input
                  id="epochs-val"
                  type="number"
                  value={trainingConfig.epochs}
                  disabled={isTraining}
                  onChange={(e) => setTrainingConfig((p) => ({ ...p, epochs: Number(e.target.value) }))}
                  className="w-full bg-[#21262d] border border-[#30363d] rounded p-1.5 text-xs text-gray-100 outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Target Learning Rate (α)</label>
                <input
                  id="lr-val"
                  type="number"
                  step="0.0001"
                  value={trainingConfig.lr}
                  disabled={isTraining}
                  onChange={(e) => setTrainingConfig((p) => ({ ...p, lr: Number(e.target.value) }))}
                  className="w-full bg-[#21262d] border border-[#30363d] rounded p-1.5 text-xs text-gray-100 outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Batch Batch Bounds</label>
                <input
                  id="batch-val"
                  type="number"
                  value={trainingConfig.batchSize}
                  disabled={isTraining}
                  onChange={(e) => setTrainingConfig((p) => ({ ...p, batchSize: Number(e.target.value) }))}
                  className="w-full bg-[#21262d] border border-[#30363d] rounded p-1.5 text-xs text-gray-100 outline-none"
                />
              </div>
            </div>
          </div>

          {/* CUDA hardware summary metric widget */}
          <div className="bg-[#161a22] rounded-lg border border-[#30363d] p-4 text-xs space-y-3">
            <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-gray-400 block border-b border-[#30363d] pb-1.5">GPU cluster status</span>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">GPU Core Temperature</span>
              <span className={`font-mono font-bold ${isTraining ? "text-amber-400" : "text-gray-300"}`}>
                {isTraining ? "74.5°C" : "41.2°C"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total VRAM Allocation</span>
              <span className="font-mono text-gray-300">
                {isTraining ? "14.2 / 24.0 GB" : "0.5 / 24.0 GB"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Active CUDA Utilization</span>
              <span className={`font-mono font-bold ${isTraining ? "text-cyan-400 animate-pulse" : "text-gray-500"}`}>
                {isTraining ? "94.2%" : "0.0%"}
              </span>
            </div>
          </div>
        </div>

        {/* Training curves charts */}
        <div className="lg:col-span-3 space-y-6">
          {metrics.length === 0 ? (
            <div className="bg-[#161a22] rounded-lg border border-[#30363d] h-80 flex flex-col items-center justify-center text-center p-6">
              <Award size={44} className="text-gray-600 mb-3" />
              <h3 className="text-sm font-bold text-gray-300">Model training visual metrics placeholder</h3>
              <p className="text-xs text-gray-500 max-w-sm mt-1 leading-relaxed">
                No active metrics cached. Configure hyperparameters and trigger fitting cycle to render live learning gradients.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Training Loss curve */}
              <div className="bg-[#161a22] rounded-lg border border-[#30363d] p-4">
                <span className="text-xs uppercase tracking-wider font-mono font-bold text-gray-400 block mb-3">Model Convergence Loss Decay</span>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics}>
                      <XAxis dataKey="epoch" stroke="#888c96" fontSize={10} />
                      <YAxis stroke="#888c96" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: "#1c212b", borderColor: "#30363d", borderRadius: "6px" }} />
                      <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} name="Training Loss" activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="valLoss" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" name="Val Loss" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Training Accuracy curve */}
              <div className="bg-[#161a22] rounded-lg border border-[#30363d] p-4">
                <span className="text-xs uppercase tracking-wider font-mono font-bold text-gray-400 block mb-3">Accuracy performance Metrics</span>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics}>
                      <XAxis dataKey="epoch" stroke="#888c96" fontSize={10} />
                      <YAxis stroke="#888c96" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: "#1c212b", borderColor: "#30363d", borderRadius: "6px" }} />
                      <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} name="Train Acc" activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="valAccuracy" stroke="#06b6d4" strokeWidth={1.5} strokeDasharray="4 4" name="Val Acc" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Quick recommendations ticker */}
          {activeEpoch > 0 && (
            <div className="bg-gradient-to-r from-emerald-950/20 to-zinc-900 border border-emerald-500/20 rounded-lg p-3 text-xs flex gap-2 items-center text-emerald-400">
              <Zap size={15} />
              <span>
                <strong>Training Diagnosis</strong>: Metrics indicate model stability. No gradient explosions or plateaus identified on active learning rate ({trainingConfig.lr}).
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
