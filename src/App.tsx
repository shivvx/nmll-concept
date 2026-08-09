import React, { useState, useEffect } from "react";
import {
  Layers,
  Sparkles,
  GitBranch,
  Settings,
  HelpCircle,
  TrendingUp,
  Award,
  Clock,
  Cpu,
  Bookmark,
  Activity,
  Maximize,
  Grid,
  ChevronRight,
  Database,
  Search,
  MessageCircle,
  Heart,
  ExternalLink,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import FileExplorer from "./components/FileExplorer";
import PipelineCanvas from "./components/PipelineCanvas";
import DatasetManager from "./components/DatasetManager";
import NotebookPanel from "./components/NotebookPanel";
import ExplainabilityDashboard from "./components/ExplainabilityDashboard";
import ModelRegistry from "./components/ModelRegistry";
import AIAssistant from "./components/AIAssistant";
import TerminalPanel from "./components/TerminalPanel";
import TrainingConsole from "./components/TrainingConsole";
import SnapshotsGallery from "./components/SnapshotsGallery";

// Import secondary view panels
import {
  HomeView,
  ProjectsView,
  ExperimentsView,
  IntelligenceView,
  DeploymentView,
  MarketplaceView,
  SettingsView,
} from "./components/SecondaryViews";

// Types & mock database imports
import { WorkspaceTab, FileItem, PipelineNode, PipelineConnection } from "./types";
import { staticProjectFiles } from "./data/productionArch";

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  
  // Files database state
  const [files, setFiles] = useState<FileItem[]>(staticProjectFiles);
  const [activeFile, setActiveFile] = useState<FileItem | null>(staticProjectFiles[files.length - 1]);
  const [fileTabs, setFileTabs] = useState<FileItem[]>([staticProjectFiles[files.length - 1]]);

  // Pipeline states
  const [nodes, setNodes] = useState<PipelineNode[]>([
    { id: "src_1", name: "S3 Clinical telemetry.csv DataFrame", type: "dataSource", x: 60, y: 180, status: "idle", params: { file_path: "s3://clinical_telemetry.csv" } },
    { id: "cln_2", name: "Outlier Clean Filter", type: "cleaner", x: 280, y: 180, status: "idle", params: { strategy: "z-score", limit: 3 } },
    { id: "mdl_3", name: "XGBoost Hybrid Decision Head", type: "model", x: 500, y: 180, status: "idle", params: { max_depth: 8, n_estimators: 150 } },
  ]);
  const [connections, setConnections] = useState<PipelineConnection[]>([
    { fromId: "src_1", toId: "cln_2" },
    { fromId: "cln_2", toId: "mdl_3" },
  ]);
  const [selectedNode, setSelectedNode] = useState<PipelineNode | null>(null);

  // Chronological system event logging logger
  const [logs, setLogs] = useState<{ text: string; type: "info" | "success" | "error" | "system"; time: string }[]>([]);

  // Local helper to queue messages chronologically
  const logMessage = (text: string, type: "info" | "success" | "error" | "system" = "info") => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { text, type, time }]);
  };

  // Initialize workspace logs
  useEffect(() => {
    logMessage("Neura Machine Learning Lab (NMLL Studio) booting...", "system");
    logMessage("Wiroxa secure SaaS environment connection confirmed.", "success");
    logMessage("Ready. Use Visual Graph Workspace, Dataset Wrangler, or Interactive Neural Notebooks.", "info");
  }, []);

  // Sync edits done in active IDE editor
  const handleEditorContentChange = (val: string) => {
    if (!activeFile) return;
    setFiles((prev) =>
      prev.map((f) => (f.path === activeFile.path ? { ...f, content: val } : f))
    );
    setActiveFile((prev) => (prev ? { ...prev, content: val } : null));
  };

  const handleFileSelect = (target: FileItem) => {
    // If not in projects workspace, jump tab
    setActiveTab("projects");
    setActiveFile(target);
    if (!fileTabs.find((t) => t.path === target.path)) {
      setFileTabs((prev) => [...prev, target]);
    }
  };

  const handleTabClose = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = fileTabs.filter((t) => t.path !== path);
    setFileTabs(filtered);
    if (activeFile?.path === path) {
      setActiveFile(filtered.length > 0 ? filtered[filtered.length - 1] : null);
    }
  };

  const handleAddFile = (name: string, content: string, language: FileItem["language"]) => {
    const path = `/workspace/${name}`;
    const newF: FileItem = { name, path, content, language };
    setFiles((prev) => [...prev, newF]);
    setActiveFile(newF);
    setFileTabs((prev) => [...prev, newF]);
    logMessage(`Instantiated active template script file: ${name}`, "success");
  };

  const handleDeleteFile = (path: string) => {
    setFiles((prev) => prev.filter((f) => f.path !== path));
    setFileTabs((prev) => prev.filter((t) => t.path !== path));
    if (activeFile?.path === path) {
      setActiveFile(null);
    }
    logMessage(`Erased active script file: ${path}`, "info");
  };

  // Render correct workspaces inside our dynamic split workspace arena
  const renderWorkspaceCenter = () => {
    switch (activeTab) {
      case "home":
        return <HomeView logMessage={logMessage} />;
      
      case "projects":
        return (
          <div className="flex-1 flex overflow-hidden h-full">
            {/* Visual File Explorer Column */}
            <FileExplorer
              files={files}
              activeFile={activeFile}
              onFileSelect={setActiveFile}
              onAddFile={handleAddFile}
              onDeleteFile={handleDeleteFile}
            />

            {/* Custom VS-Code Editor Block */}
            <div className="flex-1 flex flex-col bg-[#111317] overflow-hidden h-full">
              {/* Opened file tabs */}
              <div className="flex bg-[#0b0c0f] border-b border-[#1a1e24] overflow-x-auto select-none shrink-0 scrollbar-none">
                {fileTabs.map((t) => {
                  const isActive = activeFile?.path === t.path;
                  return (
                    <div
                      id={`tab-handle-${t.name}`}
                      key={t.path}
                      onClick={() => setActiveFile(t)}
                      className={`flex items-center gap-2 px-3 py-2 border-r border-[#1a1e24] h-9 text-xs transition cursor-pointer shrink-0 font-mono ${
                        isActive ? "bg-[#111317] text-cyan-400 font-bold border-t-2 border-t-cyan-500" : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      <span>{t.name}</span>
                      <button
                        onClick={(e) => handleTabClose(t.path, e)}
                        className="hover:text-rose-400 font-bold p-0.5"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Text editor body */}
              {activeFile ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex h-7 bg-[#14171e]/50 px-3 border-b border-[#21262d] items-center justify-between text-[10px] font-mono text-gray-500">
                    <span>Path: {activeFile.path}</span>
                    <span className="uppercase text-cyan-500">{activeFile.language} Source</span>
                  </div>
                  <textarea
                    id="code-editor-arena"
                    className="flex-1 w-full bg-[#111317] text-orange-100 font-mono text-xs p-5 outline-none resize-none class-scrollbar-dark overflow-y-auto select-text leading-relaxed"
                    value={activeFile.content}
                    onChange={(e) => handleEditorContentChange(e.target.value)}
                  />
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-500">
                  <span className="font-bold text-sm block mb-1">No file context loaded</span>
                  <p className="text-xs">Select options in browser File Explorer tree on the left to start editing scripts.</p>
                </div>
              )}
            </div>
          </div>
        );

      case "datasets":
        return (
          <DatasetManager
            onDatasetSelect={(content) => {
              // Automatically write preview values to clipboard/workspace state
              const updatedFile = files.find((f) => f.name === "dataset.csv");
              if (updatedFile) {
                setFiles((prev) =>
                  prev.map((f) => (f.name === "dataset.csv" ? { ...f, content } : f))
                );
              } else {
                handleAddFile("dataset.csv", content, "markdown");
              }
            }}
            logMessage={logMessage}
          />
        );

      case "notebooks":
        return <NotebookPanel logMessage={logMessage} />;

      case "pipelines":
        return (
          <PipelineCanvas
            nodes={nodes}
            connections={connections}
            setNodes={setNodes}
            setConnections={setConnections}
            onNodeSelect={setSelectedNode}
            selectedNode={selectedNode}
            logMessage={logMessage}
          />
        );

      case "models":
        return <ModelRegistry logMessage={logMessage} />;

      case "training":
        return <TrainingConsole logMessage={logMessage} />;

      case "experiments":
        return <ExperimentsView logMessage={logMessage} />;

      case "intelligence":
        return <IntelligenceView />;

      case "explainability":
        return <ExplainabilityDashboard logMessage={logMessage} />;

      case "deployment":
        return <DeploymentView logMessage={logMessage} />;

      case "assistant":
        return (
          <AIAssistant
            logMessage={logMessage}
            fileContext={files.map((f) => `### FILE: ${f.name}\n${f.content.slice(0, 300)}`).join("\n\n")}
          />
        );

      case "marketplace":
        return <MarketplaceView />;

      case "snapshots":
        return <SnapshotsGallery logMessage={logMessage} onNavigateTab={setActiveTab} />;

      case "settings":
        return <SettingsView />;

      default:
        return <ProjectsView />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#060608] text-neutral-200 overflow-hidden font-sans">
      {/* 1. TOP NAVIGATION LINE */}
      <div className="h-14 bg-[#09090b] border-b border-[#1a1a1e] flex items-center justify-between px-4 shrink-0 select-none">
        
        {/* Left corner identity */}
        <div className="flex items-center gap-2.5">
          <Layers size={18} className="text-amber-500 rotate-12" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-neutral-100 tracking-tight leading-none uppercase">NMLL Studio</span>
            <span className="text-[9px] text-neutral-500 font-mono tracking-wider mt-0.5 uppercase">Wiroxa Neura ML-Gateway</span>
          </div>
        </div>

        {/* Search header container */}
        <div className="hidden md:flex items-center gap-2.5 bg-[#121214] border border-[#212124] px-3 py-1.5 rounded w-80 text-xs text-neutral-500 focus-within:border-amber-500/50 focus-within:text-amber-400 transition-colors">
          <Search size={13} />
          <input
            id="global-search-header"
            type="text"
            placeholder="Search files, parameters, models, logs..."
            className="bg-transparent border-none outline-none w-full text-xs text-neutral-100 font-sans placeholder:text-neutral-600 focus:outline-none"
          />
        </div>

        {/* Right connectivity badges */}
        <div className="flex items-center gap-3 text-xs font-mono">
          {/* Sponsor Button */}
          <button
            onClick={() => setShowSponsorModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold transition-all cursor-pointer shadow-sm"
            title="Sponsor NMLL Studio Web ($1 - $100)"
          >
            <Heart size={13} className="fill-rose-500 text-rose-500 animate-pulse" />
            <span>Sponsor</span>
          </button>

          {/* Platform Authors Credit Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#121214] border border-[#212124] text-[11px]">
            <span className="text-neutral-500">By</span>
            <a href="https://wiroxa.dev" target="_blank" rel="noopener noreferrer" className="text-amber-400 font-bold hover:underline transition-colors">Wiroxa.dev</a>
            <span className="text-neutral-600">,</span>
            <a href="https://shivvx.in" target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold hover:underline transition-colors">Shivvx.in</a>
            <span className="text-neutral-600">&amp;</span>
            <a href="https://github.com/ScientistKalash" target="_blank" rel="noopener noreferrer" className="text-blue-400 font-bold hover:underline transition-colors">ScientistKalash</a>
          </div>

          <div className="flex items-center gap-1 text-amber-500 px-2.5 py-1 rounded bg-amber-500/5 border border-amber-500/10">
            <Cpu size={12} className="text-amber-500" />
            <span className="font-bold tracking-tight">CUDA A100: ONLINE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full glow-beacon-emerald" />
            <span className="text-neutral-400 text-[10px] font-bold">WIROXA SECURE RUNNER</span>
          </div>
        </div>
      </div>

      {/* 2. CORE WORKSPACE COLUMNS SPLIT */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar minimize collapsible */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* Center Main Split block */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main workspace coordinates center */}
          <div className="flex-1 flex overflow-hidden bg-[#0c0c0e] relative p-6 h-full overflow-y-auto select-none">
            {renderWorkspaceCenter()}
          </div>

          {/* Right Parameter/Node Context Inspector panel */}
          {selectedNode && activeTab === "pipelines" && (
            <div className="w-64 border-l border-[#1a1a1e] bg-[#0c0c0e]/95 backdrop-blur p-4 text-xs overflow-y-auto class-scrollbar-dark shrink-0 absolute right-0 top-14 bottom-44 z-40 shadow-2xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-4">
                <span className="font-bold text-amber-400 font-mono uppercase tracking-wider">Node Inspector</span>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-neutral-500 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 font-sans">
                <div>
                  <span className="text-neutral-400 block font-bold">Element ID</span>
                  <span className="font-mono text-neutral-300 block bg-black/40 p-1.5 rounded mt-1">{selectedNode.id}</span>
                </div>

                <div>
                  <span className="text-neutral-400 block font-bold">Module name</span>
                  <input
                    id="node-inspector-name"
                    type="text"
                    value={selectedNode.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setNodes((prev) => prev.map((n) => (n.id === selectedNode.id ? { ...n, name } : n)));
                      setSelectedNode((prev) => (prev ? { ...prev, name } : null));
                    }}
                    className="w-full bg-[#121214] border border-neutral-800 rounded p-1.5 mt-1 text-xs text-neutral-100 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <span className="text-neutral-400 block font-bold mb-1.5">Configure Parameters</span>
                  <div className="space-y-2">
                    {Object.entries(selectedNode.params).map(([key, val]) => (
                      <div key={key}>
                        <span className="font-mono text-[10px] text-neutral-500 uppercase block">{key}</span>
                        <input
                          id={`node-inspector-param-${key}`}
                          type="text"
                          value={String(val)}
                          onChange={(e) => {
                            const params = { ...selectedNode.params, [key]: e.target.value };
                            setNodes((prev) => prev.map((n) => (n.id === selectedNode.id ? { ...n, params } : n)));
                            setSelectedNode((prev) => (prev ? { ...prev, params } : null));
                          }}
                          className="w-full bg-[#121214] border border-neutral-800 rounded p-1.5 mt-0.5 text-xs text-neutral-300 outline-none focus:border-amber-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800 space-y-1">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">Active status</span>
                  <span className="text-emerald-400 font-bold uppercase block">{selectedNode.status}</span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom terminal logs and hardware dashboard coordinates */}
          <TerminalPanel
            logs={logs}
            clearLogs={() => setLogs([])}
            logMessage={logMessage}
          />
        </div>
      </div>

      {/* Interactive Sponsor Modal ($1, $5, $10, $100) */}
      {showSponsorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#0c0c0e] border border-neutral-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <Heart size={20} className="fill-rose-500 text-rose-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                    Sponsor NMLL Studio Web
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Support open-source AI development. Fuel new ML features &amp; server infrastructure.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowSponsorModal(false)}
                className="text-neutral-500 hover:text-neutral-200 text-sm font-mono p-1.5 rounded hover:bg-neutral-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Sponsor Tiers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {/* $1 Tier */}
              <div className="bg-[#121214] border border-neutral-800/80 hover:border-amber-500/50 rounded-lg p-4 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">☕ Supporter</span>
                    <span className="text-lg font-black text-white font-mono">$1 <span className="text-xs text-neutral-500 font-normal">/ mo</span></span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-3">
                    Public Supporter Badge &amp; GitHub profile recognition in community docs.
                  </p>
                </div>
                <a
                  href="https://razorpay.me/@wiroxa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded bg-amber-500/10 group-hover:bg-amber-500 text-amber-400 group-hover:text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Sponsor $1</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* $5 Tier */}
              <div className="bg-[#121214] border border-neutral-800/80 hover:border-emerald-500/50 rounded-lg p-4 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">🍕 Developer Fuel</span>
                    <span className="text-lg font-black text-white font-mono">$5 <span className="text-xs text-neutral-500 font-normal">/ mo</span></span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-3">
                    Name / Logo listed in README + Priority review on feature requests &amp; issues.
                  </p>
                </div>
                <a
                  href="https://razorpay.me/@wiroxa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded bg-emerald-500/10 group-hover:bg-emerald-500 text-emerald-400 group-hover:text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Sponsor $5</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* $10 Tier */}
              <div className="bg-[#121214] border border-neutral-800/80 hover:border-sky-500/50 rounded-lg p-4 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">🚀 Pro Backer</span>
                    <span className="text-lg font-black text-white font-mono">$10 <span className="text-xs text-neutral-500 font-normal">/ mo</span></span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-3">
                    Featured Backer Credit + Early Access to experimental AI Copilot node templates.
                  </p>
                </div>
                <a
                  href="https://razorpay.me/@wiroxa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded bg-sky-500/10 group-hover:bg-sky-500 text-sky-400 group-hover:text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Sponsor $10</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* $100 Tier */}
              <div className="bg-[#121214] border border-rose-500/30 hover:border-rose-500 rounded-lg p-4 transition-all flex flex-col justify-between group relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-rose-500 text-black font-extrabold text-[9px] uppercase px-2 py-0.5 rounded-bl font-mono">
                  VIP Sponsor
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono">👑 Enterprise Sponsor</span>
                    <span className="text-lg font-black text-white font-mono">$100 <span className="text-xs text-neutral-500 font-normal">/ mo</span></span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-3">
                    Prominent Top-Level Logo Placement on website header &amp; README + Dedicated Discord/Email support.
                  </p>
                </div>
                <a
                  href="https://razorpay.me/@wiroxa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded bg-rose-500 text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-400 transition-all shadow-md shadow-rose-500/20"
                >
                  <span>Sponsor $100</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-800 text-xs text-neutral-500">
              <span>Maintained by Wiroxa.dev, Shivvx.in &amp; ScientistKalash</span>
              <a
                href="https://github.com/shivvx/nmll-concept"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white flex items-center gap-1 transition-colors font-mono"
              >
                <span>View on GitHub</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
