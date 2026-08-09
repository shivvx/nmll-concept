<div align="center">

# ⚡ NMLL Studio Web
### Next-Generation AI-Native Machine Learning & Deep Learning Workspace

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built by Wiroxa.dev](https://img.shields.io/badge/Developed%20By-Wiroxa.dev-6366f1.svg)](https://wiroxa.dev)
[![Co-Created by Shivvx.in](https://img.shields.io/badge/Co--Created%20By-Shivvx.in-10b981.svg)](https://shivvx.in)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg)](https://vitejs.dev/)

*An open-source, desktop-grade, web-native ML studio unifying code editing, Jupyter notebook compilation, visual pipeline canvas, live model training, explainability dashboards, and autonomous AI assistants.*

[Features](#-core-capabilities) • [Quick Start](#-quick-start) • [Architecture](#-architecture--tech-stack) • [Contributing](#-open-source--contributions) • [License](#-license--copyright)

</div>

---

## 🌟 Overview

**NMLL Studio** (*Neura Machine Learning Lab*) is an enterprise-grade AI-native web platform designed for machine learning engineers, data scientists, and AI researchers. It provides a complete, unified environment to build, train, visualize, and deploy machine learning models—right from your browser.

Engineered with high-performance modern web technologies (React 19, TypeScript, Vite, TailwindCSS, Express), NMLL Studio removes the friction between prototyping code, designing complex DAG pipelines, tracking metrics, and auditing explainability.

---

## 🔥 Core Capabilities

| Feature | Description |
| :--- | :--- |
| 💻 **Unified Browser IDE** | Multi-tab code editor with syntax highlighting, file explorer, workspace persistence, and integrated terminal emulation. |
| 📓 **Jupyter Notebook Engine** | Interactive cell execution environment with live Python simulation kernel, markdown rendering, and inline chart visualization. |
| 🔀 **Visual Pipeline Canvas** | Node-based drag-and-drop DAG designer for building data preprocessing, model training, evaluation, and inference workflows. |
| 📊 **Real-time Training Console** | Interactive metric tracking with live epoch updates, loss/accuracy loss curves using Recharts, hyperparameter tuning gauges, and GPU resource monitoring. |
| 📁 **Dataset Manager & EDA** | Upload, preview, filter, and inspect datasets. Automated exploratory data analysis (correlations, class distributions, missing value reports). |
| 🔍 **Explainability Suite** | Integrated SHAP & LIME feature attribution charts, confusion matrices, and model interpretability dashboards. |
| 📦 **Model Registry** | Model versioning, artifact tracking, ONNX/PyTorch export options, and metadata logging. |
| 🤖 **Multi-Agent AI Copilot** | Server-side Gemini AI integration for automated PyTorch/scikit-learn code generation, pipeline optimization, and debugging support. |

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS v4, Lucide Icons, Framer Motion, Recharts
- **Backend API**: Node.js, Express, ESBuild, TSX
- **AI Engine**: `@google/genai` (Gemini API Integration)
- **Deployment**: Docker container ready, Node production bundle (`dist/server.cjs`)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **Gemini API Key** (Get key from [Google AI Studio](https://aistudio.google.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/wiroxa/nmll-studio.git
cd nmll-studio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your credentials:
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
APP_URL="http://localhost:3000"
PORT=3000
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Build & Production Deployment

To generate an optimized production bundle:

```bash
# Build client and server bundles
npm run build

# Start production server
npm run start
```

---

## 📂 Project Structure

```
nmll-studio/
├── src/
│   ├── components/         # Studio modules (IDE, Pipeline, Training, EDA, Explainability, etc.)
│   ├── data/               # Production architecture & default sample configurations
│   ├── App.tsx             # Main layout, tab management, workspace state
│   ├── index.css           # Modern cybernetic theme styling & Tailwind directives
│   └── types.ts            # Type definitions for pipelines, datasets, models, metrics
├── server.ts               # Express API backend & Gemini AI Copilot endpoint
├── index.html              # Core application entry & SEO metadata
├── vite.config.ts          # Vite build configuration
├── package.json            # Scripts & project dependencies
├── CONTRIBUTING.md         # Guidelines for open-source contributors
└── LICENSE                 # Open-source MIT License
```

---

## 🤝 Open Source & Contributions

NMLL Studio is built for the developer community! We welcome contributions of all kinds:
- 🐛 Bug fixes & performance enhancements
- ✨ New pipeline nodes & model architecture templates
- 🎨 UI/UX improvements & dark-mode visual upgrades
- 📖 Documentation & tutorial additions

Please review our **[Contributing Guidelines](CONTRIBUTING.md)** before submitting a Pull Request.

---

## 📄 License & Copyright

Distributed under the **MIT License**. See `LICENSE` for more information.

Copyright (c) 2026 **[Wiroxa.dev](https://wiroxa.dev)** & **[Shivvx.in](https://shivvx.in)**. All rights reserved.

---

<div align="center">

Made with ❤️ by **Wiroxa.dev** & **Shivvx.in**

</div>
