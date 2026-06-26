import React, { useState } from "react";
import {
  Eye,
  Sliders,
  TrendingUp,
  AlertOctagon,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface ExplainabilityDashboardProps {
  logMessage: (msg: string, type?: "info" | "success" | "error" | "system") => void;
}

export default function ExplainabilityDashboard({ logMessage }: ExplainabilityDashboardProps) {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  // High quality SHAP attribution weights
  const shapData = [
    { feature: "cholesterol_level", shapValue: 0.142, impact: "High increase in risk" },
    { feature: "systolic_bp", shapValue: 0.098, impact: "High increase in risk" },
    { feature: "age_years", shapValue: 0.064, impact: "Moderate risk increase" },
    { feature: "diastolic_p", shapValue: 0.031, impact: "Low risk increase" },
    { feature: "fitness_score", shapValue: -0.114, impact: "Strong protective factor" },
    { feature: "sleep_ratio", shapValue: -0.052, impact: "Low protective factor" },
  ];

  // Confusion matrix coordinates: rows = True Class, columns = Predicted Class
  const matrix = [
    [480, 20], // Row 0 (True Negative): [ TN, FP ]
    [15, 509], // Row 1 (True Positive): [ FN, TP ]
  ];

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
    const cellNames = [
      ["True Negative (Correctly predicted normal/healthy cases)", "False Positive (Type I Error / Incorrect alarm)"],
      ["False Negative (Type II Error / Critical clinical omission)", "True Positive (Correctly identified positive risk cases)"],
    ];
    logMessage(`Checking model performance metric node: ${cellNames[row][col]} = ${matrix[row][col]} samples`, "info");
  };

  return (
    <div id="explainability-workspace" className="flex-1 flex flex-col bg-[#0c0c0e] text-neutral-200 overflow-y-auto p-6">
      {/* Title */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-850">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-amber-500/10 text-amber-500">
            <Eye size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-100 font-sans tracking-tight">Explainability & Diagnostic Explorer</h1>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">Demystify deep models using SHAP feature attributions, ROC statistics, and interactive Confusion Matrices.</p>
          </div>
        </div>
      </div>

      {/* Grid: Confusion Matrix & SHAP values */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Confusion Matrix Card */}
        <div className="bg-[#121214]/80 rounded border border-neutral-800 p-5">
          <h2 className="text-xs uppercase tracking-wider font-mono font-bold text-neutral-300 mb-4 block">Interactive Confusion Matrix</h2>
          <div className="grid grid-cols-3 gap-2 text-center max-w-sm mx-auto font-mono text-xs">
            {/* Headers row */}
            <div />
            <div className="p-2 font-bold text-neutral-500">Pred normal</div>
            <div className="p-2 font-bold text-rose-500/80">Pred risk</div>

            {/* Row 0 */}
            <div className="py-6 font-bold text-neutral-500 flex items-center justify-center">True normal</div>
            <button
              id="cm-tn"
              onClick={() => handleCellClick(0, 0)}
              className={`p-6 border rounded transition-all border-neutral-800 cursor-pointer ${
                selectedCell?.row === 0 && selectedCell?.col === 0
                  ? "bg-emerald-550/20 border-emerald-500 ring-2 ring-emerald-500/30"
                  : "bg-emerald-950/10 text-emerald-400 hover:bg-emerald-950/20"
              }`}
            >
              <div className="text-lg font-bold">{matrix[0][0]}</div>
              <div className="text-[9px] mt-1 uppercase text-neutral-500">TN</div>
            </button>
            <button
              id="cm-fp"
              onClick={() => handleCellClick(0, 1)}
              className={`p-6 border rounded transition-all border-neutral-805 cursor-pointer ${
                selectedCell?.row === 0 && selectedCell?.col === 1
                  ? "bg-rose-500/20 border-rose-500 ring-2 ring-rose-500/30"
                  : "bg-rose-950/10 text-rose-450 hover:bg-rose-955/20"
              }`}
            >
              <div className="text-lg font-bold">{matrix[0][1]}</div>
              <div className="text-[9px] mt-1 uppercase text-neutral-550">FP (I)</div>
            </button>

            {/* Row 1 */}
            <div className="py-6 font-bold text-rose-500/80 flex items-center justify-center">True risk</div>
            <button
              id="cm-fn"
              onClick={() => handleCellClick(1, 0)}
              className={`p-6 border rounded transition-all border-neutral-805 cursor-pointer ${
                selectedCell?.row === 1 && selectedCell?.col === 0
                  ? "bg-yellow-500/20 border-yellow-500 ring-2 ring-yellow-500/30"
                  : "bg-yellow-950/10 text-yellow-500 hover:bg-yellow-955/20"
              }`}
            >
              <div className="text-lg font-bold">{matrix[1][0]}</div>
              <div className="text-[9px] mt-1 uppercase text-neutral-550">FN (II)</div>
            </button>
            <button
              id="cm-tp"
              onClick={() => handleCellClick(1, 1)}
              className={`p-6 border rounded transition-all border-neutral-805 cursor-pointer ${
                selectedCell?.row === 1 && selectedCell?.col === 1
                  ? "bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/30"
                  : "bg-amber-950/10 text-amber-400 hover:bg-amber-955/20"
              }`}
            >
              <div className="text-lg font-bold">{matrix[1][1]}</div>
              <div className="text-[9px] mt-1 uppercase text-neutral-500">TP</div>
            </button>
          </div>

          {/* Cell statistics summary info */}
          <div className="mt-4 p-3 bg-[#09090b] rounded border border-neutral-850 text-xs text-neutral-300 leading-relaxed min-h-[50px] font-sans">
            {selectedCell ? (
              <div>
                <span className="font-bold text-amber-400 block mb-1">Attribution Insight:</span>
                {selectedCell.row === 1 && selectedCell.col === 0 ? (
                  <span className="text-yellow-500">🚨 WARNING: 15 False Negatives represent patients experiencing cardiac anomalies missed by neural models. Minimize Type II rate by decreasing classification threshold limits.</span>
                ) : (
                  <span>Cell selection counts: <strong>{matrix[selectedCell.row][selectedCell.col]}</strong> records evaluated. Metrics are highly stable.</span>
                )}
              </div>
            ) : (
              <span className="text-neutral-500 italic block text-center">Click coordinate cells above to audit classifier attributions.</span>
            )}
          </div>
        </div>

        {/* SHAP Feature attributions chart using Recharts */}
        <div className="bg-[#121214]/80 rounded border border-neutral-800 p-5 font-mono">
          <h2 className="text-xs uppercase tracking-wider font-mono font-bold text-neutral-300 mb-4 block">SHAP Mean Feature Importance</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shapData} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1d1d21" />
                <XAxis type="number" stroke="#666970" fontSize={10} />
                <YAxis dataKey="feature" type="category" stroke="#666970" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0c0c0e", borderColor: "#1a1a1e" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="shapValue" fill="#f59e0b" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[9px] text-neutral-500 text-center font-mono mt-1">
            * Attributions measure mean absolute SHAP attributions (|E[f(x)] - f(x)|) across clinical samples.
          </p>
        </div>
      </div>

      {/* Static explainability summary report info */}
      <div className="bg-gradient-to-r from-amber-950/10 to-transparent border border-neutral-800 rounded p-5">
        <h3 className="text-xs font-bold text-neutral-200 mb-3 flex items-center gap-1.5 font-mono uppercase tracking-wider">
          <Lightbulb size={15} className="text-amber-500" />
          <span>SHAP Attribution Diagnostics & Global Integrity</span>
        </h3>
        <p className="text-xs text-neutral-400 leading-relaxed font-sans">
          The models evaluate <strong>cholesterol_level</strong> as the primary risk factor. Outlying parameters are automatically managed by scaling filters configured at visual node level. To prevent model bias issues, ensure training samples match equivalent demographic categories.
        </p>
      </div>
    </div>
  );
}
