import React, { useState } from "react";
import {
  Database,
  FileSpreadsheet,
  TrendingDown,
  Activity,
  Plus,
  Upload,
  Sparkles,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

interface DatasetManagerProps {
  onDatasetSelect: (fileContent: string) => void;
  logMessage: (msg: string, type?: "info" | "success" | "error" | "system") => void;
}

export default function DatasetManager({ onDatasetSelect, logMessage }: DatasetManagerProps) {
  const [selectedSample, setSelectedSample] = useState("clinical_telemetry");
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // High quality sample datasets
  const samples = {
    clinical_telemetry: {
      name: "heart_disease_telemetry.csv",
      extension: "csv",
      content: `age,systolic_bp,diastolic_bp,cholesterol,sugar_fasting,history_heart,label
42,120,80,210,95,0,0
56,145,95,245,110,1,1
61,152,88,290,135,1,1
38,110,70,185,82,0,0
49,130,85,220,102,0,0
67,160,105,310,140,1,1
52,135,90,260,118,1,1`,
      health: {
        healthScore: 89,
        description: "Clinical research telemetry records. Excellent cardiovascular diagnostic representations with minimal label unbalance.",
        rowCount: 1024,
        colCount: 7,
        columns: [
          { name: "age", type: "Numeric", missingRatio: 0, outliersCount: 2, statistics: "Mean: 52.4, Min: 32, Max: 78", status: "Healthy", action: "None required" },
          { name: "systolic_bp", type: "Numeric", missingRatio: 0, outliersCount: 1, statistics: "Mean: 131.2, Min: 110, Max: 172", status: "Healthy", action: "None required" },
          { name: "cholesterol", type: "Numeric", missingRatio: 0.04, outliersCount: 3, statistics: "Mean: 241.5, Min: 175, Max: 340", status: "Healthy", action: "None required" },
          { name: "sugar_fasting", type: "Numeric", missingRatio: 0.12, outliersCount: 5, statistics: "Mean: 110.4, Min: 75, Max: 198", status: "Remediation Required", action: "Interpolate missing values (12%) using linear mode" },
        ],
        correlations: [
          { x: "age", y: "systolic_bp", val: 0.65 },
          { x: "age", y: "cholesterol", val: 0.58 },
          { x: "systolic_bp", y: "cholesterol", val: 0.44 },
          { x: "cholesterol", y: "label", val: 0.78 },
          { x: "sugar_fasting", y: "label", val: 0.35 },
        ],
        recommendations: [
          "Target column 'label' exhibits high correlation (r = 0.78) with raw cholesterol. Verify clinical indicators.",
          "Perform standard scaling (z-score) across systolic_bp and cholesterol layers to normalize dynamic weight bounds."
        ]
      }
    },
    ecommerce_behavior: {
      name: "shopping_funnel_signals.json",
      extension: "json",
      content: `[
  {"user_id": 1001, "session_clicks": 14, "item_views": 8, "add_to_cart": 3, "conversion": 1},
  {"user_id": 1002, "session_clicks": 4, "item_views": 2, "add_to_cart": 0, "conversion": 0},
  {"user_id": 1003, "session_clicks": 28, "item_views": 19, "add_to_cart": 7, "conversion": 1},
  {"user_id": 1004, "session_clicks": 9, "item_views": 5, "add_to_cart": 1, "conversion": 0}
]`,
      health: {
        healthScore: 72,
        description: "E-Commerce transactional session behaviors. High class-imbalance vector detected. Overfitting prone on direct conversions.",
        rowCount: 4500,
        colCount: 5,
        columns: [
          { name: "session_clicks", type: "Numeric", missingRatio: 0, outliersCount: 42, statistics: "Mean: 11.2, Max: 140", status: "Healthy", action: "Log-scale highly active users" },
          { name: "item_views", type: "Numeric", missingRatio: 0, outliersCount: 12, statistics: "Mean: 5.6", status: "Healthy", action: "None" },
          { name: "add_to_cart", type: "Numeric", missingRatio: 0.08, outliersCount: 0, statistics: "Mean: 1.2", status: "Healthy", action: "None" },
          { name: "conversion", type: "Binary", missingRatio: 0, outliersCount: 0, statistics: "0: 92%, 1: 8%", status: "Remediation Required", action: "Apply SMOTE resampler to address 92/8 imbalance ratio" },
        ],
        correlations: [
          { x: "session_clicks", y: "item_views", val: 0.88 },
          { x: "session_clicks", y: "add_to_cart", val: 0.72 },
          { x: "add_to_cart", y: "conversion", val: 0.81 },
          { x: "item_views", y: "conversion", val: 0.61 },
        ],
        recommendations: [
          "Apply minority oversampling (SMOTE) to the active conversion field.",
          "Add-to-cart clicks has immediate link to final checkout. Keep feature index during training."
        ]
      }
    }
  };

  const [activeAnalysis, setActiveAnalysis] = useState(samples.clinical_telemetry.health);

  const handleSampleChoice = async (key: keyof typeof samples) => {
    setSelectedSample(key);
    const dataObj = samples[key];
    onDatasetSelect(dataObj.content);
    setAnalyzing(true);
    logMessage(`Loading dataset file: ${dataObj.name}`, "info");

    try {
      const res = await fetch("/api/datasets/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: dataObj.name,
          previewContent: dataObj.content,
          extension: dataObj.extension
        })
      });
      if (res.ok) {
        const json = await res.json();
        setActiveAnalysis(json);
        logMessage(`Profile analysis completed for ${dataObj.name}. Health score: ${json.healthScore}%`, "success");
      }
    } catch {
      setActiveAnalysis(dataObj.health);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      logMessage(`File uploaded: ${file.name}. Reading and analyzing contents...`, "info");
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        onDatasetSelect(content);
        setAnalyzing(true);
        try {
          const ext = file.name.split(".").pop() || "csv";
          const res = await fetch("/api/datasets/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: file.name,
              previewContent: content.slice(0, 500),
              extension: ext
            })
          });
          if (res.ok) {
            const json = await res.json();
            setActiveAnalysis(json);
            logMessage(`Real file analytical profiling completed. Health score evaluated at ${json.healthScore}%`, "success");
          }
        } catch {
          logMessage("Statistical loader error during server-side indexing. Displaying preview metrics.", "error");
        } finally {
          setAnalyzing(false);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div id="dataset-wrangler" className="flex-1 flex flex-col bg-[#0c0c0e] text-neutral-200 overflow-y-auto p-6">
      {/* Page Title Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-850">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-amber-500/10 text-amber-500">
            <Database size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-100 font-sans tracking-tight">Dataset Wrangler & Explorer</h1>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">Statistical analysis, outliers calculation, missing value ratios, and AI health profiling.</p>
          </div>
        </div>

        {/* Dynamic File Upload */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 bg-[#121214] hover:bg-[#1c1c1f] text-sm text-amber-500 border border-neutral-800 px-3 py-1.5 rounded cursor-pointer transition">
            <Upload size={14} />
            <span className="font-sans font-bold text-xs">Upload Dataset CSV</span>
            <input type="file" accept=".csv,.json,.txt" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {/* Primary Panels Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* left Select column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#121214]/80 rounded border border-neutral-800 p-4">
            <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-neutral-450 block mb-3">Preloaded Datasets</span>
            <div className="space-y-2">
              <button
                id="dataset-sample-clinical"
                onClick={() => handleSampleChoice("clinical_telemetry")}
                className={`w-full flex items-center gap-2.5 p-2 rounded text-xs text-left transition cursor-pointer border ${
                  selectedSample === "clinical_telemetry" ? "bg-amber-500/10 text-amber-500 font-bold border-amber-500/35" : "bg-[#09090b]/50 hover:bg-[#121214] text-neutral-300 border-neutral-800"
                }`}
              >
                <FileSpreadsheet size={15} />
                <div className="truncate font-sans">
                  <div className="font-semibold text-xs">Heart disease Telemetry</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">7 Column Features • CSV</div>
                </div>
              </button>
              <button
                id="dataset-sample-ecommerce"
                onClick={() => handleSampleChoice("ecommerce_behavior")}
                className={`w-full flex items-center gap-2.5 p-2 rounded text-xs text-left transition cursor-pointer border ${
                  selectedSample === "ecommerce_behavior" ? "bg-amber-500/10 text-amber-500 font-bold border-amber-500/35" : "bg-[#09090b]/50 hover:bg-[#121214] text-neutral-300 border-neutral-800"
                }`}
              >
                <FileSpreadsheet size={15} />
                <div className="truncate font-sans">
                  <div className="font-semibold text-xs">Shopping Funnel Signals</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">5 Column Features • JSON</div>
                </div>
              </button>
            </div>
            {uploadedFileName && (
              <div className="mt-4 pt-3 border-t border-neutral-800 text-xs">
                <span className="text-neutral-500 font-bold block mb-1">Active uploaded file:</span>
                <span className="text-emerald-400 truncate block font-mono">{uploadedFileName}</span>
              </div>
            )}
          </div>

          {/* Dataset score dashboard */}
          <div className="bg-[#121214]/80 rounded border border-neutral-800 p-4 text-center">
            <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-neutral-450 block mb-3">Overall Health</span>
            {analyzing ? (
              <div className="py-6 flex flex-col items-center justify-center gap-2">
                <Activity size={24} className="text-amber-500 animate-spin" />
                <span className="text-xs text-neutral-500 font-mono">Running statistics...</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative inline-flex items-center justify-center">
                  <div className="text-3xl font-mono font-black text-amber-500 bg-amber-500/10 px-4 py-2 rounded border border-amber-500/20">
                    {activeAnalysis.healthScore}%
                  </div>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed pt-2 px-1 font-sans">
                  {activeAnalysis.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right detailed stats column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Columns Analysis matrix */}
          <div className="bg-[#121214]/80 rounded border border-neutral-800 p-4">
            <h2 className="text-xs uppercase tracking-wider font-mono font-bold text-neutral-300 mb-3 flex items-center gap-1.5">
              <span>Columns & Features Profiling</span>
              {analyzing && <span className="text-[11px] text-amber-500 font-normal lowercase font-sans">(calculating)</span>}
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-500">
                    <th className="py-2.5 font-bold">Feature Name</th>
                    <th className="py-2.5 font-bold">Data Type</th>
                    <th className="py-2.5 font-bold">Missing Ratio</th>
                    <th className="py-2.5 font-bold">Outliers</th>
                    <th className="py-2.5 font-bold">Statistical Metrics</th>
                    <th className="py-2.5 font-bold">Diagnostics</th>
                    <th className="py-2.5 font-bold text-right">Suggested Remediations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1e]">
                  {activeAnalysis.columns.map((col, idx) => (
                    <tr key={idx} className="hover:bg-neutral-900/30 text-neutral-300">
                      <td className="py-3 font-mono font-bold text-amber-500">{col.name}</td>
                      <td className="py-3 text-neutral-400">{col.type}</td>
                      <td className="py-3 font-mono">{col.missingRatio ? `${(col.missingRatio * 100).toFixed(1)}%` : "0%"}</td>
                      <td className="py-3 font-mono text-amber-550">{col.outliersCount || 0}</td>
                      <td className="py-3 text-xs text-neutral-450">{col.statistics}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase font-mono ${
                          col.status === "Healthy" ? "bg-emerald-950/30 text-emerald-400 border border-emerald-500/20" : "bg-yellow-950/30 text-yellow-500 border border-yellow-500/20"
                        }`}>
                          {col.status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium text-neutral-300">{col.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Correlations Heatmap visualization & Recharts Spark Plot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Correlation Heatmap Grid Layout */}
            <div className="bg-[#121214]/80 rounded border border-neutral-800 p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-neutral-300 mb-3 block">Correlation Matrix Map</h3>
                <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#050507] rounded border border-neutral-800">
                  {activeAnalysis.correlations.map((item, idx) => {
                    const absVal = Math.abs(item.val);
                    const opacityClass =
                      absVal > 0.8
                        ? "bg-amber-600 text-black font-bold"
                        : absVal > 0.6
                        ? "bg-amber-700/60 text-white"
                        : absVal > 0.4
                        ? "bg-amber-800/30 text-neutral-200"
                        : "bg-neutral-900 text-neutral-400";

                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded text-center text-[10px] ${opacityClass} flex flex-col justify-center items-center h-14`}
                        title={`Correlation between ${item.x} and ${item.y}`}
                      >
                        <span className="font-mono text-[9px] text-neutral-500 block truncate max-w-full">
                          {item.x} : {item.y}
                        </span>
                        <span className="font-mono mt-1 text-[11px] block">{item.val.toFixed(2)}</span>
                      </div>
                    );
                  })}
                  {activeAnalysis.correlations.length < 8 && (
                    <div className="p-2 rounded text-center text-xs bg-neutral-900/40 border border-dashed border-neutral-800 flex justify-center items-center h-14 text-neutral-600 font-mono">
                      Null Matrix
                    </div>
                  )}
                </div>
              </div>
              <div className="text-[10px] font-mono text-neutral-500 mt-3">
                *Indicators map Pearson coefficient (r) bounds between continuous scalar variables.
              </div>
            </div>

            {/* Feature Distribution chart using Recharts */}
            <div className="bg-[#121214]/80 rounded border border-neutral-800 p-4">
              <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-neutral-300 mb-3 block">Core Feature Distributions</h3>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activeAnalysis.columns}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
                    <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0c0c0e", borderColor: "#1a1a1e" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Bar dataKey="outliersCount" fill="#f59e0b" radius={[2, 2, 0, 0]}>
                      {activeAnalysis.columns.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.status === "Healthy" ? "rgba(245, 158, 11, 0.8)" : "rgb(234, 179, 8)"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-4 mt-2 justify-center text-[10px] font-mono">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-sm" /> Healthy (Normal out bounds)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-yellow-500 rounded-sm" /> Needs Imputation / Resample</span>
              </div>
            </div>
          </div>

          {/* AI recommendations column */}
          <div className="bg-gradient-to-r from-amber-950/10 to-transparent rounded border border-neutral-800 p-4 relative overflow-hidden">
            <div className="absolute right-3 top-3 text-amber-500/5">
              <Sparkles size={52} />
            </div>
            <h3 className="text-xs font-bold font-mono text-amber-500 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
              <Lightbulb size={16} />
              <span>AI Data-Scientist Pipeline Proposals</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-300 font-sans">
              {activeAnalysis.recommendations.map((rec, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-amber-500 font-bold font-mono">❖</span>
                  <span className="leading-relaxed font-sans">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
