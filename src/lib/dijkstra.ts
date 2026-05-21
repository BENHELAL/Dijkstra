import { edgeId } from "../data/scenarios";
import type {
  CostTable,
  DijkstraStep,
  GraphScenario,
  NodeId,
  PredecessorTable,
  StepPhase
} from "../types";

const formatCost = (value: number) => (value === Infinity ? "inf" : String(value));

const cloneCosts = (costs: CostTable): CostTable => ({ ...costs });
const clonePredecessors = (predecessors: PredecessorTable): PredecessorTable => ({
  ...predecessors
});

const orderedNodeIds = (scenario: GraphScenario) => scenario.nodes.map((node) => node.id);

const initialCosts = (scenario: GraphScenario): CostTable =>
  Object.fromEntries(orderedNodeIds(scenario).map((node) => [node, Infinity])) as CostTable;

const initialPredecessors = (scenario: GraphScenario): PredecessorTable =>
  Object.fromEntries(orderedNodeIds(scenario).map((node) => [node, null])) as PredecessorTable;

const outgoingEdges = (scenario: GraphScenario, node: NodeId) =>
  scenario.edges.filter((edge) => edge.from === node);

interface StepInput {
  phase: StepPhase;
  title: string;
  explanation: string;
  beginnerExplanation: string;
  calculation?: string;
  currentNode?: NodeId;
  activeEdgeId?: string;
  updatedNode?: NodeId;
  candidateUpdate?: DijkstraStep["candidateUpdate"];
  finalPathNodes?: NodeId[];
  finalPathEdges?: string[];
  finalCost?: number;
  neighborIds?: NodeId[];
  selectedReason?: string;
}

export function buildDijkstraSteps(scenario: GraphScenario): DijkstraStep[] {
  const steps: DijkstraStep[] = [];
  const nodeOrder = orderedNodeIds(scenario);
  const costs = initialCosts(scenario);
  const predecessors = initialPredecessors(scenario);
  const visited: NodeId[] = [];

  const pushStep = (input: StepInput) => {
    steps.push({
      id: `${scenario.id}-${steps.length}-${input.phase}`,
      phase: input.phase,
      title: input.title,
      explanation: input.explanation,
      calculation: input.calculation,
      currentNode: input.currentNode,
      activeEdgeId: input.activeEdgeId,
      updatedNode: input.updatedNode,
      candidateUpdate: input.candidateUpdate,
      costs: cloneCosts(costs),
      predecessors: clonePredecessors(predecessors),
      visited: [...visited],
      finalPathNodes: input.finalPathNodes ?? [],
      finalPathEdges: input.finalPathEdges ?? [],
      finalCost: input.finalCost,
      neighborIds: input.neighborIds ?? [],
      selectedReason: input.selectedReason,
      beginnerExplanation: input.beginnerExplanation,
      predecessorMeaning:
        "The predecessor table stores the previous node on the cheapest known path. At the end, we follow those links backward from the target to rebuild the route."
    });
  };

  pushStep({
    phase: "intro",
    title: scenario.title,
    explanation: `${scenario.story} The goal is to minimize ${scenario.weightLabel}.`,
    beginnerExplanation:
      "Think of the graph as places connected by arrows. Each arrow has a cost. Dijkstra keeps the cheapest known cost to every place and improves those costs step by step."
  });

  costs[scenario.startNode] = 0;
  pushStep({
    phase: "initialize",
    title: "Set the start cost to 0",
    explanation: `The route begins at ${scenario.startNode}, so the cost to reach the start is 0.`,
    updatedNode: scenario.startNode,
    beginnerExplanation:
      "We have not traveled anywhere yet, so the starting node costs nothing to reach."
  });

  pushStep({
    phase: "initialize",
    title: "Mark other costs as unknown",
    explanation:
      "Every other node starts at inf because the algorithm has not found a route to it yet.",
    beginnerExplanation:
      "The value inf means unknown for now. It will be replaced when a real route is discovered."
  });

  while (!visited.includes(scenario.targetNode)) {
    const currentNode = nodeOrder
      .filter((node) => !visited.includes(node))
      .sort((a, b) => {
        const costDifference = costs[a] - costs[b];
        return costDifference === 0 ? nodeOrder.indexOf(a) - nodeOrder.indexOf(b) : costDifference;
      })[0];

    if (!currentNode || costs[currentNode] === Infinity) {
      pushStep({
        phase: "visit",
        title: "Stop: no reachable node remains",
        explanation:
          "No unvisited node has a known cost, so the target cannot be reached from this start node.",
        beginnerExplanation:
          "The algorithm has run out of connected places to try. This means there is no route to the target in this graph."
      });
      break;
    }

    const neighbors = outgoingEdges(scenario, currentNode).map((edge) => edge.to);
    pushStep({
      phase: "select",
      title: `Select node ${currentNode}`,
      currentNode,
      neighborIds: neighbors,
      selectedReason: `${currentNode} has the smallest temporary cost among unvisited nodes: ${formatCost(costs[currentNode])}.`,
      explanation: `Choose the unvisited node with the smallest temporary ${scenario.weightLabel}: ${currentNode}, with cost ${formatCost(costs[currentNode])}.`,
      beginnerExplanation:
        "This selected node is now the safest one to expand. Since all edge costs are non-negative, no later detour can make it cheaper."
    });

    for (const graphEdge of outgoingEdges(scenario, currentNode)) {
      const candidateCost = costs[currentNode] + graphEdge.weight;
      const previousCost = costs[graphEdge.to];

      pushStep({
        phase: "explore",
        title: `Check ${graphEdge.from} -> ${graphEdge.to}`,
        currentNode,
        activeEdgeId: graphEdge.id,
        neighborIds: neighbors,
        explanation: `Compute a candidate cost to ${graphEdge.to} by adding the current cost of ${graphEdge.from} and the edge cost.`,
        calculation: `cost(${graphEdge.from}) + w(${graphEdge.from},${graphEdge.to}) = ${formatCost(costs[currentNode])} + ${graphEdge.weight} = ${candidateCost}`,
        beginnerExplanation:
          "This is the main check: would going through the current node give this neighbor a cheaper route?",
        candidateUpdate: {
          edgeId: graphEdge.id,
          from: graphEdge.from,
          to: graphEdge.to,
          previousCost,
          candidateCost,
          didImprove: candidateCost < previousCost
        }
      });

      if (candidateCost < previousCost) {
        costs[graphEdge.to] = candidateCost;
        predecessors[graphEdge.to] = currentNode;

        pushStep({
          phase: "relax-update",
          title: `Update ${graphEdge.to}`,
          currentNode,
          activeEdgeId: graphEdge.id,
          updatedNode: graphEdge.to,
          neighborIds: neighbors,
          explanation: `The candidate cost is smaller, so ${graphEdge.to} receives a new best cost and ${currentNode} becomes its predecessor.`,
          calculation: `${candidateCost} < ${formatCost(previousCost)} -> cost(${graphEdge.to}) = ${candidateCost}, previous(${graphEdge.to}) = ${currentNode}`,
          beginnerExplanation:
            "We found a better route to this neighbor. The cost table changes, and the predecessor table remembers how we got there.",
          candidateUpdate: {
            edgeId: graphEdge.id,
            from: graphEdge.from,
            to: graphEdge.to,
            previousCost,
            candidateCost,
            didImprove: true
          }
        });
      } else {
        pushStep({
          phase: "relax-skip",
          title: `Keep ${graphEdge.to}`,
          currentNode,
          activeEdgeId: graphEdge.id,
          neighborIds: neighbors,
          explanation: `The candidate cost is not smaller, so the current best cost for ${graphEdge.to} stays unchanged.`,
          calculation: `${candidateCost} >= ${formatCost(previousCost)} -> keep cost(${graphEdge.to}) = ${formatCost(previousCost)}`,
          beginnerExplanation:
            "This route is not an improvement. Dijkstra keeps the cheaper route it already knew.",
          candidateUpdate: {
            edgeId: graphEdge.id,
            from: graphEdge.from,
            to: graphEdge.to,
            previousCost,
            candidateCost,
            didImprove: false
          }
        });
      }
    }

    visited.push(currentNode);
    pushStep({
      phase: "visit",
      title:
        currentNode === scenario.targetNode
          ? "Target finalized"
          : `Finalize ${currentNode}`,
      explanation:
        currentNode === scenario.targetNode
          ? `The target ${scenario.targetNode} now has its final minimum cost.`
          : `${currentNode} is visited, so its minimum cost is fixed.`,
      beginnerExplanation:
        currentNode === scenario.targetNode
          ? "We can stop because the target's cheapest route is known."
          : "Finalized means this node is done. The algorithm will not need to improve it again."
    });
  }

  const finalPathNodes: NodeId[] = [];
  let cursor: NodeId | null = scenario.targetNode;

  while (cursor) {
    finalPathNodes.unshift(cursor);
    if (cursor === scenario.startNode) {
      break;
    }
    cursor = predecessors[cursor];
  }

  const hasCompletePath = finalPathNodes[0] === scenario.startNode;
  const finalPathEdges = hasCompletePath
    ? finalPathNodes.slice(0, -1).map((node, index) => edgeId(node, finalPathNodes[index + 1]))
    : [];
  const finalCost = costs[scenario.targetNode];

  pushStep({
    phase: "final",
    title: "Reconstruct the shortest path",
    explanation: hasCompletePath
      ? scenario.finalInsight
      : "No complete path was found, so there is no route to reconstruct.",
    calculation: hasCompletePath
      ? `Shortest path = ${finalPathNodes.join(" -> ")}. Total cost = ${formatCost(finalCost)}.`
      : "No path available.",
    beginnerExplanation:
      "The algorithm now reads the predecessor table backward from the target. Reversing those links gives the final route.",
    finalPathNodes: hasCompletePath ? finalPathNodes : [],
    finalPathEdges,
    finalCost
  });

  return steps;
}
