import React from "react";
import {
  FolderCode,
  Layers,
  Database,
  PlayCircle,
  Activity,
  GitBranch,
  Brain,
  ShieldCheck,
  Eye,
  Settings,
  HelpCircle,
  TrendingUp,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Terminal,
  Camera,
} from "lucide-react";
import { WorkspaceTab } from "../types";

interface SidebarProps {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  collapsed: boolean;
  setCollapsed: (coll: boolean) => void;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  collapsed,
  setCollapsed,
}: SidebarProps) {
  const navItems = [
    { id: "home" as const, label: "Home Base", icon: Layers, category: "Core" },
    { id: "projects" as const, label: "Projects & Workspace", icon: FolderCode, category: "Core" },
    { id: "datasets" as const, label: "Dataset Wrangler", icon: Database, category: "ML pipeline" },
    { id: "notebooks" as const, label: "Interactive Notebooks", icon: PlayCircle, category: "ML pipeline" },
    { id: "pipelines" as const, label: "Visual pipelines", icon: GitBranch, category: "ML pipeline" },
    { id: "models" as const, label: "Model Registry", icon: Brain, category: "Registry" },
    { id: "training" as const, label: "Live Train Console", icon: Activity, category: "Engine" },
    { id: "experiments" as const, label: "Experiment Matrix", icon: TrendingUp, category: "Engine" },
    { id: "intelligence" as const, label: "Intelligence Optimizer", icon: Sparkles, category: "Diagnostic" },
    { id: "explainability" as const, label: "Explainability Suite", icon: Eye, category: "Diagnostic" },
    { id: "snapshots" as const, label: "4K UI Snapshots", icon: Camera, category: "Diagnostic" },
    { id: "deployment" as const, label: "Dynamic Deploy", icon: ShieldCheck, category: "Ops" },
    { id: "assistant" as const, label: "AI Copilots", icon: HelpCircle, category: "Ops" },
    { id: "marketplace" as const, label: "Wiroxa Marketplace", icon: ShoppingBag, category: "Addons" },
    { id: "settings" as const, label: "Settings", icon: Settings, category: "Addons" },
  ];

  const categories = ["Core", "ML pipeline", "Registry", "Engine", "Diagnostic", "Ops", "Addons"];

  return (
    <div
      id="sidebar-container"
      className={`relative h-full flex flex-col bg-[#09090b] border-r border-[#1a1a1e] text-neutral-400 select-none transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-[#1a1a1e] bg-[#050507]">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-black font-black font-sans shrink-0 shadow-sm shadow-amber-500/20">
            N
          </div>
          {!collapsed && (
            <div className="flex flex-col ml-1">
              <span className="text-sm font-bold text-neutral-100 tracking-tight leading-none">NMLL Studio</span>
              <span className="text-[9px] font-mono text-amber-500 mt-0.5 font-bold tracking-widest uppercase">WIROXA LABS</span>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            id="collapse-sidebar-btn"
            onClick={() => setCollapsed(true)}
            className="p-1 hover:text-white hover:bg-neutral-900 rounded transition text-neutral-500 cursor-pointer"
            title="Collapse Sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Navigation List grouped by categoric actions */}
      <div className="flex-1 overflow-y-auto py-3 space-y-4 scrollbar-thin">
        {categories.map((category) => {
          const items = navItems.filter((i) => i.category === category);
          if (items.length === 0) return null;

          return (
            <div key={category} className="space-y-1">
              {!collapsed && (
                <div className="px-5 text-[9px] uppercase tracking-wider font-mono font-bold text-neutral-500">
                  {category}
                </div>
              )}
              <div className="px-2 space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      id={`sidebar-tab-${item.id}`}
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={`w-full flex items-center h-9 px-3 rounded transition-all group relative cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-amber-500/10 via-amber-500/3 to-transparent text-amber-400 font-medium border-l-2 border-amber-500"
                          : "hover:bg-neutral-900 hover:text-neutral-200"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={`shrink-0 ${
                          isActive ? "text-amber-400" : "text-neutral-400 group-hover:text-amber-400 transition-colors"
                        }`}
                      />
                      {!collapsed ? (
                        <span className="ml-3 text-xs truncate tracking-wide">
                          {item.label}
                        </span>
                      ) : (
                        <div className="absolute left-14 hidden group-hover:block bg-[#09090b] border border-[#1a1a1e] text-neutral-200 text-xs py-1.5 px-3 rounded whitespace-nowrap z-50 shadow-xl font-mono">
                          {item.label}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Collapse Trigger For Minimized Mode */}
      {collapsed && (
        <div className="p-3 border-t border-[#1a1a1e] flex justify-center bg-[#050507]">
          <button
            id="expand-sidebar-btn"
            onClick={() => setCollapsed(false)}
            className="p-1.5 hover:text-white hover:bg-neutral-900 rounded transition text-neutral-500 cursor-pointer"
            title="Expand Sidebar"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Sidebar Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-[#1a1a1e] bg-[#050507] text-[11px] font-mono flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full glow-beacon-emerald" />
            <span className="text-emerald-400 font-bold ml-1">ONLINE(3000)</span>
          </div>
          <div className="text-neutral-600 font-bold">V1.4.0</div>
        </div>
      )}
    </div>
  );
}
