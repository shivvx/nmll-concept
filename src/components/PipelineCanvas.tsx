import React, { useState, useRef } from "react";
import {
  GitBranch,
  Play,
  RotateCcw,
  Sparkles,
  Settings,
  Plus,
  Trash2,
  ListFilter,
  CheckCircle,
  Database,
  Cpu,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { PipelineNode, PipelineConnection } from "../types";

interface PipelineCanvasProps {
  nodes: PipelineNode[];
  connections: PipelineConnection[];
  setNodes: React.Dispatch<React.SetStateAction<PipelineNode[]>>;
  setConnections: React.Dispatch<React.SetStateAction<PipelineConnection[]>>;
  onNodeSelect: (node: PipelineNode | null) => void;
  selectedNode: PipelineNode | null;
  logMessage: (msg: string, type?: "info" | "success" | "error" | "system") => void;
}

export default function PipelineCanvas({
  nodes,
  connections,
  setNodes,
  setConnections,
  onNodeSelect,
  selectedNode,
  logMessage,
}: PipelineCanvasProps) {
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Available library items to spawn
  const nodeLibrary = [
    { name: "S3 Clinical CSV", type: "dataSource" as const, params: { file_path: "s3://clinical_telemetry.csv", has_headers: "true" } },
    { name: "Median Imputer", type: "cleaner" as const, params: { strategy: "median", apply_cols: "all_numeric" } },
    { name: "One-Hot Encoder", type: "transformer" as const, params: { encode_categorical: "true", prefix: "cat_" } },
    { name: "Random Forest Classifier", type: "model" as const, params: { n_estimators: 100, max_depth: 12, criterion: "gini" } },
    { name: "K-Fold Splitting Evaluation", type: "trainer" as const, params: { test_split_ratio: 0.2, k_folds: 5 } },
    { name: "FastAPI Kubernetes Router", type: "deployer" as const, params: { target_replica: 3, framework: "ONNX_RUNTIME" } },
  ];

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;
      
      setNodes((prev) =>
        prev.map((n) => (n.id === draggingNodeId ? { ...n, x: Math.max(10, Math.min(x, 1200)), y: Math.max(10, Math.min(y, 600)) } : n))
      );
    }
  };

  const handleNodeMouseDown = (e: React.MouseEvent, node: PipelineNode) => {
    e.stopPropagation();
    onNodeSelect(node);
    setDraggingNodeId(node.id);
    setDragOffset({
      x: e.clientX - e.currentTarget.getBoundingClientRect().left,
      y: e.clientY - e.currentTarget.getBoundingClientRect().top,
    });
  };

  const handleNodeMouseUp = () => {
    setDraggingNodeId(null);
  };

  const spawnNode = (libItem: typeof nodeLibrary[0]) => {
    const id = `${libItem.type}_${Date.now().toString().slice(-4)}`;
    const newNode: PipelineNode = {
      id,
      name: libItem.name,
      type: libItem.type,
      x: Math.round(150 + Math.random() * 200),
      y: Math.round(150 + Math.random() * 150),
      status: "idle",
      params: libItem.params,
    };
    setNodes((prev) => [...prev, newNode]);
    logMessage(`Added Pipeline Module: ${libItem.name} (${id})`, "info");
  };

  const deleteNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setConnections((prev) => prev.filter((c) => c.fromId !== id && c.toId !== id));
    if (selectedNode?.id === id) onNodeSelect(null);
    logMessage(`Removed Pipeline Module Node: ${id}`, "info");
  };

  const handleNodeConnectorClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (!connectingFromId) {
      setConnectingFromId(nodeId);
      logMessage(`Selecting target node to establish connection from ${nodeId}...`, "info");
    } else {
      if (connectingFromId === nodeId) {
        setConnectingFromId(null);
        return;
      }
      // Check duplicated connections
      const dupe = connections.find((c) => c.fromId === connectingFromId && c.toId === nodeId);
      if (dupe) {
        setConnectingFromId(null);
        logMessage(`Pipeline wire connection already configured.`, "error");
        return;
      }
      setConnections((prev) => [...prev, { fromId: connectingFromId, toId: nodeId }]);
      logMessage(`Configured forward ML flow channel: ${connectingFromId} ➔ ${nodeId}`, "success");
      setConnectingFromId(null);
    }
  };

  const clearPipeline = () => {
    setNodes([]);
    setConnections([]);
    onNodeSelect(null);
    logMessage("Pipeline canvas configurations reset.", "info");
  };

  const executePipeline = () => {
    if (nodes.length === 0) {
      logMessage("No nodes active on graph to execute.", "error");
      return;
    }
    setPipelineRunning(true);
    logMessage("Starting Full Pipeline graph evaluation compiler...", "system");

    // Dynamic execution simulation across levels
    let currentDelay = 0;
    nodes.forEach((n, idx) => {
      setTimeout(() => {
        setNodes((prev) => prev.map((node) => (node.id === n.id ? { ...node, status: "running" } : node)));
        logMessage(`Evaluating step ${idx + 1}/${nodes.length}: Running Node ${n.name}`, "info");
      }, currentDelay);

      currentDelay += 1000;

      setTimeout(() => {
        setNodes((prev) => prev.map((node) => (node.id === n.id ? { ...node, status: "success" } : node)));
        logMessage(`Module success: compiled outputs saved for ${n.name}`, "success");
        if (idx === nodes.length - 1) {
          setPipelineRunning(false);
          logMessage("Visual ML Pipeline model compilation finished with exit code 0.", "system");
        }
      }, currentDelay + 800);

      currentDelay += 1000;
    });
  };

  const autoGeneratePipeline = () => {
    clearPipeline();
    const defaults: PipelineNode[] = [
      { id: "src_1", name: "S3 Clinical telemetry.csv DataFrame", type: "dataSource", x: 60, y: 180, status: "idle", params: { file_path: "s3://clinical_telemetry.csv" } },
      { id: "cln_2", name: "Outlier Clean Filter", type: "cleaner", x: 280, y: 180, status: "idle", params: { strategy: "z-score", limit: 3 } },
      { id: "mdl_3", name: "XGBoost Hybrid Decision Head", type: "model", x: 500, y: 180, status: "idle", params: { max_depth: 8, n_estimators: 150 } },
      { id: "eval_4", name: "SHAP Explainability Aggregates", type: "trainer", x: 740, y: 180, status: "idle", params: { k_folds: 5 } },
      { id: "ply_5", name: "FastAPI Kubernetes Pod Router", type: "deployer", x: 980, y: 180, status: "idle", params: { replicas: 3 } },
    ];
    const defaultWires: PipelineConnection[] = [
      { fromId: "src_1", toId: "cln_2" },
      { fromId: "cln_2", toId: "mdl_3" },
      { fromId: "mdl_3", toId: "eval_4" },
      { fromId: "eval_4", toId: "ply_5" },
    ];
    setNodes(defaults);
    setConnections(defaultWires);
    logMessage("Auto Generated pipeline neural flow mapping.", "success");
  };

  // Bezier calculator for connections
  const getBezierPath = (fromNode: PipelineNode, toNode: PipelineNode) => {
    const x1 = fromNode.x + 180; // Node width proxy
    const y1 = fromNode.y + 40;
    const x2 = toNode.x;
    const y2 = toNode.y + 40;
    const midX = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
  };

  const getNodeIcon = (type: PipelineNode["type"]) => {
    switch (type) {
      case "dataSource": return <Database size={15} className="text-amber-500" />;
      case "cleaner": return <ListFilter size={15} className="text-amber-600" />;
      case "transformer": return <RefreshCw size={15} className="text-amber-400" />;
      case "model": return <Cpu size={15} className="text-orange-500" />;
      case "trainer": return <TrendingUp size={15} className="text-yellow-500" />;
      case "deployer": return <CheckCircle size={15} className="text-rose-500" />;
    }
  };

  return (
    <div id="pipeline-workspace" className="flex-1 flex flex-col bg-[#0c0c0e] h-full text-neutral-200">
      {/* Visual Canvas Toolbar */}
      <div className="flex items-center justify-between px-4 h-11 bg-[#050507] border-b border-neutral-850 shrink-0 font-mono">
        <div className="flex items-center gap-2">
          <GitBranch size={16} className="text-amber-500" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-100">Visual Graph Optimizer</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <button
            id="pipeline-generator-btn"
            onClick={autoGeneratePipeline}
            className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 px-2.5 py-1 rounded text-xs transition cursor-pointer font-bold"
          >
            <Sparkles size={13} />
            <span>AI Auto Node Graph</span>
          </button>
          <button
            id="pipeline-exec-btn"
            onClick={executePipeline}
            disabled={pipelineRunning}
            className="flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-black px-3 py-1 rounded text-xs transition cursor-pointer font-bold disabled:opacity-50"
          >
            <Play size={13} fill="currentColor" />
            <span>{pipelineRunning ? "Running..." : "Compile Graph"}</span>
          </button>
          <button
            id="pipeline-reset"
            onClick={clearPipeline}
            className="flex items-center gap-1 bg-[#121214] hover:bg-neutral-800 border border-neutral-800 px-2.5 py-1 rounded text-xs text-neutral-400 transition cursor-pointer font-bold"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Node library spawning side & visual workspace representation */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Node Spawner Sidebar Section */}
        <div className="w-56 bg-[#08080a] border-r border-neutral-850 flex flex-col p-3 overflow-y-auto shrink-0 select-none font-mono">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-450 mb-3 block">ML Module Blocks</span>
          <div className="space-y-2">
            {nodeLibrary.map((libItem) => {
              const Icon = getNodeIcon(libItem.type);
              return (
                <button
                  key={libItem.name}
                  onClick={() => spawnNode(libItem)}
                  className="w-full flex items-center justify-between p-2 rounded bg-[#121214] hover:bg-[#1c1c1f]/80 border border-neutral-800 text-left text-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    {Icon}
                    <span className="font-sans truncate text-neutral-300 block max-w-[120px] text-[11px] font-semibold">{libItem.name}</span>
                  </div>
                  <Plus size={14} className="text-neutral-500 group-hover:text-amber-400" />
                </button>
              );
            })}
          </div>
          <div className="mt-6 border-t border-neutral-850 pt-4 space-y-2.5 text-[11px] font-sans text-neutral-500 leading-normal">
            <span className="font-bold text-neutral-450 block mb-1">Interactive Instruction:</span>
            <p>1. Spawn node modules onto the block arena.</p>
            <p>2. Drag-and-drop elements around to model neural designs.</p>
            <p>3. Dynamic Linkage: Click circular outlet bounds on node nodes sequentially to wire them up.</p>
          </div>
        </div>

        {/* Visual Graph Working Area */}
        <div
          ref={canvasRef}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleNodeMouseUp}
          className="flex-1 bg-[#060608] relative overflow-hidden h-full cursor-grab active:cursor-grabbing select-none"
          style={{
            backgroundImage: "radial-gradient(#1c1c1f 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        >
          {/* Wire layers - SVG Bezier plots */}
          <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 2 L 10 5 L 0 8 z" fill="#f59e0b" />
              </marker>
            </defs>

            {connections.map((wire, idx) => {
              const fromNode = nodes.find((n) => n.id === wire.fromId);
              const toNode = nodes.find((n) => n.id === wire.toId);
              if (!fromNode || !toNode) return null;

              return (
                <g key={idx}>
                  <path
                    d={getBezierPath(fromNode, toNode)}
                    fill="none"
                    stroke="#1a1a1e"
                    strokeWidth="4"
                  />
                  <path
                    d={getBezierPath(fromNode, toNode)}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    className={`${pipelineRunning ? "animate-[dash_2s_linear_infinite]" : ""}`}
                    strokeDasharray={pipelineRunning ? "6, 6" : "0"}
                    markerEnd="url(#arrow)"
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive node elements rendered on coordinates map */}
          {nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const statusColor =
              node.status === "success"
                ? "border-emerald-500 shadow-emerald-950/20"
                : node.status === "running"
                ? "border-amber-500 bg-amber-950/10 shadow-amber-950/20 animate-pulse text-amber-400"
                : node.status === "error"
                ? "border-rose-500 shadow-rose-950/20"
                : "border-neutral-800 bg-[#0c0c0e]";

            return (
              <div
                key={node.id}
                id={`node-id-${node.id}`}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
                style={{ left: node.x, top: node.y }}
                className={`absolute w-44 rounded-lg border-2 shadow-lg transition-shadow p-3 z-25 cursor-move ${statusColor} ${
                  isSelected ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-black" : ""
                }`}
              >
                {/* Connector point handles */}
                <div
                  id={`node-connector-left-${node.id}`}
                  onClick={(e) => handleNodeConnectorClick(e, node.id)}
                  className={`absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border bg-black border-amber-500 cursor-pointer shadow hover:scale-125 transition-transform z-30 ${
                    connectingFromId === node.id ? "bg-red-500" : ""
                  }`}
                  title="Connect flow"
                />
                <div
                  id={`node-connector-right-${node.id}`}
                  onClick={(e) => handleNodeConnectorClick(e, node.id)}
                  className={`absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border bg-black border-amber-500 cursor-pointer shadow hover:scale-125 transition-transform z-30 ${
                    connectingFromId === node.id ? "bg-red-500" : ""
                  }`}
                  title="Connect output flow"
                />

                {/* Node Metadata content */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {getNodeIcon(node.type)}
                    <span className="text-[9px] uppercase font-mono font-bold text-neutral-500 tracking-wider">
                      {node.type}
                    </span>
                  </div>
                  <button
                    id={`delete-node-${node.id}`}
                    onClick={(e) => deleteNode(node.id, e)}
                    className="text-neutral-500 hover:text-rose-455 rounded transition p-0.5"
                    title="Delete block"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <div className="text-[11px] font-bold font-sans leading-relaxed text-neutral-150 line-clamp-2 select-none">
                  {node.name}
                </div>

                {/* State metrics badges */}
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-neutral-850 text-[9px] font-mono font-bold">
                  <span className="text-neutral-550">{node.id}</span>
                  <span
                    className={
                      node.status === "success"
                        ? "text-emerald-400"
                        : node.status === "running"
                        ? "text-amber-500"
                        : "text-neutral-500"
                    }
                  >
                    {node.status.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
