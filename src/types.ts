export type WorkspaceTab =
  | "home"
  | "projects"
  | "datasets"
  | "notebooks"
  | "pipelines"
  | "models"
  | "training"
  | "experiments"
  | "intelligence"
  | "explainability"
  | "deployment"
  | "assistant"
  | "marketplace"
  | "snapshots"
  | "settings";

export interface FileItem {
  name: string;
  path: string;
  content: string;
  language: "python" | "sql" | "json" | "yaml" | "typescript" | "markdown";
  isDir?: boolean;
}

export interface PipelineNode {
  id: string;
  name: string;
  type: "dataSource" | "cleaner" | "transformer" | "model" | "trainer" | "deployer";
  x: number;
  y: number;
  status: "idle" | "running" | "success" | "error";
  params: Record<string, string | number>;
}

export interface PipelineConnection {
  fromId: string;
  toId: string;
}

export interface ModelItem {
  id: string;
  name: string;
  version: string;
  accuracy: number;
  loss: number;
  framework: string;
  status: "active" | "candidate" | "archived";
  parameters: Record<string, string | number>;
}

export interface ExperimentRun {
  id: string;
  name: string;
  status: "COMPLETED" | "RUNNING" | "FAILED" | "PENDING";
  accuracy: number;
  loss: number;
  epochCount: number;
  learningRate: number;
  timestamp: string;
  featuresUsed: string[];
}

export interface AgentSpeaker {
  id: "copilot" | "scientist" | "engineer" | "researcher" | "analyst";
  name: string;
  tagline: string;
  avatarColor: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  agentId: "copilot" | "scientist" | "engineer" | "researcher" | "analyst";
}

export interface ResourceMetrics {
  cpu: number[];
  gpu: number[];
  ram: number[];
  vram: number[];
}
