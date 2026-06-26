import React, { useState } from "react";
import {
  Folder,
  FolderOpen,
  FileCode,
  FileSpreadsheet,
  FileText,
  FileJson,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Cpu,
} from "lucide-react";
import { FileItem } from "../types";

interface FileExplorerProps {
  files: FileItem[];
  activeFile: FileItem | null;
  onFileSelect: (file: FileItem) => void;
  onAddFile: (name: string, content: string, lang: FileItem["language"]) => void;
  onDeleteFile: (path: string) => void;
}

export default function FileExplorer({
  files,
  activeFile,
  onFileSelect,
  onAddFile,
  onDeleteFile,
}: FileExplorerProps) {
  // Directory expand/collapse states
  const [expandedDirs, setExpandedDirs] = useState<Record<string, boolean>>({
    root: true,
    workspace: true,
    production: true,
    backend: true,
    kubernetes: true,
  });

  const toggleDir = (dirName: string) => {
    setExpandedDirs((prev) => ({ ...prev, [dirName]: !prev[dirName] }));
  };

  const getFileIcon = (file: FileItem) => {
    switch (file.language) {
      case "python":
        return <FileCode size={13} className="text-amber-550" />;
      case "sql":
        return <FileCode size={13} className="text-amber-600" />;
      case "json":
        return <FileJson size={13} className="text-amber-400" />;
      case "yaml":
        return <FileCode size={13} className="text-orange-500" />;
      case "markdown":
        return <FileText size={13} className="text-neutral-400" />;
      default:
        return <FileText size={13} className="text-neutral-500" />;
    }
  };

  // Group our flattened file list by logical folders
  const getCategorizedFiles = (prefix: string) => {
    return files.filter((f) => f.path.startsWith(prefix));
  };

  return (
    <div id="file-explorer-sidebar" className="w-56 h-full bg-[#08080a] border-r border-[#1a1a1e] flex flex-col text-xs text-neutral-400 shrink-0 select-none">
      {/* File Explorer Header */}
      <div className="flex items-center justify-between px-3 h-10 border-b border-[#1a1a1e] bg-[#050507]">
        <span className="font-mono font-bold uppercase tracking-wider text-neutral-500 text-[9px]">
          Explorer Workspace
        </span>
        <div className="flex items-center gap-1">
          <button
            id="explorer-create-item"
            onClick={() => {
              const name = prompt("Enter new script file name (with extension, e.g. neural.py):");
              if (name) {
                const isPy = name.endsWith(".py");
                const isSql = name.endsWith(".sql");
                onAddFile(
                  name,
                  isPy ? "# Custom python module\n" : isSql ? "-- Custom telemetry query\n" : "{\n}",
                  isPy ? "python" : isSql ? "sql" : "json"
                );
              }
            }}
            className="p-1 hover:text-white rounded hover:bg-neutral-900 transition cursor-pointer"
            title="Create script file"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Directory listing tree scroll */}
      <div className="flex-1 overflow-y-auto py-2 font-mono text-[11px]">
        
        {/* FOLDER 1: Active Workspace Files */}
        <div className="space-y-0.5">
          <button
            onClick={() => toggleDir("workspace")}
            className="w-full flex items-center gap-1 px-2.5 py-1.5 hover:bg-neutral-900/40 hover:text-neutral-200 transition-colors text-left font-bold text-neutral-300"
          >
            {expandedDirs.workspace ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            <Folder size={12} className="text-amber-500 fill-amber-500/10 shrink-0" />
            <span className="truncate">active_workspace/</span>
          </button>

          {expandedDirs.workspace && (
            <div className="pl-6 space-y-0.5">
              {getCategorizedFiles("/workspace").map((file) => {
                const isActive = activeFile?.path === file.path;
                return (
                  <div
                    key={file.path}
                    className="flex items-center justify-between group/item pr-2 rounded hover:bg-neutral-900/30"
                  >
                    <button
                      id={`file-tree-${file.name}`}
                      onClick={() => onFileSelect(file)}
                      className={`flex-1 flex items-center gap-2 py-1 transition-colors text-left cursor-pointer truncate ${
                        isActive ? "text-amber-400 font-bold bg-amber-500/5" : "hover:text-neutral-200 text-neutral-400"
                      }`}
                    >
                      {getFileIcon(file)}
                      <span className="truncate">{file.name}</span>
                    </button>
                    <button
                      onClick={() => onDeleteFile(file.path)}
                      className="hidden group-hover/item:block text-neutral-600 hover:text-rose-450 p-0.5 transition"
                      title="Delete script file"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOLDER 2: Scalable Production microservice templates */}
        <div className="space-y-0.5 mt-2">
          <button
            onClick={() => toggleDir("production")}
            className="w-full flex items-center gap-1 px-2.5 py-1.5 hover:bg-neutral-900/40 hover:text-neutral-200 transition-colors text-left font-bold text-neutral-300"
          >
            {expandedDirs.production ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            <Folder size={12} className="text-amber-600 fill-amber-600/10 shrink-0" />
            <span className="truncate">production_templates/</span>
          </button>

          {expandedDirs.production && (
            <div className="pl-6 space-y-0.5">
              {/* README AND DOCKER-COMPOSE */}
              {getCategorizedFiles("/production").filter(f => !f.path.includes("/backend") && !f.path.includes("/kubernetes")).map((file) => {
                const isActive = activeFile?.path === file.path;
                return (
                  <button
                    key={file.path}
                    id={`file-tree-prod-${file.name}`}
                    onClick={() => onFileSelect(file)}
                    className={`w-full flex items-center gap-2 py-1 transition-colors text-left cursor-pointer truncate rounded hover:bg-neutral-900/30 ${
                      isActive ? "text-amber-500 font-bold bg-amber-500/5" : "hover:text-neutral-200 text-neutral-400"
                    }`}
                  >
                    {getFileIcon(file)}
                    <span className="truncate">{file.name}</span>
                  </button>
                );
              })}

              {/* Subdirectory: Backend FastAPI */}
              <div className="space-y-0.5 mt-1">
                <button
                  onClick={() => toggleDir("backend")}
                  className="w-full flex items-center gap-1.5 py-1 hover:text-neutral-200 transition-colors text-left font-bold text-neutral-400"
                >
                  {expandedDirs.backend ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                  <FolderOpen size={12} className="text-amber-500 shrink-0" />
                  <span>fastapi_gateway/</span>
                </button>
                {expandedDirs.backend && (
                  <div className="pl-4 space-y-0.5">
                    {getCategorizedFiles("/production/backend").map((file) => {
                      const isActive = activeFile?.path === file.path;
                      return (
                        <button
                          key={file.path}
                          id={`file-tree-prod-${file.name}`}
                          onClick={() => onFileSelect(file)}
                          className={`w-full flex items-center gap-2 py-1 transition-colors text-left cursor-pointer truncate rounded hover:bg-neutral-900/30 ${
                            isActive ? "text-amber-500 font-bold bg-amber-500/5" : "hover:text-neutral-200 text-neutral-500"
                          }`}
                        >
                          {getFileIcon(file)}
                          <span className="truncate">{file.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Subdirectory: Kubernetes */}
              <div className="space-y-0.5 mt-1">
                <button
                  onClick={() => toggleDir("kubernetes")}
                  className="w-full flex items-center gap-1.5 py-1 hover:text-neutral-200 transition-colors text-left font-bold text-neutral-400"
                >
                  {expandedDirs.kubernetes ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                  <FolderOpen size={12} className="text-amber-500 shrink-0" />
                  <span>kubernetes_manifests/</span>
                </button>
                {expandedDirs.kubernetes && (
                  <div className="pl-4 space-y-0.5">
                    {getCategorizedFiles("/production/kubernetes").map((file) => {
                      const isActive = activeFile?.path === file.path;
                      return (
                        <button
                          key={file.path}
                          id={`file-tree-prod-${file.name}`}
                          onClick={() => onFileSelect(file)}
                          className={`w-full flex items-center gap-2 py-1 transition-colors text-left cursor-pointer truncate rounded hover:bg-neutral-900/30 ${
                            isActive ? "text-amber-505 font-bold bg-amber-500/5" : "hover:text-neutral-200 text-neutral-500"
                          }`}
                        >
                          {getFileIcon(file)}
                          <span className="truncate">{file.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Production setup prompt summary widget */}
      <div className="p-3 bg-[#050507] border-t border-[#1a1a1e]">
        <div className="flex gap-1.5 items-center font-bold text-[9px] uppercase text-amber-500 mb-1">
          <Cpu size={10} />
          <span>SaaS Scale Engine</span>
        </div>
        <p className="text-[10px] text-neutral-500 leading-normal font-sans">
          Kubernetes pods dynamically spawn Python executors per user sandbox. Open the <code>production_templates</code> directory for FastAPI Helm outlines.
        </p>
      </div>
    </div>
  );
}
