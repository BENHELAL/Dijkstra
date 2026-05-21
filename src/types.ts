export type NodeId = string;

export type StepPhase =
  | "intro"
  | "initialize"
  | "select"
  | "explore"
  | "relax-update"
  | "relax-skip"
  | "visit"
  | "final";

export type NodeRole =
  | "start"
  | "destination"
  | "busy"
  | "safe"
  | "router"
  | "hub"
  | "storage"
  | "terrain"
  | "service";

export interface GraphNode {
  id: NodeId;
  x: number;
  y: number;
  label: string;
  shortLabel: string;
  role?: NodeRole;
}

export interface GraphEdge {
  id: string;
  from: NodeId;
  to: NodeId;
  weight: number;
  pathD: string;
  labelX: number;
  labelY: number;
  interpretation: string;
  metadata: Record<string, string>;
}

export interface GraphScenario {
  id: string;
  title: string;
  shortTitle: string;
  domain: string;
  description: string;
  story: string;
  objective: string;
  weightLabel: string;
  nodesMeaning: string;
  edgesMeaning: string;
  weightsMeaning: string;
  realLifeExample: string;
  learningGoal: string;
  telemetryLabels: string[];
  tags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  startNode: NodeId;
  targetNode: NodeId;
  nodes: GraphNode[];
  edges: GraphEdge[];
  learningFocus: string[];
  finalInsight: string;
}

export interface CandidateUpdate {
  edgeId: string;
  from: NodeId;
  to: NodeId;
  previousCost: number;
  candidateCost: number;
  didImprove: boolean;
}

export type CostTable = Record<NodeId, number>;
export type PredecessorTable = Record<NodeId, NodeId | null>;

export interface DijkstraStep {
  id: string;
  phase: StepPhase;
  title: string;
  explanation: string;
  calculation?: string;
  currentNode?: NodeId;
  activeEdgeId?: string;
  updatedNode?: NodeId;
  candidateUpdate?: CandidateUpdate;
  costs: CostTable;
  predecessors: PredecessorTable;
  visited: NodeId[];
  finalPathNodes: NodeId[];
  finalPathEdges: string[];
  finalCost?: number;
  neighborIds: NodeId[];
  selectedReason?: string;
  beginnerExplanation: string;
  predecessorMeaning: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  difficulty: "Core" | "Applied" | "Challenge";
}
