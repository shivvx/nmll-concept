import React, { useState } from "react";
import {
  Layers,
  Sparkles,
  Cpu,
  Bookmark,
  TrendingUp,
  Activity,
  Award,
  Clock,
  RotateCcw,
  ShieldCheck,
  Download,
  AlertTriangle,
  Lightbulb,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Settings,
  HelpCircle,
} from "lucide-react";
import { ExperimentRun } from "../types";

interface LoggedProps {
  logMessage: (msg: string, type?: "info" | "success" | "error" | "system") => void;
}

// ==================== 1. HOME VIEW ====================
export function HomeView({ logMessage }: LoggedProps) {
  const [qaQuery, setQaQuery] = useState("");
  const [qaAnswer, setQaAnswer] = useState<string | null>(null);
  const [qaLoading, setQaLoading] = useState(false);

  // High-quality local project context indexer
  const handleLocalMemorySearch = () => {
    if (!qaQuery.trim()) return;
    setQaLoading(true);
    setQaAnswer(null);
    logMessage(`Interfacing Local Workspace memory vector indexer for query: "${qaQuery}"`, "info");

    setTimeout(() => {
      const q = qaQuery.toLowerCase();
      let answer = "No exact historical run telemetry covers this specific parameter in active workspace. Suggest generating deep model fits.";

      if (q.includes("accuracy") || q.includes("metric")) {
        answer = "Workspace Diagnosis: Model validation metrics peaked on Run RF_ENS_01 (accuracy: 96.54%). However, during training Console adjustments, we noted a slight overfitting deviation. Remediate by setting max_depth bounds.";
      } else if (q.includes("changed") || q.includes("difference")) {
        answer = "Changelog Audit: 3 commits triggered in last 2 days. Commited Median_Imputation steps inside Dataset Wrangler, configured standard XGBoost decision limits, and loaded telemetry S3 layers.";
      } else if (q.includes("dataset") || q.includes("best")) {
        answer = "Workflow Lineage: clinical_telemetry.csv (Health: 89%) produced the leading Ensemble RandomForest head v2.1.0-prod, exhibiting a True Positive rate of 509 samples and 15 False Negatives.";
      }

      setQaAnswer(answer);
      setQaLoading(false);
      logMessage("Workspace memories returned coordinates.", "success");
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-950/10 via-[#121214] to-neutral-950/10 border border-neutral-800 rounded p-6 relative overflow-hidden">
        <div className="absolute right-6 top-6 text-amber-500/5">
          <Layers size={64} />
        </div>
        <span className="text-[9px] font-mono font-bold tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20 uppercase">
          NMLL Workspace v1.4.0
        </span>
        <h1 className="text-xl font-bold font-sans text-neutral-100 tracking-tight mt-3">Neura Machine Learning Operating Workspace</h1>
        <p className="text-xs text-neutral-400 font-sans mt-1.5 leading-relaxed max-w-2xl">
          Beyond Notebooks. A fully loaded SaaS engineering suite designed by Wiroxa for complex model optimization, visual pipeline compilation, metrics analytics, and AI assistance.
        </p>
      </div>

      {/* Grid: Project Memory Search Q&A & Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Project Memory Search Card */}
        <div className="md:col-span-2 bg-[#121214]/80 rounded border border-neutral-800 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-neutral-300 mb-3 block flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-500" />
              <span>Project Memory Semantic Q&A</span>
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              Query historical indicators loaded directly from code repositories, dataset stats, and run matrices.
            </p>

            <div className="flex gap-2">
              <input
                id="memory-search-input"
                type="text"
                value={qaQuery}
                onChange={(e) => setQaQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLocalMemorySearch()}
                placeholder="Ask e.g. Why accuracy dropped? What changed? Which dataset was best?"
                className="flex-1 bg-[#09090b] border border-neutral-805 rounded p-2 text-xs text-neutral-100 outline-none placeholder:text-neutral-700 focus:border-amber-500/60"
              />
              <button
                id="memory-search-btn"
                onClick={handleLocalMemorySearch}
                className="bg-amber-600 hover:bg-amber-500 text-black font-bold px-4 py-2 rounded text-xs cursor-pointer transition-colors"
              >
                Query
              </button>
            </div>
          </div>

          <div className="min-h-[50px] mt-4 p-3.5 rounded bg-[#09090b] border border-neutral-850 text-xs leading-relaxed font-sans text-neutral-300">
            {qaLoading ? (
              <div className="text-center font-mono text-neutral-500 animate-pulse">
                Accessing local embeddings database indexes...
              </div>
            ) : qaAnswer ? (
              <div>
                <span className="font-bold text-amber-500 font-mono text-[10px] block mb-1 uppercase tracking-wider">MEM_CORRELATE OUTPUT:</span>
                <p>{qaAnswer}</p>
              </div>
            ) : (
              <span className="text-neutral-600 italic block text-center">Ask a semantic memory query to audit historical workspace parameters.</span>
            )}
          </div>
        </div>

        {/* Quick statistics checklist */}
        <div className="bg-[#121214]/80 rounded border border-neutral-800 p-5">
          <span className="text-xs uppercase tracking-wider font-mono font-bold text-neutral-300 block mb-3">Workspace Status Indicators</span>
          <div className="space-y-4 text-xs font-sans">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Configured Datasets</span>
              <span className="font-bold text-neutral-200">2 Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Total Run Runs</span>
              <span className="font-bold text-neutral-200">12 Evaluated</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Leading Model Version</span>
              <span className="font-mono text-emerald-400 font-bold">Ensemble_v2.1.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Running CUDA environment</span>
              <span className="font-mono text-amber-500 font-bold">AWS_A100_S1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ==================== 2. PROJECTS VIEW ====================
export function ProjectsView() {
  const projs = [
    { title: "Heart disease Cardiovascular Telemetry", desc: "Diagnostic evaluation using clinical health telemetry markers. Optimized via XGBoost ensemble networks.", metrics: "96.54% Target Acc", files: "14 Assets", target: "Kubernetes FastAPI Core" },
    { title: "Ad Click Conversion Funnel", desc: "Session analytics behavioral telemetry modeling. Incorporates high category imbalanceSMOTE resamplers.", metrics: "94.12% Target Acc", files: "8 Assets", target: "ONNX Native" },
  ];

  return (
    <div id="projects-board" className="space-y-6">
      <h2 className="text-base font-bold text-neutral-100 font-sans tracking-tight">Workspace Active Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projs.map((p, idx) => (
          <div key={idx} className="bg-[#121214]/80 border border-neutral-805 rounded p-5 hover:border-neutral-700 transition-all flex flex-col justify-between">
            <div>
              <h3 className="font-sans font-bold text-neutral-200 text-sm">{p.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mt-2">{p.desc}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-800/60 flex justify-between items-center text-[11px] font-mono">
              <span className="text-amber-500 font-bold">{p.metrics}</span>
              <span className="text-neutral-500">{p.files}</span>
              <span className="text-emerald-400 font-bold">{p.target}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ==================== 3. EXPERIMENTS VIEW ====================
export function ExperimentsView({ logMessage }: LoggedProps) {
  const [runs, setRuns] = useState<ExperimentRun[]>([
    { id: "run_rf_01", name: "RandomForest_Cascade_Fit", status: "COMPLETED", accuracy: 0.9654, loss: 0.1582, epochCount: 15, learningRate: 0.001, timestamp: "2026-06-20 18:22", featuresUsed: ["cholesterol", "systolic_bp", "age"] },
    { id: "run_xgb_02", name: "XGBoost_Booster_Fit", status: "COMPLETED", accuracy: 0.9412, loss: 0.2104, epochCount: 10, learningRate: 0.005, timestamp: "2026-06-20 12:11", featuresUsed: ["cholesterol", "age"] },
    { id: "run_resnet_03", name: "DenseNet_Deep_Activation", status: "COMPLETED", accuracy: 0.8241, loss: 0.6124, epochCount: 50, learningRate: 0.010, timestamp: "2026-06-19 14:02", featuresUsed: ["all_clinical"] },
  ]);

  const handleRollback = (runId: string) => {
    logMessage(`Rollback trigger set: Reverting active pipeline metrics parameters to package match: ${runId}`, "system");
    setTimeout(() => {
      logMessage(`Workspace registry rolled back successfully. Active weights: ${runId}`, "success");
    }, 600);
  };

  return (
    <div id="experiments-matrix" className="space-y-6">
      <div className="bg-[#121214]/80 rounded border border-neutral-800 p-5">
        <h2 className="text-xs uppercase tracking-wider font-mono font-bold text-neutral-300 mb-4 block">MLflow-Compatible Metrics Database</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-sans text-left">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400">
                <th className="py-2.5 font-bold font-mono text-[10px] uppercase">Run ID</th>
                <th className="py-2.5 font-bold font-mono text-[10px] uppercase">Experiment Node</th>
                <th className="py-2.5 font-bold font-mono text-[10px] uppercase">Accuracy Metric</th>
                <th className="py-2.5 font-bold font-mono text-[10px] uppercase">Loss Metric</th>
                <th className="py-2.5 font-bold font-mono text-[10px] uppercase">Epoch bounds</th>
                <th className="py-2.5 font-bold font-mono text-[10px] uppercase">Learning rate</th>
                <th className="py-2.5 font-bold font-mono text-[10px] uppercase">Features profile</th>
                <th className="py-2.5 font-bold text-right font-mono text-[10px] uppercase">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {runs.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-900/35 text-neutral-200 transition-colors">
                  <td className="py-3 font-mono font-bold text-amber-500">{r.id}</td>
                  <td className="py-3 font-sans">
                    <div className="font-medium text-neutral-250">{r.name}</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">{r.timestamp}</div>
                  </td>
                  <td className="py-3 font-mono text-emerald-400 font-bold">{(r.accuracy * 100).toFixed(2)}%</td>
                  <td className="py-3 font-mono text-rose-500 font-bold">{r.loss.toFixed(4)}</td>
                  <td className="py-3 font-mono text-neutral-300">{r.epochCount}</td>
                  <td className="py-3 font-mono text-neutral-300">{r.learningRate}</td>
                  <td className="py-3 text-neutral-400 truncate max-w-[150px]">{r.featuresUsed.join(", ")}</td>
                  <td className="py-3 text-right">
                    <button
                      id={`rollback-run-${r.id}`}
                      onClick={() => handleRollback(r.id)}
                      className="px-2 py-1 rounded bg-[#1c1c1f] hover:bg-neutral-800 border border-neutral-800 text-[10px] text-amber-500 font-mono cursor-pointer transition-colors"
                    >
                      Rollback weights
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// ==================== 4. INTELLIGENCE VIEW ====================
export function IntelligenceView() {
  const metricsList = [
    { name: "Dataset Health Score", val: 89, color: "text-amber-500", desc: "Heart disease dataset statistical bounds maintain integrity. Few categorical inconsistencies identified." },
    { name: "Model Convergence Loss Target", val: 96, color: "text-emerald-400", desc: "Epoch accuracy improvements matched targets on RandomForest head. Loss decay gradients completed successfully." },
    { name: "Experiment Run Lineage", val: 100, color: "text-amber-400", desc: "No broken execution checkpoints identified. Core model state lineage variables fully documented." },
    { name: "Deployment SaaS Readiness", val: 78, color: "text-orange-500", desc: "FastAPI server script is prepared. Set active API secrets parameters inside secrets UI to deploy on Kubernetes." },
  ];

  return (
    <div id="intelligence-optimizer" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metricsList.map((m, idx) => (
          <div key={idx} className="bg-[#121214]/80 border border-neutral-800 rounded p-5">
            <span className="text-[9px] font-mono tracking-wider text-neutral-500 block uppercase font-bold">{m.name}</span>
            <div className={`text-2xl font-mono font-bold my-2 ${m.color}`}>{m.val}%</div>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


// ==================== 5. DEPLOYMENT VIEW ====================
export function DeploymentView({ logMessage }: LoggedProps) {
  const triggerDockerDeploy = () => {
    logMessage("Packing active models and deploying FastAPI gateway as Docker container...", "system");
    setTimeout(() => {
      logMessage("Docker instance packed successfully. Command line trigger: docker compose up -d", "success");
    }, 1000);
  };

  return (
    <div id="deployment-portal" className="space-y-6">
      <div className="bg-[#121214]/80 border border-neutral-800 rounded p-5">
        <h2 className="text-sm font-semibold text-neutral-200 mb-4 flex items-center gap-1.5 font-sans">
          <ShieldCheck size={16} className="text-amber-500" />
          <span>Deploy Target Selector</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded border border-neutral-800 bg-[#09090b] flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded block w-fit">FastAPI Serving</span>
              <h3 className="font-bold text-neutral-100 text-sm mt-2 font-sans">Deploy Gateway Router</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">Exporter of the official, containerized Python FastAPI web serving route stack.</p>
            </div>
            <button
              id="deploy-fastapi"
              onClick={triggerDockerDeploy}
              className="mt-4 w-full bg-[#1c1c1f] border border-neutral-800 text-amber-500 font-mono font-bold transition hover:bg-neutral-800 py-1.5 rounded text-xs cursor-pointer"
            >
              Pack & Run Container
            </button>
          </div>

          <div className="p-4 rounded border border-neutral-800 bg-[#09090b] flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase font-mono font-bold text-orange-400 bg-orange-950/20 px-2 py-0.5 rounded block w-fit">ONNX Graph</span>
              <h3 className="font-bold text-neutral-100 text-sm mt-2 font-sans">Export Compiled Graph</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">Compiles and bundles the selected ensemble classifier parameters into high-speed ONNX runtime assets.</p>
            </div>
            <button
              id="export-onnx"
              onClick={() => logMessage("Compiled ONNX payload generated successfully. File size: 1.4 MB", "success")}
              className="mt-4 w-full bg-[#1c1c1f] border border-neutral-800 text-orange-450 font-mono font-bold transition hover:bg-neutral-800 py-1.5 rounded text-xs cursor-pointer"
            >
              Download ONNX Assembly
            </button>
          </div>

          <div className="p-4 rounded border border-neutral-800 bg-[#09090b] flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase font-mono font-bold text-yellow-500 bg-yellow-950/20 px-2 py-0.5 rounded block w-fit">Hugging Face</span>
              <h3 className="font-bold text-neutral-100 text-sm mt-2 font-sans">Sync Models Hub</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">Direct export channel matching HuggingFace weights repository formats.</p>
            </div>
            <button
              id="export-huggingface"
              onClick={() => logMessage("Evaluating HuggingFace workspace connection tokens...", "info")}
              className="mt-4 w-full bg-[#1c1c1f] border border-neutral-800 text-yellow-505 font-mono font-bold transition hover:bg-neutral-805 py-1.5 rounded text-xs cursor-pointer"
            >
              Push Repository
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ==================== 6. MARKETPLACE VIEW ====================
export function MarketplaceView() {
  const storeItems = [
    { title: "ResNet Gradient Backbones", path: "Templates", desc: "Standard visual convolutional networks template layers. Loaded with preset weights metrics." },
    { title: "XGBoost decision booster block", path: "Nodes", desc: "Interactive custom pipeline flow block wrapping XGBoost classifier capabilities." },
    { title: "IMDB review sentiment tokenizer", path: "Models", desc: "Pre-trained natural language tokenizer classifier for clinical clinical text reviews." },
  ];

  return (
    <div id="marketplace-hub" className="space-y-6">
      <h2 className="text-base font-bold text-neutral-100 font-sans tracking-tight">Wiroxa Extensions & Nodes Store</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {storeItems.map((item, idx) => (
          <div key={idx} className="bg-[#121214]/80 border border-neutral-800 rounded p-5 flex flex-col justify-between hover:border-amber-500/40 transition-all">
            <div>
              <span className="text-[9px] uppercase font-mono text-amber-400 bg-[#09090b] px-2 py-0.5 rounded border border-amber-500/10 inline-block mb-3 font-bold">{item.path}</span>
              <h3 className="font-sans font-bold text-neutral-200 text-sm">{item.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mt-2">{item.desc}</p>
            </div>
            <button className="mt-4 w-full bg-amber-500/5 text-amber-450 hover:bg-amber-500/15 text-xs border border-amber-500/15 py-1.5 rounded transition cursor-pointer text-center font-bold">
              Download Node Block
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


// ==================== 7. SETTINGS VIEW ====================
export function SettingsView() {
  return (
    <div id="settings-panel" className="bg-[#121214]/80 rounded border border-neutral-800 p-5 space-y-6 max-w-2xl text-xs font-sans">
      <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-100 border-b border-neutral-850 pb-2 flex items-center gap-1.5 font-mono">
        <Settings size={14} className="text-amber-500" />
        <span>Workspace Platform Settings</span>
      </h2>

      <div className="space-y-4">
        <div>
          <label className="text-neutral-400 block mb-1 font-bold">Default AI Engine Model</label>
          <select className="bg-[#09090b] border border-neutral-800 rounded p-1.5 text-xs text-neutral-100 outline-none w-fit focus:border-amber-500">
            <option>gemini-3.5-flash (Lead Workspace Assistant)</option>
            <option>gemini-3.1-pro-preview (Complex Tasks Reasoning)</option>
          </select>
        </div>

        <div>
          <label className="text-neutral-400 block mb-1 font-bold">Workspace Theme Aesthetic</label>
          <select className="bg-[#09090b] border border-neutral-800 rounded p-1.5 text-xs text-neutral-100 outline-none w-fit focus:border-amber-500">
            <option>Elegant Dark Space (Obsidian & Amber Gold)</option>
            <option>Deep Navy Cyberpunk Grid</option>
          </select>
        </div>

        <div className="bg-[#09090b] border border-amber-500/10 p-3.5 rounded">
          <span className="font-bold text-amber-500 block mb-1 uppercase font-mono text-[9px] tracking-wider">API Security Notice</span>
          <p className="text-[11px] text-neutral-400 leading-normal font-sans">
            NMLL Studio secures all secret API values server-side. Do NOT enter direct API secret coordinates inside client web templates. Integrate actual keys via the <strong className="text-amber-400">Environment variables configuration (.env.local)</strong> or backend server settings.
          </p>
        </div>
      </div>
    </div>
  );
}
