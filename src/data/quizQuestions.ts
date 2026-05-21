import type { QuizQuestion } from "../types";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "purpose",
    topic: "Core idea",
    difficulty: "Core",
    question: "What does Dijkstra's algorithm find from a chosen start node?",
    options: [
      "A shortest path cost to each reachable node in a weighted graph",
      "The longest possible route through every node",
      "A random path that eventually reaches the target",
      "Only the number of edges in a graph"
    ],
    correctIndex: 0,
    explanation:
      "Dijkstra computes minimum total costs from one start node to all reachable nodes, then a target route can be reconstructed from predecessors."
  },
  {
    id: "weights",
    topic: "Graph model",
    difficulty: "Core",
    question: "In this learning tool, what can an edge weight represent?",
    options: [
      "Only the physical length of a road",
      "Only the number of nodes already visited",
      "Any non-negative cost such as energy, latency, time, or movement cost",
      "The name of the next node"
    ],
    correctIndex: 2,
    explanation:
      "A weight is the cost of taking an edge. Its meaning changes with the scenario, but Dijkstra needs it to be non-negative."
  },
  {
    id: "initialization",
    topic: "Setup",
    difficulty: "Core",
    question: "How should the distance table be initialized before Dijkstra begins?",
    options: [
      "Set the start node to 0 and every other node to infinity",
      "Set every node to 0",
      "Set the target node to 0 and ignore the start",
      "Set every edge weight to infinity"
    ],
    correctIndex: 0,
    explanation:
      "The start costs nothing to reach from itself. Other nodes begin as unknown, represented by infinity."
  },
  {
    id: "temporary-distance",
    topic: "Selection rule",
    difficulty: "Core",
    question: "Why does Dijkstra select the unvisited node with the smallest temporary distance?",
    options: [
      "Because it is always closest on the screen",
      "Because with non-negative weights, no later route can make that node cheaper",
      "Because it has the most outgoing edges",
      "Because it was created first in the data file"
    ],
    correctIndex: 1,
    explanation:
      "The smallest temporary distance is final because any future route would have to add non-negative cost."
  },
  {
    id: "relaxation",
    topic: "Relaxation",
    difficulty: "Core",
    question: "What does it mean to relax an edge from the current node to a neighbor?",
    options: [
      "Ignore the edge forever",
      "Make the edge weight negative",
      "Move the node to a random new position",
      "Check whether the current node gives a cheaper cost to that neighbor"
    ],
    correctIndex: 3,
    explanation:
      "Relaxation compares the old neighbor cost with a new candidate cost through the current node."
  },
  {
    id: "visited",
    topic: "Finalization",
    difficulty: "Core",
    question: "What does it mean when a node becomes visited or finalized?",
    options: [
      "Its minimum cost from the start is now fixed",
      "It has no edges",
      "It is removed from the visualization",
      "It must be the target"
    ],
    correctIndex: 0,
    explanation:
      "A finalized node has the smallest possible cost from the start under Dijkstra's non-negative-weight rule."
  },
  {
    id: "predecessor",
    topic: "Path reconstruction",
    difficulty: "Core",
    question: "What is the predecessor table used for?",
    options: [
      "To delete visited nodes from the graph",
      "To store the color of each node",
      "To remember the previous node on the best known route",
      "To count how many quiz answers were correct"
    ],
    correctIndex: 2,
    explanation:
      "After the target is reached, predecessor links are followed backward to reconstruct the shortest path."
  },
  {
    id: "candidate-cost",
    topic: "Calculation",
    difficulty: "Applied",
    question: "If the current node costs 7 and an outgoing edge has weight 3, what candidate cost do we test for the neighbor?",
    options: ["7", "10", "3", "21"],
    correctIndex: 1,
    explanation:
      "The candidate cost is the current node's distance plus the edge weight: 7 + 3 = 10."
  },
  {
    id: "update-or-skip",
    topic: "Calculation",
    difficulty: "Applied",
    question: "A neighbor already has cost 9. A new route through the current node costs 12. What should happen?",
    options: [
      "Update the neighbor to 12 because it was checked last",
      "Delete the neighbor from the graph",
      "Keep 9 because the new candidate is worse",
      "Set the predecessor to infinity"
    ],
    correctIndex: 2,
    explanation:
      "Dijkstra keeps the best known cost. Since 12 is higher than 9, the table should not change."
  },
  {
    id: "trace-selection",
    topic: "Tracing",
    difficulty: "Applied",
    question: "After starting at A, suppose B has cost 4 and C has cost 2. Which unvisited node should be selected next?",
    options: ["B", "C", "A again", "The target, no matter its cost"],
    correctIndex: 1,
    explanation:
      "C has the smaller temporary distance, so it is selected before B."
  },
  {
    id: "unreachable",
    topic: "Edge cases",
    difficulty: "Applied",
    question: "What does it mean if a node still has distance infinity after the algorithm finishes?",
    options: [
      "It is the fastest node",
      "Its predecessor should be the start node",
      "It has a negative edge",
      "It is unreachable from the chosen start node"
    ],
    correctIndex: 3,
    explanation:
      "Infinity remains when no sequence of edges connects the start node to that node."
  },
  {
    id: "early-stop",
    topic: "Target route",
    difficulty: "Applied",
    question: "When can you safely stop early if you only need the shortest path to one target?",
    options: [
      "As soon as the target is discovered as a neighbor",
      "After the first edge is relaxed",
      "When the target node is selected and finalized",
      "Before initialization"
    ],
    correctIndex: 2,
    explanation:
      "Discovery is not enough. Once the target is finalized, its shortest distance cannot improve."
  },
  {
    id: "direct-route",
    topic: "Reasoning",
    difficulty: "Applied",
    question: "Why might Dijkstra avoid a route that looks visually direct?",
    options: [
      "The final node is hidden",
      "The predecessor table cannot store direct edges",
      "The algorithm dislikes straight lines",
      "The direct edge may have a higher total weight than an indirect path"
    ],
    correctIndex: 3,
    explanation:
      "The algorithm minimizes total cost, so a visually direct edge can lose if its weight is high."
  },
  {
    id: "applications",
    topic: "Applications",
    difficulty: "Applied",
    question: "Which of these is a real-world use of shortest-path algorithms?",
    options: [
      "Changing a monitor's brightness",
      "Network packet routing",
      "Sorting names alphabetically",
      "Cropping an image"
    ],
    correctIndex: 1,
    explanation:
      "Routers often choose paths through a network using costs such as latency, congestion, or reliability."
  },
  {
    id: "negative",
    topic: "Limitations",
    difficulty: "Challenge",
    question: "Which limitation is important for basic Dijkstra's algorithm?",
    options: [
      "It only works with exactly three nodes",
      "It requires every graph to be a road map",
      "It cannot be used in computer networks",
      "It does not handle negative edge weights correctly"
    ],
    correctIndex: 3,
    explanation:
      "Dijkstra relies on the idea that finalized distances cannot get cheaper later. Negative edges break that guarantee."
  },
  {
    id: "priority-queue",
    topic: "Efficiency",
    difficulty: "Challenge",
    question: "Why is a priority queue often used in efficient implementations of Dijkstra?",
    options: [
      "It stores only negative weights",
      "It makes graph edges disappear after they are visited",
      "It helps quickly select the unvisited node with the smallest temporary distance",
      "It guarantees the graph is drawn neatly"
    ],
    correctIndex: 2,
    explanation:
      "The repeated 'choose the smallest temporary distance' step is expensive without a data structure that supports efficient minimum extraction."
  },
  {
    id: "ties",
    topic: "Reasoning",
    difficulty: "Challenge",
    question: "If two unvisited nodes have the same smallest temporary distance, what is usually acceptable?",
    options: [
      "Choose either tied node, as both currently have the same finalized cost",
      "Restart the algorithm",
      "Ignore both nodes forever",
      "Change one edge weight to break the tie"
    ],
    correctIndex: 0,
    explanation:
      "A tie may lead to a different but equally valid shortest-path tree. The finalized cost remains correct."
  },
  {
    id: "directed-graphs",
    topic: "Graph model",
    difficulty: "Challenge",
    question: "Can Dijkstra work on directed graphs?",
    options: [
      "No, it only works if every edge is two-way",
      "Yes, as long as directions are respected and weights are non-negative",
      "Only if there is exactly one directed edge",
      "Only when all weights are equal to 1"
    ],
    correctIndex: 1,
    explanation:
      "Dijkstra can work on directed or undirected graphs. The key requirement is non-negative edge weights."
  },
  {
    id: "bfs-comparison",
    topic: "Algorithm choice",
    difficulty: "Challenge",
    question: "When is breadth-first search enough instead of Dijkstra?",
    options: [
      "When all edges have equal cost",
      "When edge weights are all different",
      "When the graph has negative weights",
      "When you need the longest route"
    ],
    correctIndex: 0,
    explanation:
      "If every edge has the same cost, minimizing the number of edges is the same as minimizing total cost, so BFS is enough."
  },
  {
    id: "shortest-path-tree",
    topic: "Output",
    difficulty: "Challenge",
    question: "What structure do the predecessor links form after a full Dijkstra run from one start node?",
    options: [
      "A random cycle through every node",
      "A shortest-path tree for the reachable nodes",
      "A list of only the heaviest edges",
      "A sorted list of node labels"
    ],
    correctIndex: 1,
    explanation:
      "Each reachable node points back along its best known route, forming a shortest-path tree rooted at the start."
  }
];
