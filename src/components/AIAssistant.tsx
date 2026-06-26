import React, { useState } from "react";
import {
  Sparkles,
  Send,
  HelpCircle,
  FileText,
  Terminal,
  RefreshCw,
  Cpu,
  User,
  CheckCircle,
} from "lucide-react";

interface Agent {
  id: "copilot" | "scientist" | "engineer" | "researcher" | "analyst";
  name: string;
  roleTitle: string;
  description: string;
  avatarColor: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  agentId: Agent["id"];
}

interface AIAssistantProps {
  logMessage: (msg: string, type?: "info" | "success" | "error" | "system") => void;
  fileContext: string;
}

export default function AIAssistant({ logMessage, fileContext }: AIAssistantProps) {
  const agentsList: Agent[] = [
    { id: "copilot", name: "Lead Copilot", roleTitle: "ML Coding Architect", description: "Generates PyTorch classes, scikit-learn training configs, and clean modular code arrays.", avatarColor: "bg-amber-500 shadow-amber-950/40" },
    { id: "scientist", name: "EDA Scientist", roleTitle: "Statistical Explorer", description: "Analyzes dataset values, computes missing value distributions, and checks correlations.", avatarColor: "bg-emerald-500 shadow-emerald-950/40" },
    { id: "engineer", name: "MLOps Architect", roleTitle: "Operations Engineer", description: "Configures FastAPI pipelines, Docker images, and scales Celery cluster deployment.", avatarColor: "bg-orange-500 shadow-orange-950/40" },
    { id: "researcher", name: "Research Assistant", roleTitle: "Neural Formulator", description: "Explains loss theories (AdamW, optimizers) and visualizes custom state tensors.", avatarColor: "bg-rose-500 shadow-rose-955/40" },
    { id: "analyst", name: "Project Analyst", roleTitle: "Quality Evaluator", description: "Audits validation anomalies, analyzes metrics lineage, and checks SaaS readiness.", avatarColor: "bg-yellow-500 shadow-yellow-950/40" },
  ];

  const [activeAgentId, setActiveAgentId] = useState<Agent["id"]>("copilot");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init_msg",
      role: "assistant",
      text: "Developer connection established. Select your agent buddy above, context files loaded! Tell me: Why accuracy dropped, how to scale, or how to clean cholesterol data?",
      agentId: "copilot",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim() || loadingResponse) return;

    const userMsg: Message = {
      id: `msg_usr_${Date.now()}`,
      role: "user",
      text: inputText,
      agentId: activeAgentId,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoadingResponse(true);
    logMessage(`Interfacing Agent [${activeAgentId}] with queries: "${inputText}"`, "info");

    try {
      const response = await fetch("/api/gemini/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          agentRole: activeAgentId,
          fileContext: fileContext,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: Message = {
          id: `msg_asst_${Date.now()}`,
          role: "assistant",
          text: data.text,
          agentId: activeAgentId,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        logMessage(`Agent [${activeAgentId}] returned context solutions.`, "success");
      }
    } catch {
      // Fallback assistant text to prevent breaking if key fails
      const fallbacks = {
        copilot: "```python\n# PyTorch cardio prediction head\nimport torch.nn as nn\nclass CardioClassifier(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.layers = nn.Sequential(\n            nn.Linear(3, 16),\n            nn.ReLU(),\n            nn.Linear(16, 1),\n            nn.Sigmoid()\n        )\n```",
        scientist: "Regarding cholesterol features, standard imputation using the dataset median is advised. I also identified standard scaling as healthy parameter normalize steps.",
        engineer: "Docker microservices outline constructed: check the production/docker-compose.yml file. Port 8000 processes active FastAPI endpoints, while Celery triggers worker runs.",
        researcher: "AdamW incorporates weight decay directly rather than blending it inside gradients, stabilizing loss convergence across high-parameter states.",
        analyst: "Classifier report: Heart disease telemetry logs show healthy scores (89%). Ensure Type II errors (FN=15) are evaluated via thresholds to prevent omission risk.",
      };

      const fallbackMsg: Message = {
        id: `msg_asst_${Date.now()}`,
        role: "assistant",
        text: `${fallbacks[activeAgentId] || "State parsed securely."}\n\n*(FALLBACK CAPABILITY: Server-side Gemini connection offline or API key omitted)*`,
        agentId: activeAgentId,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoadingResponse(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "msg_init",
        role: "assistant",
        text: `Consultation refreshed. I am ready to advise as the primary NMLL ${agentsList.find((a) => a.id === activeAgentId)?.roleTitle}.`,
        agentId: activeAgentId,
      },
    ]);
  };

  const handleQuickPromptClick = (p: string) => {
    setInputText(p);
  };

  const getAgentDetails = () => agentsList.find((a) => a.id === activeAgentId)!;

  return (
    <div id="ai-assistant-panel" className="flex-1 flex flex-col bg-[#0c0c0e] text-neutral-300 h-full overflow-hidden font-sans">
      {/* Agent chooser tabs horizontal strip */}
      <div className="flex bg-[#050507] border-b border-neutral-850 p-3 gap-2 shrink-0 overflow-x-auto select-none font-mono">
        {agentsList.map((ag) => {
          const isActive = activeAgentId === ag.id;
          return (
            <button
              id={`agent-tab-${ag.id}`}
              key={ag.id}
              onClick={() => {
                setActiveAgentId(ag.id);
                setMessages((prev) => [
                  ...prev,
                  {
                    id: `agent_intro_${Date.now()}`,
                    role: "assistant",
                    text: `Consultation switched: Speaking with the ${ag.roleTitle} agent now. Let me help you with: "${ag.description.split(",")[0]}"`,
                    agentId: ag.id,
                  },
                ]);
              }}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded border text-xs transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-amber-500/10 border-amber-500 text-amber-500 font-bold"
                  : "bg-[#121214]/50 hover:bg-[#1c1c1f] border-neutral-800 text-neutral-400"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${ag.avatarColor}`} />
              <div className="text-left font-sans">
                <div className="font-bold">{ag.name}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Grid: main chat & active recommendation hints */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left dialog stream */}
        <div className="flex-1 flex flex-col overflow-hidden pb-4">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#050507]/20">
            {messages.map((m) => {
              const agentDetails = agentsList.find((a) => a.id === m.agentId) || agentsList[0];
              const isAssistant = m.role === "assistant";

              return (
                <div key={m.id} className={`flex gap-3 max-w-3xl ${isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow ${
                    isAssistant ? agentDetails.avatarColor + " text-black font-extrabold" : "bg-neutral-800 text-amber-500"
                  }`}>
                    {isAssistant ? agentDetails.name[0] : "D"}
                  </div>
                  <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                    isAssistant
                      ? "bg-[#121214] border-neutral-800/80 text-neutral-100"
                      : "bg-amber-950/20 border-amber-500/20 text-neutral-200"
                  }`}>
                    <div className="font-mono text-[9px] uppercase text-neutral-500 mb-1 flex justify-between gap-4 select-none">
                      <span>{isAssistant ? `${agentDetails.name} • ${agentDetails.roleTitle}` : "Developer Workspace Client"}</span>
                    </div>
                    {m.text.startsWith("```") ? (
                      <pre className="p-2.5 rounded bg-black/50 text-emerald-450 font-mono text-[11px] overflow-x-auto mt-2 select-text whitespace-pre-wrap">
                        <code>{m.text.replace(/```python\n|```/g, "")}</code>
                      </pre>
                    ) : (
                      <p className="font-sans whitespace-pre-line select-text">{m.text}</p>
                    )}
                  </div>
                </div>
              );
            })}
            {loadingResponse && (
              <div className="flex gap-2 items-center text-xs text-neutral-500 font-mono p-2">
                <RefreshCw size={12} className="animate-spin text-amber-500" />
                <span>Interfacing Gemini ML-brain operations...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts Strip */}
          <div className="px-4 py-2 bg-[#050507]/30 flex gap-2 overflow-x-auto text-[11px] font-mono select-none border-t border-neutral-850">
            <button
              onClick={() => handleQuickPromptClick("Why did my classification validation metrics drop during fitting?")}
              className="px-2.5 py-1 rounded bg-[#121214] hover:bg-neutral-800 border border-neutral-800 text-neutral-450 whitespace-nowrap cursor-pointer transition"
            >
              Why metrics dropped?
            </button>
            <button
              onClick={() => handleQuickPromptClick("Suggest a neural PyTorch model code block for cardiovascular dataset classification.")}
              className="px-2.5 py-1 rounded bg-[#121214] hover:bg-neutral-800 border border-neutral-800 text-neutral-450 whitespace-nowrap cursor-pointer transition"
            >
              PyTorch heart classification code?
            </button>
            <button
              onClick={() => handleQuickPromptClick("Explain the production Redis Celery task stack configured in our workspace files.")}
              className="px-2.5 py-1 rounded bg-[#121214] hover:bg-neutral-800 border border-neutral-800 text-neutral-450 whitespace-nowrap cursor-pointer transition"
            >
              Explain Celery microservices?
            </button>
          </div>

          {/* Chat text box input */}
          <div className="px-4 mt-2.5 shrink-0">
            <div className="flex gap-2 p-1 border border-neutral-800 rounded bg-[#121214] focus-within:border-amber-500/70 transition-colors">
              <input
                id="assistant-textbox"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={`Query the active ${getAgentDetails().name} agent...`}
                className="flex-1 bg-transparent p-2 outline-none text-xs text-neutral-200 font-sans"
              />
              <button
                id="assistant-send"
                onClick={sendMessage}
                disabled={loadingResponse}
                className="bg-amber-600 hover:bg-amber-500 p-2 rounded text-black transition-colors cursor-pointer"
                title="Send instruction"
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Right context summary sidebar */}
        <div className="w-60 border-l border-neutral-850 bg-[#050507] p-4 hidden md:block overflow-y-auto shrink-0 select-none">
          <div className="flex items-center gap-1.5 border-b border-neutral-850 pb-2 mb-4">
            <Sparkles size={14} className="text-amber-500" />
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-500">Agent Persona Context</span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-neutral-200 block">{getAgentDetails().name}</span>
              <span className="text-[10px] text-amber-500 font-mono font-bold block uppercase tracking-wider mt-1">{getAgentDetails().roleTitle}</span>
              <p className="text-xs text-neutral-450 leading-relaxed mt-2.5 font-sans">{getAgentDetails().description}</p>
            </div>

            <div className="pt-3 border-t border-neutral-850">
              <span className="text-[9px] font-mono tracking-wider font-bold text-neutral-550 uppercase block mb-1">State Monitoring</span>
              <div className="flex gap-1.5 items-center text-xs text-neutral-400 font-sans leading-normal">
                <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                <span>Monitoring 4 workspace assets in real-time.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
