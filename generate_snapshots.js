import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { Resvg } from '@resvg/resvg-js';

const rootDir = process.cwd();
const snapshotsBase = path.join(rootDir, 'public', 'snapshots');

const categories = [
  '01_Core',
  '02_ML_Pipeline',
  '03_Registry',
  '04_Engine',
  '05_Diagnostic',
  '06_Ops',
  '07_Addons'
];

// Ensure directories exist
categories.forEach(cat => {
  const dirPath = path.join(snapshotsBase, cat);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

function create4KSVG(title, subtitle, badgeText, contentBlocks) {
  const safeTitle = (title || '').replace(/&/g, '&amp;');
  const safeSubtitle = (subtitle || '').replace(/&/g, '&amp;');
  const safeBadge = (badgeText || '').replace(/&/g, '&amp;');
  const safeBlocks = (contentBlocks || '').replace(/&/g, '&amp;');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3840 2160" width="3840" height="2160" style="background:#0a0a0c; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c0c0e" />
      <stop offset="50%" stop-color="#050507" />
      <stop offset="100%" stop-color="#121216" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1c1c22" stroke-width="1.5" opacity="0.6"/>
    </pattern>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="3840" height="2160" fill="url(#bgGrad)" />
  <rect width="3840" height="2160" fill="url(#grid)" />

  <!-- Top App Navigation Header -->
  <rect x="0" y="0" width="3840" height="120" fill="#050507" stroke="#1a1a20" stroke-width="2" />
  
  <!-- Logo & Title -->
  <rect x="60" y="30" width="60" height="60" rx="12" fill="url(#goldGrad)" filter="url(#glow)" />
  <text x="80" y="72" fill="#000000" font-weight="900" font-size="36" font-family="monospace">N</text>
  <text x="145" y="62" fill="#ffffff" font-weight="800" font-size="34" letter-spacing="1">NEURA ML CORE</text>
  <text x="145" y="90" fill="#f59e0b" font-weight="700" font-size="18" font-family="monospace">STUDIO 4K UHD ENVIRONMENT • ${safeBadge}</text>

  <!-- Status Badges Right -->
  <rect x="3300" y="38" width="220" height="44" rx="8" fill="#121214" stroke="#f59e0b" stroke-width="2" />
  <circle cx="3330" cy="60" r="8" fill="#10b981" />
  <text x="3350" y="66" fill="#f59e0b" font-weight="700" font-size="18" font-family="monospace">3840x2160 UHD</text>

  <rect x="3540" y="38" width="240" height="44" rx="8" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-width="2" />
  <text x="3565" y="66" fill="#34d399" font-weight="700" font-size="18" font-family="monospace">CUDA CLUSTER: ACTIVE</text>

  <!-- Sidebar Column Mock -->
  <rect x="0" y="120" width="320" height="2040" fill="#08080a" stroke="#1c1c22" stroke-width="2" />
  <text x="40" y="170" fill="#6b7280" font-weight="700" font-size="16" font-family="monospace">CATEGORIES MENU</text>

  <!-- Active Tab Highlight -->
  <rect x="20" y="200" width="280" height="60" rx="10" fill="#f59e0b" fill-opacity="0.12" stroke="#f59e0b" stroke-width="2" />
  <text x="50" y="238" fill="#fbbf24" font-weight="800" font-size="20">▶ ${safeTitle}</text>

  <!-- Secondary Menu Items -->
  <text x="50" y="310" fill="#9ca3af" font-size="18">📊 Dataset Profiler</text>
  <text x="50" y="380" fill="#9ca3af" font-size="18">📓 Jupyter Notebooks</text>
  <text x="50" y="450" fill="#9ca3af" font-size="18">⚡ Visual ML Graph</text>
  <text x="50" y="520" fill="#9ca3af" font-size="18">🧠 Model Registry</text>
  <text x="50" y="590" fill="#9ca3af" font-size="18">🔥 Training Console</text>
  <text x="50" y="660" fill="#9ca3af" font-size="18">🎯 SHAP Explainability</text>
  <text x="50" y="730" fill="#9ca3af" font-size="18">🚀 Dynamic Deployment</text>
  <text x="50" y="800" fill="#9ca3af" font-size="18">🤖 Multi-Agent Copilot</text>

  <!-- Main Canvas Content Area -->
  <rect x="360" y="160" width="3420" height="1940" rx="16" fill="#0e0e11" stroke="#26262e" stroke-width="2" />

  <!-- Title Banner -->
  <text x="420" y="230" fill="#ffffff" font-weight="900" font-size="44" letter-spacing="-0.5">${safeTitle}</text>
  <text x="420" y="275" fill="#a1a1aa" font-weight="500" font-size="22">${safeSubtitle}</text>

  <!-- Dynamic Content Graphics -->
  ${safeBlocks}

  <!-- Watermark Stamp -->
  <rect x="3200" y="2020" width="550" height="60" rx="8" fill="#050507" stroke="#f59e0b" stroke-width="1.5" />
  <text x="3220" y="2058" fill="#f59e0b" font-weight="800" font-size="18" font-family="monospace">NEURA ML STUDIO 4K SNAPSHOT • VERIFIED</text>
</svg>`;
}

// Generate 14 custom 4K SVG UI snapshots
const snapshotFiles = [
  {
    path: '01_Core/core_home_base_dashboard_4k.svg',
    title: 'Core Home Base Dashboard',
    sub: 'Neura Machine Learning Core - System Memory Q&A & Vector Search Metrics',
    badge: 'CATEGORY: 01_CORE',
    blocks: `
      <!-- Metric Cards -->
      <g transform="translate(420, 320)">
        <rect width="780" height="220" rx="12" fill="#141418" stroke="#3f3f46" stroke-width="2" />
        <text x="40" y="60" fill="#a1a1aa" font-size="20" font-weight="700">SEMANTIC VECTOR EMBEDDINGS</text>
        <text x="40" y="130" fill="#f59e0b" font-size="56" font-weight="900" font-family="monospace">1,024,800</text>
        <text x="40" y="180" fill="#10b981" font-size="18" font-weight="700">▲ +12.4% indexed vectors today</text>
      </g>
      <g transform="translate(1240, 320)">
        <rect width="780" height="220" rx="12" fill="#141418" stroke="#3f3f46" stroke-width="2" />
        <text x="40" y="60" fill="#a1a1aa" font-size="20" font-weight="700">CUDA GPU CLUSTER UTILIZATION</text>
        <text x="40" y="130" fill="#10b981" font-size="56" font-weight="900" font-family="monospace">94.8%</text>
        <text x="40" y="180" fill="#a1a1aa" font-size="18">8x NVIDIA H100 SXM5 Online</text>
      </g>
      <g transform="translate(2060, 320)">
        <rect width="780" height="220" rx="12" fill="#141418" stroke="#3f3f46" stroke-width="2" />
        <text x="40" y="60" fill="#a1a1aa" font-size="20" font-weight="700">ACTIVE EXPERIMENTS</text>
        <text x="40" y="130" fill="#3b82f6" font-size="56" font-weight="900" font-family="monospace">42 RUNS</text>
        <text x="40" y="180" fill="#10b981" font-size="18" font-weight="700">✓ 99.4% Loss Convergence</text>
      </g>
      <g transform="translate(2880, 320)">
        <rect width="860" height="220" rx="12" fill="#141418" stroke="#3f3f46" stroke-width="2" />
        <text x="40" y="60" fill="#a1a1aa" font-size="20" font-weight="700">MODEL INFERENCE LATENCY</text>
        <text x="40" y="130" fill="#ec4899" font-size="56" font-weight="900" font-family="monospace">4.2 ms</text>
        <text x="40" y="180" fill="#10b981" font-size="18" font-weight="700">⚡ ONNX Runtime Optimized</text>
      </g>

      <!-- Main Chart Container -->
      <g transform="translate(420, 580)">
        <rect width="2420" height="1200" rx="16" fill="#121216" stroke="#27272a" stroke-width="2" />
        <text x="50" y="80" fill="#ffffff" font-size="28" font-weight="800">Vector Lineage & Memory Query Activity (24h)</text>
        <path d="M 100 1000 Q 500 400 900 700 T 1700 300 T 2300 500" fill="none" stroke="#f59e0b" stroke-width="8" filter="url(#glow)" />
        <path d="M 100 1000 Q 500 600 900 850 T 1700 500 T 2300 750" fill="none" stroke="#10b981" stroke-width="6" stroke-dasharray="12 12" />
      </g>

      <!-- Memory Search Sidebar Panel -->
      <g transform="translate(2880, 580)">
        <rect width="860" height="1200" rx="16" fill="#121216" stroke="#27272a" stroke-width="2" />
        <text x="40" y="80" fill="#ffffff" font-size="28" font-weight="800">Project Semantic Search</text>
        <rect x="40" y="120" width="780" height="70" rx="10" fill="#09090b" stroke="#3f3f46" stroke-width="2" />
        <text x="70" y="165" fill="#f59e0b" font-size="22" font-family="monospace">Search: "heart rate prediction parameters"</text>
      </g>
    `
  },
  {
    path: '01_Core/core_projects_workspace_4k.svg',
    title: 'Core Projects Workspace',
    sub: 'Multi-Project ML Workspace Containers & Asset Management',
    badge: 'CATEGORY: 01_CORE',
    blocks: `
      <!-- Project Grid -->
      <g transform="translate(420, 340)">
        <rect width="1050" height="700" rx="16" fill="#141418" stroke="#f59e0b" stroke-width="3" />
        <text x="50" y="80" fill="#f59e0b" font-size="32" font-weight="900">Cardiovascular Health Predictor</text>
        <text x="50" y="130" fill="#a1a1aa" font-size="22">Scikit-Learn • XGBoost • Heart Telemetry Dataset</text>
        <rect x="50" y="180" width="200" height="40" rx="6" fill="#10b981" fill-opacity="0.2" stroke="#10b981" />
        <text x="70" y="206" fill="#34d399" font-size="18" font-weight="700">STATUS: PRODUCTION</text>
        <text x="50" y="300" fill="#ffffff" font-size="24">Accuracy: 96.54% | Loss: 0.1582</text>
      </g>
      <g transform="translate(1530, 340)">
        <rect width="1050" height="700" rx="16" fill="#141418" stroke="#3f3f46" stroke-width="2" />
        <text x="50" y="80" fill="#ffffff" font-size="32" font-weight="900">Behavioral Anomaly Scanner</text>
        <text x="50" y="130" fill="#a1a1aa" font-size="22">PyTorch v2.1 • DenseNet • Image Embeddings</text>
        <rect x="50" y="180" width="200" height="40" rx="6" fill="#f59e0b" fill-opacity="0.2" stroke="#f59e0b" />
        <text x="70" y="206" fill="#fbbf24" font-size="18" font-weight="700">STATUS: CANDIDATE</text>
        <text x="50" y="300" fill="#ffffff" font-size="24">Accuracy: 94.12% | Loss: 0.2104</text>
      </g>
      <g transform="translate(2640, 340)">
        <rect width="1100" height="700" rx="16" fill="#141418" stroke="#3f3f46" stroke-width="2" />
        <text x="50" y="80" fill="#ffffff" font-size="32" font-weight="900">NLP Clinical Summarizer</text>
        <text x="50" y="130" fill="#a1a1aa" font-size="22">Gemini 3.5 Flash • Vector Store</text>
        <rect x="50" y="180" width="200" height="40" rx="6" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" />
        <text x="70" y="206" fill="#60a5fa" font-size="18" font-weight="700">STATUS: ACTIVE</text>
      </g>
    `
  },
  {
    path: '02_ML_Pipeline/pipeline_dataset_wrangler_4k.svg',
    title: 'Dataset Wrangler & Statistical Profiler',
    sub: 'Clinical Telemetry CSV Inspection & Correlation Analysis',
    badge: 'CATEGORY: 02_ML_PIPELINE',
    blocks: `
      <!-- Table View -->
      <g transform="translate(420, 340)">
        <rect width="3320" height="1440" rx="16" fill="#121216" stroke="#27272a" stroke-width="2" />
        <text x="50" y="80" fill="#ffffff" font-size="28" font-weight="800">Dataset Preview: clinical_telemetry.csv (1024 Rows x 12 Cols)</text>
        
        <!-- Table Header -->
        <rect x="50" y="130" width="3220" height="70" fill="#1a1a20" />
        <text x="80" y="175" fill="#f59e0b" font-weight="800" font-size="22" font-family="monospace">PATIENT_ID</text>
        <text x="400" y="175" fill="#f59e0b" font-weight="800" font-size="22" font-family="monospace">AGE</text>
        <text x="700" y="175" fill="#f59e0b" font-weight="800" font-size="22" font-family="monospace">SYSTOLIC_BP</text>
        <text x="1100" y="175" fill="#f59e0b" font-weight="800" font-size="22" font-family="monospace">CHOLESTEROL</text>
        <text x="1500" y="175" fill="#f59e0b" font-weight="800" font-size="22" font-family="monospace">HEART_RATE</text>
        <text x="1900" y="175" fill="#f59e0b" font-weight="800" font-size="22" font-family="monospace">ECG_SIGNAL</text>
        <text x="2300" y="175" fill="#f59e0b" font-weight="800" font-size="22" font-family="monospace">RISK_LABEL</text>

        <!-- Rows -->
        <text x="80" y="260" fill="#ffffff" font-size="20" font-family="monospace">PT_00104</text>
        <text x="400" y="260" fill="#ffffff" font-size="20" font-family="monospace">52</text>
        <text x="700" y="260" fill="#ffffff" font-size="20" font-family="monospace">135 mmHg</text>
        <text x="1100" y="260" fill="#ffffff" font-size="20" font-family="monospace">255 mg/dL</text>
        <text x="1500" y="260" fill="#ffffff" font-size="20" font-family="monospace">82 bpm</text>
        <text x="1900" y="260" fill="#ffffff" font-size="20" font-family="monospace">Normal Sinus</text>
        <text x="2300" y="260" fill="#10b981" font-size="20" font-weight="800" font-family="monospace">HIGH RISK (1)</text>

        <text x="80" y="340" fill="#ffffff" font-size="20" font-family="monospace">PT_00105</text>
        <text x="400" y="340" fill="#ffffff" font-size="20" font-family="monospace">38</text>
        <text x="700" y="340" fill="#ffffff" font-size="20" font-family="monospace">118 mmHg</text>
        <text x="1100" y="340" fill="#ffffff" font-size="20" font-family="monospace">180 mg/dL</text>
        <text x="1500" y="340" fill="#ffffff" font-size="20" font-family="monospace">68 bpm</text>
        <text x="1900" y="340" fill="#ffffff" font-size="20" font-family="monospace">Normal Sinus</text>
        <text x="2300" y="340" fill="#3b82f6" font-size="20" font-weight="800" font-family="monospace">LOW RISK (0)</text>
      </g>
    `
  },
  {
    path: '02_ML_Pipeline/pipeline_jupyter_notebooks_4k.svg',
    title: 'Interactive Python 3.10 Jupyter Notebook Workspace',
    sub: 'Sandboxed Execution Kernel & Variable State Inspector',
    badge: 'CATEGORY: 02_ML_PIPELINE',
    blocks: `
      <g transform="translate(420, 340)">
        <rect width="2500" height="1440" rx="16" fill="#09090b" stroke="#27272a" stroke-width="2" />
        <text x="50" y="70" fill="#10b981" font-size="22" font-family="monospace">In [1]: import pandas as pd, numpy as np</text>
        <text x="50" y="110" fill="#10b981" font-size="22" font-family="monospace">        df = pd.read_csv('clinical_telemetry.csv')</text>
        <text x="50" y="150" fill="#10b981" font-size="22" font-family="monospace">        print(df.describe())</text>

        <rect x="50" y="190" width="2400" height="280" rx="8" fill="#121216" />
        <text x="80" y="240" fill="#a1a1aa" font-size="18" font-family="monospace">Out [1]: count=1024, mean_age=52.4, mean_systolic=128.5, mean_cholesterol=215.2</text>

        <text x="50" y="550" fill="#10b981" font-size="22" font-family="monospace">In [2]: from sklearn.ensemble import RandomForestClassifier</text>
        <text x="50" y="590" fill="#10b981" font-size="22" font-family="monospace">        model = RandomForestClassifier(n_estimators=100)</text>
        <text x="50" y="630" fill="#10b981" font-size="22" font-family="monospace">        model.fit(X_train, y_train)</text>
      </g>
      <g transform="translate(2960, 340)">
        <rect width="780" height="1440" rx="16" fill="#121216" stroke="#f59e0b" stroke-width="2" />
        <text x="40" y="70" fill="#f59e0b" font-size="24" font-weight="800">KERNEL VARIABLES</text>
        <text x="40" y="130" fill="#ffffff" font-size="20" font-family="monospace">df: DataFrame (1024, 12)</text>
        <text x="40" y="190" fill="#ffffff" font-size="20" font-family="monospace">X_train: ndarray (819, 10)</text>
        <text x="40" y="250" fill="#ffffff" font-size="20" font-family="monospace">model: RandomForest (fit)</text>
      </g>
    `
  },
  {
    path: '02_ML_Pipeline/pipeline_visual_graph_4k.svg',
    title: 'Visual Drag & Drop ML Graph Optimizer',
    sub: 'Bezier Flow Connections & Automated Graph Compiler',
    badge: 'CATEGORY: 02_ML_PIPELINE',
    blocks: `
      <!-- Graph Canvas -->
      <g transform="translate(420, 340)">
        <rect width="3320" height="1440" rx="16" fill="#060608" stroke="#f59e0b" stroke-width="2" />
        
        <!-- Node 1 -->
        <rect x="200" y="300" width="400" height="200" rx="12" fill="#121216" stroke="#f59e0b" stroke-width="3" />
        <text x="240" y="360" fill="#f59e0b" font-size="24" font-weight="800">S3 Clinical CSV</text>
        <text x="240" y="410" fill="#a1a1aa" font-size="18">DataSource Node</text>

        <!-- Node 2 -->
        <rect x="900" y="300" width="400" height="200" rx="12" fill="#121216" stroke="#10b981" stroke-width="3" />
        <text x="940" y="360" fill="#10b981" font-size="24" font-weight="800">Median Imputer</text>
        <text x="940" y="410" fill="#a1a1aa" font-size="18">Cleaner Node</text>

        <!-- Node 3 -->
        <rect x="1600" y="300" width="400" height="200" rx="12" fill="#121216" stroke="#3b82f6" stroke-width="3" />
        <text x="1640" y="360" fill="#3b82f6" font-size="24" font-weight="800">Random Forest</text>
        <text x="1640" y="410" fill="#a1a1aa" font-size="18">Model Head Node</text>

        <!-- Bezier Wires -->
        <path d="M 600 400 C 750 400, 750 400, 900 400" fill="none" stroke="#f59e0b" stroke-width="6" />
        <path d="M 1300 400 C 1450 400, 1450 400, 1600 400" fill="none" stroke="#10b981" stroke-width="6" />
      </g>
    `
  },
  {
    path: '03_Registry/registry_model_packages_4k.svg',
    title: 'Enterprise Model Registry & Tester',
    sub: 'Model Version Lineage, Accuracy Auditing & Live Patient Risk Predictor',
    badge: 'CATEGORY: 03_REGISTRY',
    blocks: `
      <g transform="translate(420, 340)">
        <rect width="2200" height="1440" rx="16" fill="#121216" stroke="#27272a" stroke-width="2" />
        <text x="50" y="80" fill="#ffffff" font-size="28" font-weight="800">REGISTERED MODEL PACKAGES</text>
        
        <rect x="50" y="140" width="2100" height="180" rx="10" fill="#1a1a20" stroke="#10b981" stroke-width="2" />
        <text x="80" y="210" fill="#f59e0b" font-size="26" font-weight="900" font-family="monospace">Ensemble_RandomForest_HeartRate</text>
        <text x="80" y="260" fill="#10b981" font-size="20" font-weight="700">v2.1.0-prod | Accuracy: 96.54% | Loss: 0.1582 | Framework: Scikit-Learn</text>

        <rect x="50" y="350" width="2100" height="180" rx="10" fill="#1a1a20" stroke="#f59e0b" stroke-width="2" />
        <text x="80" y="420" fill="#f59e0b" font-size="26" font-weight="900" font-family="monospace">XGBoost_Gradient_Booster</text>
        <text x="80" y="470" fill="#f59e0b" font-size="20" font-weight="700">v1.4.2-candidate | Accuracy: 94.12% | Loss: 0.2104 | Framework: XGBoost</text>
      </g>

      <!-- Predictor Tester -->
      <g transform="translate(2660, 340)">
        <rect width="1080" height="1440" rx="16" fill="#121216" stroke="#f59e0b" stroke-width="2" />
        <text x="50" y="80" fill="#f59e0b" font-size="28" font-weight="800">PATIENT RISK TESTER</text>
        <text x="50" y="160" fill="#ffffff" font-size="22">Age: 52 yrs</text>
        <text x="50" y="240" fill="#ffffff" font-size="22">Systolic BP: 135 mmHg</text>
        <text x="50" y="320" fill="#ffffff" font-size="22">Serum Cholesterol: 255 mg/dL</text>
        
        <rect x="50" y="420" width="980" height="160" rx="12" fill="#ef4444" fill-opacity="0.2" stroke="#ef4444" stroke-width="2" />
        <text x="90" y="490" fill="#f87171" font-size="36" font-weight="900" font-family="monospace">RISK PROBABILITY: 84.52%</text>
        <text x="90" y="540" fill="#f87171" font-size="20">🚨 Critical cardiovascular probability flag.</text>
      </g>
    `
  },
  {
    path: '04_Engine/engine_live_train_console_4k.svg',
    title: 'Live Model Training Console',
    sub: 'Real-Time Epoch Loss Convergence Curves & Hyperparameter Tuning Knobs',
    badge: 'CATEGORY: 04_ENGINE',
    blocks: `
      <g transform="translate(420, 340)">
        <rect width="2200" height="1440" rx="16" fill="#121216" stroke="#27272a" stroke-width="2" />
        <text x="50" y="80" fill="#ffffff" font-size="28" font-weight="800">EPOCH CONVERGENCE (Loss vs Accuracy)</text>
        <path d="M 100 1100 Q 500 800 1000 400 T 2000 200" fill="none" stroke="#10b981" stroke-width="8" />
        <path d="M 100 200 Q 500 500 1000 900 T 2000 1100" fill="none" stroke="#ef4444" stroke-width="8" />
      </g>
      <g transform="translate(2660, 340)">
        <rect width="1080" height="1440" rx="16" fill="#121216" stroke="#f59e0b" stroke-width="2" />
        <text x="50" y="80" fill="#f59e0b" font-size="28" font-weight="800">HYPERPARAMETERS</text>
        <text x="50" y="160" fill="#ffffff" font-size="22">Epochs: 100</text>
        <text x="50" y="240" fill="#ffffff" font-size="22">Learning Rate: 0.001</text>
        <text x="50" y="320" fill="#ffffff" font-size="22">Batch Size: 64</text>
        <text x="50" y="400" fill="#ffffff" font-size="22">Optimizer: AdamW</text>
      </g>
    `
  },
  {
    path: '04_Engine/engine_experiment_matrix_4k.svg',
    title: 'MLflow-Compatible Experiment Matrix',
    sub: 'Cross-Experiment Run Comparisons & Parameter Lineage',
    badge: 'CATEGORY: 04_ENGINE',
    blocks: `
      <g transform="translate(420, 340)">
        <rect width="3320" height="1440" rx="16" fill="#121216" stroke="#27272a" stroke-width="2" />
        <text x="50" y="80" fill="#ffffff" font-size="28" font-weight="800">EXPERIMENT MATRIX TRACKING</text>
        <rect x="50" y="140" width="3220" height="80" fill="#1a1a20" />
        <text x="80" y="190" fill="#f59e0b" font-size="22" font-family="monospace">RUN_ID | MODEL | LR | BATCH | ACCURACY | LOSS | STATUS</text>
        <text x="80" y="280" fill="#ffffff" font-size="20" font-family="monospace">run_01 | RandomForest | 0.01 | 32 | 96.54% | 0.1582 | COMPLETED</text>
        <text x="80" y="360" fill="#ffffff" font-size="20" font-family="monospace">run_02 | XGBoost | 0.05 | 64 | 94.12% | 0.2104 | COMPLETED</text>
        <text x="80" y="440" fill="#ffffff" font-size="20" font-family="monospace">run_03 | PyTorch DenseNet | 0.001 | 128 | 82.41% | 0.6124 | ARCHIVED</text>
      </g>
    `
  },
  {
    path: '05_Diagnostic/diagnostic_intelligence_optimizer_4k.svg',
    title: 'Intelligence Optimizer & Health Scoring',
    sub: 'System-Wide Health Scorecards & SaaS Production Readiness',
    badge: 'CATEGORY: 05_DIAGNOSTIC',
    blocks: `
      <g transform="translate(420, 340)">
        <rect width="1600" height="700" rx="16" fill="#121216" stroke="#10b981" stroke-width="3" />
        <text x="60" y="80" fill="#ffffff" font-size="32" font-weight="900">Dataset Health Score</text>
        <text x="60" y="200" fill="#10b981" font-size="120" font-weight="900" font-family="monospace">89%</text>
        <text x="60" y="280" fill="#a1a1aa" font-size="22">✓ Low missing values, clean feature bounds</text>
      </g>
      <g transform="translate(2060, 340)">
        <rect width="1680" height="700" rx="16" fill="#121216" stroke="#f59e0b" stroke-width="3" />
        <text x="60" y="80" fill="#ffffff" font-size="32" font-weight="900">SaaS Deployment Readiness</text>
        <text x="60" y="200" fill="#f59e0b" font-size="120" font-weight="900" font-family="monospace">78%</text>
        <text x="60" y="280" fill="#a1a1aa" font-size="22">⚠️ ONNX compiled target ready, check replica count</text>
      </g>
    `
  },
  {
    path: '05_Diagnostic/diagnostic_explainability_suite_4k.svg',
    title: 'SHAP Explainability & Feature Importance Suite',
    sub: 'Feature Rankings & Local Waterfall Value Breakdown',
    badge: 'CATEGORY: 05_DIAGNOSTIC',
    blocks: `
      <g transform="translate(420, 340)">
        <rect width="3320" height="1440" rx="16" fill="#121216" stroke="#27272a" stroke-width="2" />
        <text x="50" y="80" fill="#ffffff" font-size="28" font-weight="800">SHAP FEATURE IMPORTANCE RANKING</text>

        <!-- Bar 1 -->
        <text x="80" y="180" fill="#ffffff" font-size="22">Serum Cholesterol</text>
        <rect x="400" y="150" width="2200" height="40" rx="6" fill="#f59e0b" />
        <text x="2620" y="180" fill="#f59e0b" font-size="22" font-weight="800">+0.42 SHAP</text>

        <!-- Bar 2 -->
        <text x="80" y="280" fill="#ffffff" font-size="22">Systolic Blood Pressure</text>
        <rect x="400" y="250" width="1800" height="40" rx="6" fill="#10b981" />
        <text x="2220" y="280" fill="#10b981" font-size="22" font-weight="800">+0.31 SHAP</text>

        <!-- Bar 3 -->
        <text x="80" y="380" fill="#ffffff" font-size="22">Age</text>
        <rect x="400" y="350" width="1200" height="40" rx="6" fill="#3b82f6" />
        <text x="1620" y="380" fill="#3b82f6" font-size="22" font-weight="800">+0.18 SHAP</text>
      </g>
    `
  },
  {
    path: '06_Ops/ops_dynamic_deployment_4k.svg',
    title: 'Dynamic MLOps Deployment Target Selector',
    sub: 'FastAPI Docker Microservice Packaging & ONNX Runtime Export',
    badge: 'CATEGORY: 06_OPS',
    blocks: `
      <g transform="translate(420, 340)">
        <rect width="1050" height="700" rx="16" fill="#121216" stroke="#10b981" stroke-width="3" />
        <text x="50" y="80" fill="#10b981" font-size="32" font-weight="900">FastAPI Kubernetes Pod</text>
        <text x="50" y="140" fill="#a1a1aa" font-size="22">Container Image: neura/heart-model:v2.1</text>
        <text x="50" y="220" fill="#ffffff" font-size="24">Replicas: 3 Pods Active</text>
      </g>
      <g transform="translate(1530, 340)">
        <rect width="1050" height="700" rx="16" fill="#121216" stroke="#3b82f6" stroke-width="3" />
        <text x="50" y="80" fill="#3b82f6" font-size="32" font-weight="900">ONNX Runtime Graph</text>
        <text x="50" y="140" fill="#a1a1aa" font-size="22">Target Latency: 4.2ms</text>
      </g>
      <g transform="translate(2640, 340)">
        <rect width="1100" height="700" rx="16" fill="#121216" stroke="#f59e0b" stroke-width="3" />
        <text x="50" y="80" fill="#f59e0b" font-size="32" font-weight="900">HuggingFace Hub Sync</text>
        <text x="50" y="140" fill="#a1a1aa" font-size="22">Repo: wiroxa/cardio-classifier</text>
      </g>
    `
  },
  {
    path: '06_Ops/ops_ai_copilots_4k.svg',
    title: 'Multi-Persona AI Copilots Consultation Suite',
    sub: 'Lead Copilot, EDA Scientist, MLOps Architect, Research Assistant & Analyst',
    badge: 'CATEGORY: 06_OPS',
    blocks: `
      <g transform="translate(420, 340)">
        <rect width="3320" height="1440" rx="16" fill="#050507" stroke="#f59e0b" stroke-width="2" />
        <text x="50" y="80" fill="#f59e0b" font-size="28" font-weight="800">AI COPILOT DIALOGUE STREAM</text>
        <text x="50" y="160" fill="#3b82f6" font-size="22" font-family="monospace">Lead Copilot: Generated PyTorch classification head module for cardiovascular dataset.</text>
        <rect x="50" y="200" width="3200" height="240" rx="10" fill="#121216" />
        <text x="80" y="260" fill="#10b981" font-size="20" font-family="monospace">class CardioClassifier(nn.Module):</text>
        <text x="80" y="300" fill="#10b981" font-size="20" font-family="monospace">    def __init__(self):</text>
        <text x="80" y="340" fill="#10b981" font-size="20" font-family="monospace">        self.layers = nn.Sequential(nn.Linear(3, 16), nn.ReLU(), nn.Linear(16, 1))</text>
      </g>
    `
  },
  {
    path: '07_Addons/addons_wiroxa_marketplace_4k.svg',
    title: 'Wiroxa Marketplace & Extensions Catalog',
    sub: 'Pre-Trained Backbone Templates & Tokenizer Packages',
    badge: 'CATEGORY: 07_ADDONS',
    blocks: `
      <g transform="translate(420, 340)">
        <rect width="1050" height="700" rx="16" fill="#121216" stroke="#f59e0b" stroke-width="2" />
        <text x="50" y="80" fill="#f59e0b" font-size="32" font-weight="900">ResNet Backbone Package</text>
        <text x="50" y="140" fill="#a1a1aa" font-size="22">Pre-trained weights for medical image classification</text>
      </g>
      <g transform="translate(1530, 340)">
        <rect width="1050" height="700" rx="16" fill="#121216" stroke="#10b981" stroke-width="2" />
        <text x="50" y="80" fill="#10b981" font-size="32" font-weight="900">XGBoost Custom Node</text>
        <text x="50" y="140" fill="#a1a1aa" font-size="22">Visual graph optimizer block for gradient boosting</text>
      </g>
      <g transform="translate(2640, 340)">
        <rect width="1100" height="700" rx="16" fill="#121216" stroke="#3b82f6" stroke-width="2" />
        <text x="50" y="80" fill="#3b82f6" font-size="32" font-weight="900">Clinical Tokenizer</text>
        <text x="50" y="140" fill="#a1a1aa" font-size="22">Specialized medical vocabulary embeddings</text>
      </g>
    `
  },
  {
    path: '07_Addons/addons_system_settings_4k.svg',
    title: 'System Settings & Platform Security',
    sub: 'Gemini Model Config, Obsidian Theme & API Secrets Handler',
    badge: 'CATEGORY: 07_ADDONS',
    blocks: `
      <g transform="translate(420, 340)">
        <rect width="3320" height="1440" rx="16" fill="#121216" stroke="#27272a" stroke-width="2" />
        <text x="50" y="80" fill="#ffffff" font-size="28" font-weight="800">SYSTEM SETTINGS & ENVIRONMENT SECRETS</text>
        <text x="50" y="160" fill="#f59e0b" font-size="22">AI Model Target: Gemini 3.5 Flash (Server-Side Proxy Enabled)</text>
        <text x="50" y="240" fill="#10b981" font-size="22">Theme Target: Dark Obsidian (Golden Amber Accents)</text>
        <text x="50" y="320" fill="#3b82f6" font-size="22">Secrets API: Managed via .env.example & Server Configuration</text>
      </g>
    `
  }
];

// Write files & prepare Zip
const zip = new JSZip();

snapshotFiles.forEach(fileObj => {
  const fullPath = path.join(snapshotsBase, fileObj.path);
  const svgContent = create4KSVG(fileObj.title, fileObj.sub, fileObj.badge, fileObj.blocks);
  fs.writeFileSync(fullPath, svgContent, 'utf8');

  // Render REAL binary PNG buffer using Resvg
  const resvg = new Resvg(svgContent, {
    fitTo: {
      mode: 'width',
      value: 1920,
    },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  const pngPath = fullPath.replace(/\.svg$/, '.png');
  fs.writeFileSync(pngPath, pngBuffer);
  console.log(`Generated 4K SVG & Real PNG: ${fileObj.path}`);

  // Add to Zip
  zip.file(fileObj.path, svgContent);
  zip.file(fileObj.path.replace(/\.svg$/, '.png'), pngBuffer);
});

// Also add metadata.json to zip
const metadataPath = path.join(snapshotsBase, 'metadata.json');
if (fs.existsSync(metadataPath)) {
  zip.file('metadata.json', fs.readFileSync(metadataPath, 'utf8'));
}

// Generate ZIP archive file
const zipPath = path.join(snapshotsBase, 'NMLL_Studio_4K_Snapshots.zip');
zip.generateAsync({ type: 'nodebuffer' }).then(content => {
  fs.writeFileSync(zipPath, content);
  console.log(`Generated NMLL_Studio_4K_Snapshots.zip at ${zipPath}`);
});
