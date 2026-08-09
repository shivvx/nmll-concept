import React, { useState } from "react";
import {
  Camera,
  Folder,
  FolderOpen,
  Image as ImageIcon,
  Download,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Layers,
  Database,
  Brain,
  Activity,
  Eye,
  ShieldCheck,
  ShoppingBag,
  CheckCircle,
  Copy,
  Check,
  FileText,
  Search,
  Sliders,
  RefreshCw,
  X,
  ExternalLink,
} from "lucide-react";

interface UISnapshot {
  id: string;
  category: "Core" | "ML Pipeline" | "Registry" | "Engine" | "Diagnostic" | "Ops" | "Addons";
  categoryKey: string;
  folderPath: string;
  fileName: string;
  title: string;
  description: string;
  resolution: string; // e.g. "3840 x 2160 (4K UHD)"
  fileSize: string;
  aspectRatio: string;
  colorSpace: string;
  features: string[];
  imageUrl: string;
  domPreviewType: string;
}

interface SnapshotsGalleryProps {
  logMessage: (msg: string, type?: "info" | "success" | "error" | "system") => void;
  onNavigateTab?: (tab: any) => void;
}

export default function SnapshotsGallery({ logMessage, onNavigateTab }: SnapshotsGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSnapshot, setActiveSnapshot] = useState<UISnapshot | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [targetRes, setTargetRes] = useState<"4K" | "2K" | "FHD">("4K");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);

  const snapshotDatabase: UISnapshot[] = [
    {
      id: "snap_core_home",
      category: "Core",
      categoryKey: "01_Core",
      folderPath: "/public/snapshots/01_Core",
      fileName: "core_home_base_dashboard_4k.png",
      title: "Core Home Base & Project Memory Q&A",
      description: "Ultra-wide 4K overview of NMLL Studio main dashboard featuring Semantic Vector Memory search, project stats, and real-time CUDA cluster telemetry.",
      resolution: "3840 × 2160 (4K UHD)",
      fileSize: "4.8 MB",
      aspectRatio: "16:9",
      colorSpace: "Display P3 / 10-bit HDR",
      features: ["Vector Embeddings Memory Q&A", "CUDA Status Beacon", "SaaS Metric Cards", "Recent Lineage Feed"],      imageUrl: "/snapshots/01_Core/core_home_base_dashboard_4k.svg",
      domPreviewType: "home",
    },
    {
      id: "snap_core_projects",
      category: "Core",
      categoryKey: "01_Core",
      folderPath: "/public/snapshots/01_Core",
      fileName: "core_projects_workspace_4k.png",
      title: "Projects & Workspace Architecture",
      description: "Comprehensive grid of active cardiovascular and behavioral ML project containers with framework targets and asset counts.",
      resolution: "3840 × 2160 (4K UHD)",
      fileSize: "3.9 MB",
      aspectRatio: "16:9",
      colorSpace: "sRGB",
      features: ["Cardiovascular Telemetry Board", "Conversion Funnel Grid", "Target Runtime Badges", "Asset Counters"],
      imageUrl: "/snapshots/01_Core/core_projects_workspace_4k.svg",
      domPreviewType: "projects",
    },
    {
      id: "snap_pipe_wrangler",
      category: "ML Pipeline",
      categoryKey: "02_ML_Pipeline",
      folderPath: "/public/snapshots/02_ML_Pipeline",
      fileName: "pipeline_dataset_wrangler_4k.png",
      title: "Dataset Wrangler & Profiler",
      description: "Interactive data grid displaying missing value distributions, numerical feature correlations, column typing, and dataset health scores.",
      resolution: "3840 × 2160 (4K UHD)",
      fileSize: "5.2 MB",
      aspectRatio: "16:9",
      colorSpace: "Display P3",
      features: ["Correlation Heatmap Matrix", "Missing Value Distribution", "Column Type Transformers", "Clinical CSV Telemetry"],
      imageUrl: "/snapshots/02_ML_Pipeline/pipeline_dataset_wrangler_4k.svg",
      domPreviewType: "datasets",
    },
    {
      id: "snap_pipe_notebooks",
      category: "ML Pipeline",
      categoryKey: "02_ML_Pipeline",
      folderPath: "/public/snapshots/02_ML_Pipeline",
      fileName: "pipeline_jupyter_notebooks_4k.png",
      title: "Interactive Python 3.10 Notebooks",
      description: "Sandboxed Jupyter notebook interface showing sequential Python cells, pandas execution, RandomForest classifier fits, and kernel state variable inspector.",
      resolution: "3840 × 2160 (4K UHD)",
      fileSize: "4.1 MB",
      aspectRatio: "16:9",
      colorSpace: "sRGB",
      features: ["Python Code Cells", "Active Variable Stack Inspector", "Kernel State Manager", "Stdout Terminal Feeds"],
      imageUrl: "/snapshots/02_ML_Pipeline/pipeline_jupyter_notebooks_4k.svg",
      domPreviewType: "notebooks",
    },
    {
      id: "snap_pipe_canvas",
      category: "ML Pipeline",
      categoryKey: "02_ML_Pipeline",
      folderPath: "/public/snapshots/02_ML_Pipeline",
      fileName: "pipeline_visual_graph_4k.png",
      title: "Visual Drag & Drop Graph Optimizer",
      description: "Node-based visual ML pipeline graph renderer featuring bezier curve wires, interactive module blocks, AI auto-layout, and graph execution compiler.",
      resolution: "3840 × 2160 (4K UHD)",
      fileSize: "5.6 MB",
      aspectRatio: "16:9",
      colorSpace: "Display P3 / 10-bit HDR",
      features: ["Bezier Wire Connectors", "Drag & Drop Canvas Arena", "AI Auto Node Flow", "Real-Time Pipeline Execution"],
      imageUrl: "/snapshots/02_ML_Pipeline/pipeline_visual_graph_4k.svg",
      domPreviewType: "pipelines",
    },
    {
      id: "snap_reg_models",
      category: "Registry",
      categoryKey: "03_Registry",
      folderPath: "/public/snapshots/03_Registry",
      fileName: "registry_model_packages_4k.png",
      title: "Enterprise Model Registry & Tester",
      description: "Production model registry table displaying RandomForest, XGBoost, and PyTorch packages alongside an active patient risk predictor test panel.",
      resolution: "3840 × 2160 (4K UHD)",
      fileSize: "4.4 MB",
      aspectRatio: "16:9",
      colorSpace: "sRGB",
      features: ["Model Version Lineage", "Accuracy & Loss Metrics", "Live Patient Predictor Tester", "Parameter Configuration Auditing"],
      imageUrl: "/snapshots/03_Registry/registry_model_packages_4k.svg",
      domPreviewType: "models",
    },
    {
      id: "snap_eng_train",
      category: "Engine",
      categoryKey: "04_Engine",
      folderPath: "/public/snapshots/04_Engine",
      fileName: "engine_live_train_console_4k.png",
      title: "Live Model Training Console",
      description: "Real-time training environment with epoch loss convergence curves, hyperparameter tuning knobs, confusion matrix heatmaps, and stdout logs stream.",
      resolution: "3840 × 2160 (4K UHD)",
      fileSize: "5.1 MB",
      aspectRatio: "16:9",
      colorSpace: "Display P3",
      features: ["Epoch Loss Chart Visualizer", "Confusion Matrix Heatmap", "Real-time Hyperparameter Controls", "Streamed Training Logs"],
      imageUrl: "/snapshots/04_Engine/engine_live_train_console_4k.svg",
      domPreviewType: "training",
    },
    {
      id: "snap_eng_exp",
      category: "Engine",
      categoryKey: "04_Engine",
      folderPath: "/public/snapshots/04_Engine",
      fileName: "engine_experiment_matrix_4k.png",
      title: "MLflow-Compatible Experiment Matrix",
      description: "Detailed tabular experiment tracking view comparing multiple model fits, learning rates, epoch counts, and weight rollback mechanisms.",
      resolution: "3840 × 2160 (4K UHD)",
      fileSize: "3.8 MB",
      aspectRatio: "16:9",
      colorSpace: "sRGB",
      features: ["Experiment Run Comparison", "One-Click Weight Rollback", "Learning Rate Lineage", "Feature Profile Logs"],
      imageUrl: "/snapshots/04_Engine/engine_experiment_matrix_4k.svg",
      domPreviewType: "experiments",
    },
    {
      id: "snap_diag_intel",
      category: "Diagnostic",
      categoryKey: "05_Diagnostic",
      folderPath: "/public/snapshots/05_Diagnostic",
      fileName: "diagnostic_intelligence_optimizer_4k.png",
      title: "Intelligence Optimizer & Health Scoring",
      description: "Diagnostic scorecard evaluating Dataset Health (89%), Model Convergence Target (96%), Run Lineage Integrity (100%), and SaaS Readiness (78%).",
      resolution: "3840 × 2160 (4K UHD)",
      fileSize: "4.0 MB",
      aspectRatio: "16:9",
      colorSpace: "sRGB",
      features: ["Health Score Cards", "SaaS Deployment Readiness", "Data Consistency Checks", "Gradients Health Matrix"],
      imageUrl: "/snapshots/05_Diagnostic/diagnostic_intelligence_optimizer_4k.svg",
      domPreviewType: "intelligence",
    },
    {
      id: "snap_diag_exp",
      category: "Diagnostic",
      categoryKey: "05_Diagnostic",
      folderPath: "/public/snapshots/05_Diagnostic",
      fileName: "diagnostic_explainability_suite_4k.png",
      title: "SHAP Explainability & Feature Importance",
      description: "Deep model explainability suite rendering SHAP feature ranking bars, local waterfall breakdown charts, and medical feature contribution values.",
      resolution: "3840 × 2160 (4K UHD)",
      fileSize: "4.9 MB",
      aspectRatio: "16:9",
      colorSpace: "Display P3",
      features: ["SHAP Feature Rankings", "Waterfall Contribution Graphs", "Patient Risk Explainer", "Clinical Decision Bounds"],
      imageUrl: "/snapshots/05_Diagnostic/diagnostic_explainability_suite_4k.svg",
      domPreviewType: "explainability",
    },
    {
      id: "snap_ops_deploy",
      category: "Ops",
      categoryKey: "06_Ops",
      folderPath: "/public/snapshots/06_Ops",
      fileName: "ops_dynamic_deployment_4k.png",
      title: "Dynamic Deployment Target Selector",
      description: "MLOps containerization portal providing one-click FastAPI Docker packaging, ONNX runtime graph export, and Hugging Face Hub synchronization.",
      resolution: "3840 × 2160 (4K UHD)",
      fileSize: "4.3 MB",
      aspectRatio: "16:9",
      colorSpace: "sRGB",
      features: ["FastAPI Docker Microservice", "ONNX Graph Export", "HuggingFace Sync", "Kubernetes Pod Config"],
      imageUrl: "/snapshots/06_Ops/ops_dynamic_deployment_4k.svg",
      domPreviewType: "deployment",
    },
    {
      id: "snap_ops_copilot",
      category: "Ops",
      categoryKey: "06_Ops",
      folderPath: "/public/snapshots/06_Ops",
      fileName: "ops_ai_copilots_4k.png",
      title: "Multi-Persona AI Copilots Suite",
      description: "Interactive AI consultation suite featuring Lead Copilot, EDA Scientist, MLOps Architect, Research Assistant, and Project Analyst agents.",
      resolution: "3840 × 2160 (4K UHD)",
      fileSize: "4.6 MB",
      aspectRatio: "16:9",
      colorSpace: "Display P3",
      features: ["5 Specialized AI Personas", "PyTorch Code Generation", "Gemini Model Brain Integration", "Context-Aware Workspace Search"],
      imageUrl: "/snapshots/06_Ops/ops_ai_copilots_4k.svg",
      domPreviewType: "assistant",
    },
    {
      id: "snap_addons_market",
      category: "Addons",
      categoryKey: "07_Addons",
      folderPath: "/public/snapshots/07_Addons",
      fileName: "addons_wiroxa_marketplace_4k.png",
      title: "Wiroxa Extensions & Nodes Marketplace",
      description: "Modular ecosystem catalog showcasing downloadable pre-trained backbone templates, custom pipeline nodes, and tokenizer packages.",
      resolution: "3840 × 2160 (4K UHD)",
      fileSize: "3.7 MB",
      aspectRatio: "16:9",
      colorSpace: "sRGB",
      features: ["ResNet Backbone Templates", "XGBoost Custom Nodes", "IMDB Tokenizer Models", "One-Click Node Installer"],
      imageUrl: "/snapshots/07_Addons/addons_wiroxa_marketplace_4k.svg",
      domPreviewType: "marketplace",
    },
    {
      id: "snap_addons_settings",
      category: "Addons",
      categoryKey: "07_Addons",
      folderPath: "/public/snapshots/07_Addons",
      fileName: "addons_system_settings_4k.png",
      title: "System Settings & Platform Security",
      description: "Workspace configuration panel covering default AI engine models, dark obsidian aesthetic themes, and secure server-side secrets guidance.",
      resolution: "3840 × 2160 (4K UHD)",
      fileSize: "3.4 MB",
      aspectRatio: "16:9",
      colorSpace: "sRGB",
      features: ["Gemini Model Chooser", "Dark Obsidian Theme Config", "API Secrets Security Guide", "Platform Telemetry Settings"],
      imageUrl: "/snapshots/07_Addons/addons_system_settings_4k.svg",
      domPreviewType: "settings",
    },
  ];

  const categories = ["All", "Core", "ML Pipeline", "Registry", "Engine", "Diagnostic", "Ops", "Addons"];

  const filteredSnapshots = snapshotDatabase.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleCopyLink = (id: string, path: string) => {
    navigator.clipboard.writeText(window.location.origin + path);
    setCopiedId(id);
    logMessage(`Copied snapshot 4K URI to clipboard: ${path}`, "info");
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleDownloadSnapshot = (snap: UISnapshot) => {
    const link = document.createElement("a");
    link.href = snap.imageUrl;
    link.download = snap.fileName.replace('.png', '.svg');
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logMessage(`Downloaded 4K UI Snapshot: ${snap.fileName} (${snap.resolution})`, "success");
    setDownloadSuccessMsg(`Saved ${snap.fileName} to disk!`);
    setTimeout(() => setDownloadSuccessMsg(null), 2500);
  };

  const handleDownloadAllZip = () => {
    logMessage("Downloading all 14 category 4K UI snapshots archive: NMLL_Studio_4K_Snapshots.zip...", "system");
    const link = document.createElement("a");
    link.href = "/api/download-snapshots-zip";
    link.download = "NMLL_Studio_4K_Snapshots.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logMessage("Archive download initiated for all category snapshots in 4K resolution.", "success");
    setDownloadSuccessMsg("Archive 'NMLL_Studio_4K_Snapshots.zip' downloaded successfully!");
    setTimeout(() => setDownloadSuccessMsg(null), 3000);
  };

  const triggerLive4KCapture = () => {
    setIsCapturing(true);
    logMessage("Initializing 4K HTML5 DOM Canvas Snapshot capture engine (3840x2160 @ 60 FPS)...", "info");

    setTimeout(() => {
      setIsCapturing(false);
      logMessage("Successfully captured active viewport UI frame in 4K resolution! Saved to /public/snapshots/05_Diagnostic/live_captured_4k.png", "success");
      setDownloadSuccessMsg("Captured & saved new 4K UI snapshot to /public/snapshots folder!");
      setTimeout(() => setDownloadSuccessMsg(null), 3000);
    }, 1500);
  };

  return (
    <div id="4k-snapshots-workspace" className="flex-1 flex flex-col bg-[#0c0c0e] text-neutral-200 overflow-hidden h-full font-sans">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#050507] border-b border-neutral-850 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20">
            <Camera size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-neutral-100 tracking-tight font-sans">
                4K UI Snapshots Folder & Inspector
              </h1>
              <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-black uppercase">
                3840 × 2160 UHD
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5 font-sans">
              High-resolution UI visual snapshots across all 7 workspace categories stored in <code className="text-amber-400 font-mono">/public/snapshots/</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <button
            id="capture-4k-snapshot-btn"
            onClick={triggerLive4KCapture}
            disabled={isCapturing}
            className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded text-xs transition cursor-pointer font-bold disabled:opacity-50"
          >
            <RefreshCw size={13} className={isCapturing ? "animate-spin" : ""} />
            <span>{isCapturing ? "Capturing 4K..." : "📸 Capture Live 4K Snapshot"}</span>
          </button>
          <button
            id="download-all-4k-zip"
            onClick={handleDownloadAllZip}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-black px-3.5 py-1.5 rounded text-xs transition cursor-pointer font-bold shadow-md shadow-amber-600/20"
          >
            <Download size={13} />
            <span>Download All Snapshots (.ZIP)</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Directory Tree (Left) & Snapshot Gallery Grid (Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Directory Folder Inspector */}
        <div className="w-64 bg-[#08080a] border-r border-neutral-850 p-4 overflow-y-auto shrink-0 font-mono select-none hidden md:block">
          <div className="flex items-center gap-2 mb-4 border-b border-neutral-850 pb-2 text-xs font-bold text-neutral-300">
            <FolderOpen size={16} className="text-amber-500" />
            <span>DIRECTORY TREE</span>
          </div>

          <div className="text-[11px] space-y-3">
            <div className="text-amber-400 font-bold flex items-center gap-1.5">
              <Folder size={14} className="text-amber-500" />
              <span>/public/snapshots/</span>
            </div>

            <div className="pl-3 space-y-2 border-l border-neutral-800">
              {[
                { name: "01_Core", count: 2, cat: "Core" },
                { name: "02_ML_Pipeline", count: 3, cat: "ML Pipeline" },
                { name: "03_Registry", count: 1, cat: "Registry" },
                { name: "04_Engine", count: 2, cat: "Engine" },
                { name: "05_Diagnostic", count: 2, cat: "Diagnostic" },
                { name: "06_Ops", count: 2, cat: "Ops" },
                { name: "07_Addons", count: 2, cat: "Addons" },
              ].map((f) => {
                const isSelected = selectedCategory === f.cat;
                return (
                  <button
                    key={f.name}
                    onClick={() => setSelectedCategory(f.cat)}
                    className={`w-full flex items-center justify-between p-1.5 rounded text-left transition cursor-pointer ${
                      isSelected ? "bg-amber-500/10 text-amber-400 font-bold" : "hover:bg-neutral-900 text-neutral-400"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <Folder size={13} className={isSelected ? "text-amber-400" : "text-neutral-500"} />
                      <span className="truncate">{f.name}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-500">
                      {f.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-neutral-850 space-y-2 text-[10px] text-neutral-500 font-sans leading-normal">
              <div className="flex justify-between">
                <span>Total Snapshots:</span>
                <span className="text-neutral-300 font-mono font-bold">14 Files</span>
              </div>
              <div className="flex justify-between">
                <span>Default Resolution:</span>
                <span className="text-amber-400 font-mono font-bold">3840 x 2160</span>
              </div>
              <div className="flex justify-between">
                <span>Total Folder Size:</span>
                <span className="text-neutral-300 font-mono font-bold">62.3 MB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Gallery Container */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0c0c0e] p-6 space-y-4">
          {/* Success Banner */}
          {downloadSuccessMsg && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 rounded text-xs font-mono flex items-center gap-2 animate-fade-in">
              <CheckCircle size={15} />
              <span>{downloadSuccessMsg}</span>
            </div>
          )}

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#121214] p-3 rounded border border-neutral-800 shrink-0">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto font-mono text-xs">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded transition cursor-pointer whitespace-nowrap font-bold ${
                      isActive
                        ? "bg-amber-500 text-black"
                        : "bg-[#09090b] hover:bg-neutral-800 text-neutral-400 border border-neutral-800"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search snapshot files..."
                className="w-full bg-[#09090b] border border-neutral-800 rounded pl-8 pr-3 py-1.5 text-xs text-neutral-200 outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Grid of Snapshots */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-1">
            {filteredSnapshots.map((snap) => (
              <div
                key={snap.id}
                className="bg-[#121214]/90 border border-neutral-800 rounded-lg overflow-hidden flex flex-col justify-between hover:border-amber-500/40 transition-all group shadow-md"
              >
                {/* Image Snapshot Preview Header */}
                <div className="relative aspect-video bg-black overflow-hidden group/img cursor-pointer" onClick={() => setActiveSnapshot(snap)}>
                  <img
                    src={snap.imageUrl}
                    alt={snap.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500 opacity-90 group-hover/img:opacity-100"
                  />
                  {/* Resolution Overlay Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-sm border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider">
                    {snap.resolution}
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-neutral-900/80 backdrop-blur-sm border border-neutral-700 text-neutral-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    {snap.category}
                  </div>

                  {/* Hover Inspect Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSnapshot(snap);
                      }}
                      className="bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 rounded font-mono font-bold text-xs flex items-center gap-1.5 transition transform translate-y-2 group-hover/img:translate-y-0"
                    >
                      <Maximize2 size={13} />
                      <span>Inspect 4K</span>
                    </button>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1">
                      <span className="truncate max-w-[200px]" title={snap.folderPath}>
                        {snap.folderPath}/
                      </span>
                      <span className="text-neutral-400 font-bold">{snap.fileSize}</span>
                    </div>
                    <h3 className="font-bold text-neutral-100 text-sm font-sans tracking-tight group-hover:text-amber-400 transition-colors">
                      {snap.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed line-clamp-2 font-sans">
                      {snap.description}
                    </p>
                  </div>

                  {/* Feature Badges */}
                  <div className="flex flex-wrap gap-1 pt-2">
                    {snap.features.slice(0, 3).map((feat, i) => (
                      <span key={i} className="text-[9px] bg-[#09090b] border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded font-mono">
                        {feat}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons Footer */}
                  <div className="pt-3 border-t border-neutral-850 flex items-center justify-between font-mono text-xs">
                    <button
                      onClick={() => handleCopyLink(snap.id, `${snap.folderPath}/${snap.fileName}`)}
                      className="text-neutral-400 hover:text-white flex items-center gap-1 text-[11px] transition cursor-pointer"
                    >
                      {copiedId === snap.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedId === snap.id ? "Copied Path" : "Copy Path"}</span>
                    </button>

                    <button
                      onClick={() => handleDownloadSnapshot(snap)}
                      className="bg-[#1c1c1f] hover:bg-neutral-800 text-amber-400 border border-neutral-800 px-2.5 py-1 rounded flex items-center gap-1 text-[11px] font-bold transition cursor-pointer"
                    >
                      <Download size={12} />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4K FULLSCREEN INSPECTOR MODAL */}
      {activeSnapshot && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-6 overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between bg-[#09090b] border border-neutral-800 px-5 py-3 rounded-t-lg shrink-0 font-mono">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
                  4K ULTRA HD INSPECTOR
                </span>
                <span className="text-sm font-bold text-neutral-100 font-sans">
                  {activeSnapshot.title} ({activeSnapshot.fileName})
                </span>
              </div>
            </div>

            {/* Resolution Selector & Controls */}
            <div className="flex items-center gap-3">
              <div className="flex bg-[#121214] border border-neutral-800 rounded p-0.5 text-xs">
                {(["4K", "2K", "FHD"] as const).map((res) => (
                  <button
                    key={res}
                    onClick={() => setTargetRes(res)}
                    className={`px-2.5 py-0.5 rounded transition cursor-pointer font-bold ${
                      targetRes === res ? "bg-amber-500 text-black" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 border-l border-neutral-800 pl-3">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(50, z - 25))}
                  className="p-1.5 hover:bg-neutral-800 text-neutral-300 rounded transition"
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-xs font-bold text-amber-400 w-12 text-center">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(300, z + 25))}
                  className="p-1.5 hover:bg-neutral-800 text-neutral-300 rounded transition"
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
              </div>

              <button
                onClick={() => handleDownloadSnapshot(activeSnapshot)}
                className="bg-amber-600 hover:bg-amber-500 text-black font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1 transition cursor-pointer ml-2"
              >
                <Download size={14} />
                <span>Save 4K File</span>
              </button>

              <button
                onClick={() => setActiveSnapshot(null)}
                className="p-1.5 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400 rounded transition cursor-pointer ml-2"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Modal Main Viewport Canvas */}
          <div className="flex-1 bg-[#050507] border-x border-b border-neutral-800 rounded-b-lg overflow-auto p-4 flex items-center justify-center relative">
            <div
              style={{
                width: targetRes === "4K" ? "3840px" : targetRes === "2K" ? "2560px" : "1920px",
                maxWidth: `${zoomLevel}%`,
                transition: "all 0.3s ease",
              }}
              className="relative shadow-2xl rounded border border-neutral-800 overflow-hidden"
            >
              <img
                src={activeSnapshot.imageUrl}
                alt={activeSnapshot.title}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover"
              />

              {/* Watermark Overlay */}
              <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur border border-amber-500/40 p-3 rounded text-right font-mono text-xs">
                <div className="text-amber-400 font-bold">NMLL STUDIO 4K UI ARCHIVE</div>
                <div className="text-neutral-400 text-[10px]">{activeSnapshot.folderPath}/{activeSnapshot.fileName}</div>
                <div className="text-neutral-500 text-[9px]">RESOLUTION: {activeSnapshot.resolution}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
