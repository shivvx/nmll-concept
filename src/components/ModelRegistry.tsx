import React, { useState } from "react";
import {
  Brain,
  Cpu,
  Bookmark,
  CheckCircle,
  Play,
  Settings,
  HelpCircle,
  Activity,
} from "lucide-react";
import { ModelItem } from "../types";

interface ModelRegistryProps {
  logMessage: (msg: string, type?: "info" | "success" | "error" | "system") => void;
}

export default function ModelRegistry({ logMessage }: ModelRegistryProps) {
  const [models, setModels] = useState<ModelItem[]>([
    {
      id: "mod_res_01",
      name: "Ensemble_RandomForest_HeartRate",
      version: "2.1.0-prod",
      accuracy: 0.9654,
      loss: 0.1582,
      framework: "Scikit-Learn",
      status: "active",
      parameters: { n_estimators: 100, max_depth: 12 },
    },
    {
      id: "mod_xgb_02",
      name: "XGBoost_Gradient_Booster",
      version: "1.4.2-candidate",
      accuracy: 0.9412,
      loss: 0.2104,
      framework: "XGBoost",
      status: "candidate",
      parameters: { learning_rate: 0.05, max_depth: 8 },
    },
    {
      id: "mod_pytorch_03",
      name: "Deep_DenseNet_Cardio_Classifier",
      version: "1.0.0-archived",
      accuracy: 0.8241,
      loss: 0.6124,
      framework: "PyTorch v2.1",
      status: "archived",
      parameters: { epochs: 100, dropout: 0.25 },
    },
  ]);

  const [activeTestModel, setActiveTestModel] = useState<string>("mod_res_01");
  const [testInputs, setTestInputs] = useState({
    age: 52,
    systolic_bp: 135,
    cholesterol: 255,
  });

  const [predictionProbability, setPredictionProbability] = useState<number | null>(null);
  const [evaluatingResult, setEvaluatingResult] = useState(false);

  const triggerMockPrediction = () => {
    setEvaluatingResult(true);
    logMessage(`Evaluating inputs vector age: ${testInputs.age}, BP: ${testInputs.systolic_bp}, cholesterol: ${testInputs.cholesterol} across ${activeTestModel}`, "info");

    setTimeout(() => {
      // Dynamic simulated predictor algorithm based on values to make it highly reactive
      const cholesterolVal = Number(testInputs.cholesterol);
      const systolicVal = Number(testInputs.systolic_bp);
      const ageVal = Number(testInputs.age);
      
      // Calculate probability scalar bounds
      let base = 0.15;
      if (cholesterolVal > 240) base += 0.35;
      if (systolicVal > 140) base += 0.25;
      if (ageVal > 55) base += 0.15;
      
      const prob = Math.min(0.99, Math.max(0.01, base + Math.random() * 0.05));
      setPredictionProbability(prob);
      setEvaluatingResult(false);
      logMessage(`Model evaluation completed successfully. Risk Probability computed at ${(prob * 100).toFixed(2)}%`, "success");
    }, 600);
  };

  return (
    <div id="model-registry" className="flex-1 flex flex-col bg-[#0c0c0e] text-neutral-200 overflow-y-auto p-6 font-sans">
      {/* Title */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-850">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-amber-500/10 text-amber-500 font-bold">
            <Brain size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-100 font-sans tracking-tight">Enterprise Model Registry</h1>
            <p className="text-xs text-neutral-400 mt-0.5">Track, audit, label, and test production-ready ML model architectures.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Models tables */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#121214]/80 rounded border border-neutral-800 p-4">
            <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-neutral-450 block mb-3">Model Archive Packages</span>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-sans text-left">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-500">
                    <th className="py-2.5 font-bold">Model ID / Name</th>
                    <th className="py-2.5 font-bold">Framework</th>
                    <th className="py-2.5 font-bold text-center">Accuracy Score</th>
                    <th className="py-2.5 font-bold text-center">Loss Metrics</th>
                    <th className="py-2.5 font-bold text-center">Deployment status</th>
                    <th className="py-2.5 font-bold text-right">Parameters config</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1e]">
                  {models.map((m) => (
                    <tr key={m.id} className="hover:bg-neutral-900/40 text-neutral-350">
                      <td className="py-3">
                        <div className="font-mono font-bold text-amber-500">{m.name}</div>
                        <div className="text-[10px] text-neutral-505 mt-0.5 font-mono">{m.id} • v{m.version}</div>
                      </td>
                      <td className="py-3 font-medium text-neutral-400 font-mono">{m.framework}</td>
                      <td className="py-3 text-center font-mono text-emerald-400 font-bold">{(m.accuracy * 100).toFixed(2)}%</td>
                      <td className="py-3 text-center font-mono text-rose-500 font-bold">{m.loss.toFixed(4)}</td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono ${
                          m.status === "active" ? "bg-emerald-950/30 text-emerald-400 border border-emerald-500/20" : m.status === "candidate" ? "bg-amber-950/20 text-amber-500 border border-amber-500/20" : "bg-neutral-900 text-neutral-500 border border-neutral-800"
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono text-neutral-500 text-[10px]">
                        {Object.entries(m.parameters).map(([k, v]) => `${k}=${v}`).join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Predictor active tester */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#121214]/80 rounded border border-neutral-800 p-4 text-xs font-sans">
            <div className="flex items-center gap-1.5 border-b border-neutral-850 pb-2 mb-3">
              <Cpu size={14} className="text-amber-500" />
              <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-neutral-300">Active Test Prediction</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-neutral-400 block mb-1 font-bold">Target Model Package</label>
                <select
                  id="predict-model-select"
                  value={activeTestModel}
                  onChange={(e) => setActiveTestModel(e.target.value)}
                  className="w-full bg-[#09090b] border border-neutral-800 rounded p-1.5 text-xs text-neutral-100 outline-none focus:border-amber-500"
                >
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} [v{m.version}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1 font-bold">Patient Age (years)</label>
                <input
                  id="predict-age"
                  type="number"
                  value={testInputs.age}
                  onChange={(e) => setTestInputs((p) => ({ ...p, age: Number(e.target.value) }))}
                  className="w-full bg-[#09090b] border border-neutral-800 rounded p-1.5 text-xs text-neutral-100 outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1 font-bold">Systolic Blood Pressure (mmHg)</label>
                <input
                  id="predict-sbp"
                  type="number"
                  value={testInputs.systolic_bp}
                  onChange={(e) => setTestInputs((p) => ({ ...p, systolic_bp: Number(e.target.value) }))}
                  className="w-full bg-[#09090b] border border-neutral-800 rounded p-1.5 text-xs text-neutral-100 outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1 font-bold">Serum Cholesterol (mg/dL)</label>
                <input
                  id="predict-chol"
                  type="number"
                  value={testInputs.cholesterol}
                  onChange={(e) => setTestInputs((p) => ({ ...p, cholesterol: Number(e.target.value) }))}
                  className="w-full bg-[#09090b] border border-neutral-800 rounded p-1.5 text-xs text-neutral-100 outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <button
                id="predict-trigger"
                onClick={triggerMockPrediction}
                disabled={evaluatingResult}
                className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold py-2 rounded transition cursor-pointer text-xs flex justify-center items-center gap-1.5 font-mono"
              >
                <Play size={12} fill="currentColor" className={evaluatingResult ? "animate-spin" : ""} />
                <span>{evaluatingResult ? "Evaluating Core..." : "Compute Prediction"}</span>
              </button>

              {/* Outputs indicator result */}
              {predictionProbability !== null && (
                <div className="mt-4 pt-3 border-t border-neutral-800 text-center space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 block font-bold">Risk Evaluation Output Probability</span>
                  <div className={`text-2xl font-mono font-black ${predictionProbability > 0.6 ? "text-rose-400" : "text-emerald-400"}`}>
                    {(predictionProbability * 100).toFixed(2)}%
                  </div>
                  <div className="text-[10px] text-neutral-400 leading-normal.">
                    {predictionProbability > 0.6 ? (
                      <span className="text-rose-450 font-bold block mt-1.5">🚨 Critical cardiovascular probability flag. Align clinical care indicators.</span>
                    ) : (
                      <span className="text-emerald-450 font-bold block mt-1.5">✓ Healthy boundary constraints maintained. Standard status indicator.</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
