import type { GraphEdge, GraphNode, GraphScenario, NodeId } from "../types";

export const edgeId = (from: NodeId, to: NodeId) => `${from}-${to}`;

const paths = {
  startUpper: {
    pathD: "M 153 320 C 198 288, 246 250, 284 230",
    labelX: 222,
    labelY: 274
  },
  startLower: {
    pathD: "M 154 358 C 202 411, 242 472, 286 443",
    labelX: 218,
    labelY: 424
  },
  upperLower: {
    pathD: "M 315 253 C 300 306, 300 366, 315 392",
    labelX: 286,
    labelY: 320
  },
  lowerUpper: {
    pathD: "M 315 392 C 300 366, 300 306, 315 253",
    labelX: 286,
    labelY: 320
  },
  upperMid: {
    pathD: "M 350 217 C 430 185, 500 184, 536 207",
    labelX: 444,
    labelY: 182
  },
  lowerHub: {
    pathD: "M 350 420 C 446 455, 575 425, 635 350",
    labelX: 493,
    labelY: 438
  },
  midHub: {
    pathD: "M 592 236 C 615 265, 638 293, 651 304",
    labelX: 626,
    labelY: 271
  },
  midTarget: {
    pathD: "M 603 195 C 710 48, 892 72, 968 186 C 1028 277, 960 328, 883 325",
    labelX: 832,
    labelY: 112
  },
  hubTarget: {
    pathD: "M 700 332 C 775 320, 835 327, 873 339",
    labelX: 790,
    labelY: 314
  }
} as const;

function node(
  id: NodeId,
  x: number,
  y: number,
  label: string,
  shortLabel: string,
  role?: GraphNode["role"]
): GraphNode {
  return { id, x, y, label, shortLabel, role };
}

function edge(
  from: NodeId,
  to: NodeId,
  weight: number,
  path: (typeof paths)[keyof typeof paths],
  interpretation: string,
  metadata: Record<string, string>
): GraphEdge {
  return {
    id: edgeId(from, to),
    from,
    to,
    weight,
    ...path,
    interpretation,
    metadata
  };
}

export const scenarios: GraphScenario[] = [
  {
    id: "iot-smart-city",
    title: "Smart City Learning Scenario",
    shortTitle: "Smart City",
    domain: "Autonomous driving",
    description:
      "A connected autonomous vehicle chooses the lowest-energy route through a sensor-rich city network.",
    story:
      "Roadside units, cameras, smart traffic lights, weather sensors, occupancy sensors, and the vehicle battery system estimate the energy cost of each road segment.",
    objective: "Minimize total battery cost from Start to Target using live sensor-derived edge weights.",
    weightLabel: "sensor-derived battery cost",
    nodesMeaning: "Intersections, roadside units, smart checkpoints, and the final destination.",
    edgesMeaning: "Directed road segments the vehicle can drive through, each measured by city sensors.",
    weightsMeaning:
      "Estimated battery cost from traffic density, signal delay, road occupancy, weather alerts, sensor reliability, and risk.",
    realLifeExample:
      "A connected car avoids the visually direct corridor because traffic, wet-road alerts, and signal delay predict higher battery use.",
    learningGoal:
      "Understand how a real transport problem becomes a weighted graph, then how Dijkstra explains the best route step by step.",
    telemetryLabels: ["traffic", "occupancy", "signalDelay", "weather", "risk", "sensors"],
    tags: ["Smart mobility", "IoT", "Energy"],
    difficulty: "Beginner",
    startNode: "S",
    targetNode: "T",
    nodes: [
      node("S", 120, 340, "Start", "Start", "start"),
      node("A", 315, 220, "Intersection A", "Intersection A"),
      node("B", 315, 425, "Intersection B", "Intersection B"),
      node("C", 570, 210, "Intersection C", "Intersection C"),
      node("D", 665, 330, "Intersection D", "Intersection D"),
      node("T", 905, 345, "Target", "Target", "destination")
    ],
    edges: [
      edge("S", "A", 2, paths.startUpper, "A clear segment with few stops consumes little battery.", {
        traffic: "light",
        occupancy: "18%",
        signalDelay: "4 s",
        weather: "dry",
        risk: "0.12",
        sensors: "battery sensor, V2X beacon, traffic camera"
      }),
      edge("S", "B", 5, paths.startLower, "Congestion and smart-light delay increase battery usage.", {
        traffic: "heavy",
        occupancy: "74%",
        signalDelay: "28 s",
        weather: "dry",
        risk: "0.46",
        sensors: "battery sensor, occupancy sensor, smart light"
      }),
      edge("A", "B", 1, paths.upperLower, "A short connector benefits from green-wave signal timing.", {
        traffic: "light",
        occupancy: "12%",
        signalDelay: "2 s",
        weather: "dry",
        risk: "0.08",
        sensors: "V2X RSU, smart traffic light"
      }),
      edge("A", "C", 2, paths.upperMid, "A stable-flow corridor has a low energy estimate.", {
        traffic: "light",
        occupancy: "21%",
        signalDelay: "5 s",
        weather: "dry",
        risk: "0.10",
        sensors: "traffic camera, occupancy sensor, V2X RSU"
      }),
      edge("B", "D", 3, paths.lowerHub, "Stop-and-go traffic and a mild uphill segment add energy cost.", {
        traffic: "medium",
        occupancy: "48%",
        signalDelay: "14 s",
        weather: "dry",
        risk: "0.28",
        sensors: "battery sensor, V2X RSU, traffic camera"
      }),
      edge("C", "D", 1, paths.midHub, "This connector is short, clear, and energy efficient.", {
        traffic: "light",
        occupancy: "9%",
        signalDelay: "1 s",
        weather: "dry",
        risk: "0.06",
        sensors: "average speed sensor, V2X RSU"
      }),
      edge("C", "T", 7, paths.midTarget, "The direct corridor is long, congested, wet, and slightly uphill.", {
        traffic: "heavy",
        occupancy: "82%",
        signalDelay: "36 s",
        weather: "wet surface alert",
        risk: "0.71",
        sensors: "weather sensor, traffic camera"
      }),
      edge("D", "T", 2, paths.hubTarget, "A short final segment has steady speed and light occupancy.", {
        traffic: "light",
        occupancy: "24%",
        signalDelay: "3 s",
        weather: "dry",
        risk: "0.11",
        sensors: "road occupancy sensor, traffic camera, V2X RSU"
      })
    ],
    learningFocus: [
      "Live sensor readings become non-negative edge weights.",
      "The lowest-energy route can be different from the shortest-looking route.",
      "Every table update has a clear reason you can trace.",
      "The predecessor table reconstructs the final route."
    ],
    finalInsight:
      "Dijkstra avoids the expensive C -> T corridor and chooses S -> A -> C -> D -> T with total cost 7."
  },
  {
    id: "internet-routing",
    title: "Internet Packet Routing",
    shortTitle: "Packet Routing",
    domain: "Computer networks",
    description:
      "A packet moves through routers while trying to minimize total latency.",
    story:
      "Each link is scored using latency, bandwidth, packet loss, and congestion, just like a routing protocol might estimate path quality.",
    objective: "Find the lowest-latency path from the client to the server.",
    weightLabel: "network latency cost",
    nodesMeaning: "Routers, client devices, exchanges, and servers in a communication network.",
    edgesMeaning: "Communication links that can forward packets from one device to another.",
    weightsMeaning: "Latency, congestion, packet loss, bandwidth limits, or routing cost.",
    realLifeExample:
      "A packet avoids a short but overloaded link and travels through a cleaner router chain.",
    learningGoal:
      "Understand how shortest-path routing can support efficient digital communication.",
    telemetryLabels: ["latency", "bandwidth", "packetLoss", "congestion"],
    tags: ["Networks", "Latency", "Packets"],
    difficulty: "Intermediate",
    startNode: "CL",
    targetNode: "SV",
    nodes: [
      node("CL", 120, 340, "Client", "Client", "start"),
      node("R1", 315, 220, "Router 1", "Router 1", "router"),
      node("R2", 315, 425, "Router 2", "Router 2", "router"),
      node("R3", 570, 210, "Backbone router", "Backbone", "router"),
      node("IX", 665, 330, "Internet exchange", "Exchange", "hub"),
      node("SV", 905, 345, "Server", "Server", "destination")
    ],
    edges: [
      edge("CL", "R1", 4, paths.startUpper, "This link is reliable but has moderate latency.", {
        latency: "38 ms",
        bandwidth: "800 Mbps",
        packetLoss: "0.3%",
        congestion: "medium"
      }),
      edge("CL", "R2", 2, paths.startLower, "This nearby edge router has a fast first hop.", {
        latency: "18 ms",
        bandwidth: "600 Mbps",
        packetLoss: "0.2%",
        congestion: "low"
      }),
      edge("R2", "R1", 1, paths.lowerUpper, "Routers share a private peering link with very low latency.", {
        latency: "8 ms",
        bandwidth: "1 Gbps",
        packetLoss: "0.1%",
        congestion: "low"
      }),
      edge("R1", "R3", 2, paths.upperMid, "The backbone hop is fast and has good capacity.", {
        latency: "20 ms",
        bandwidth: "2 Gbps",
        packetLoss: "0.1%",
        congestion: "low"
      }),
      edge("R2", "IX", 7, paths.lowerHub, "This exchange path is currently congested.", {
        latency: "70 ms",
        bandwidth: "400 Mbps",
        packetLoss: "1.8%",
        congestion: "high"
      }),
      edge("R3", "IX", 1, paths.midHub, "A short backbone exchange link keeps delay low.", {
        latency: "9 ms",
        bandwidth: "2 Gbps",
        packetLoss: "0.1%",
        congestion: "low"
      }),
      edge("R3", "SV", 8, paths.midTarget, "The direct server path crosses a loaded region.", {
        latency: "85 ms",
        bandwidth: "300 Mbps",
        packetLoss: "2.4%",
        congestion: "high"
      }),
      edge("IX", "SV", 2, paths.hubTarget, "The exchange has a clean final hop to the server.", {
        latency: "19 ms",
        bandwidth: "1.5 Gbps",
        packetLoss: "0.2%",
        congestion: "low"
      })
    ],
    learningFocus: [
      "Weights can represent latency or network quality.",
      "Routers can prefer an indirect path when the direct link is congested.",
      "Dijkstra is a foundation for shortest-path routing protocols."
    ],
    finalInsight:
      "The best path is CL -> R2 -> R1 -> R3 -> IX -> SV with total cost 8."
  },
  {
    id: "gps-navigation",
    title: "GPS Navigation Map",
    shortTitle: "GPS Map",
    domain: "Navigation",
    description:
      "A navigation app compares road segments to minimize estimated travel time.",
    story:
      "Edge weights combine distance, road speed, traffic signals, and temporary slowdowns.",
    objective: "Find the fastest route from Home to Campus.",
    weightLabel: "travel-time cost",
    nodesMeaning: "Locations, intersections, road landmarks, and the destination.",
    edgesMeaning: "Road segments that connect locations on the map.",
    weightsMeaning: "Estimated travel time from distance, speed, traffic lights, and congestion.",
    realLifeExample:
      "A navigation app chooses a detour around a slow work zone because it lowers total travel time.",
    learningGoal:
      "Understand why the fastest route can be different from the shortest-looking route.",
    telemetryLabels: ["distance", "speed", "lights", "congestion"],
    tags: ["Navigation", "Mobility", "Maps"],
    difficulty: "Beginner",
    startNode: "H",
    targetNode: "CAMP",
    nodes: [
      node("H", 120, 340, "Home", "Home", "start"),
      node("P", 315, 220, "Park road", "Park road", "safe"),
      node("M", 315, 425, "Market street", "Market", "busy"),
      node("TN", 570, 210, "Tunnel", "Tunnel"),
      node("BR", 665, 330, "Bridge", "Bridge"),
      node("CAMP", 905, 345, "Campus", "Campus", "destination")
    ],
    edges: [
      edge("H", "P", 2, paths.startUpper, "A calm local road has light traffic.", {
        distance: "1.2 km",
        speed: "40 km/h",
        lights: "1",
        congestion: "low"
      }),
      edge("H", "M", 6, paths.startLower, "Market street is longer and busier at this time.", {
        distance: "2.1 km",
        speed: "28 km/h",
        lights: "5",
        congestion: "high"
      }),
      edge("P", "M", 2, paths.upperLower, "A short connector links the quiet road to the market area.", {
        distance: "0.7 km",
        speed: "35 km/h",
        lights: "1",
        congestion: "medium"
      }),
      edge("P", "TN", 3, paths.upperMid, "The tunnel approach is steady and predictable.", {
        distance: "1.5 km",
        speed: "50 km/h",
        lights: "0",
        congestion: "low"
      }),
      edge("M", "BR", 4, paths.lowerHub, "Bridge traffic adds delay but remains usable.", {
        distance: "1.8 km",
        speed: "32 km/h",
        lights: "2",
        congestion: "medium"
      }),
      edge("TN", "BR", 1, paths.midHub, "The tunnel exit connects quickly to the bridge road.", {
        distance: "0.4 km",
        speed: "45 km/h",
        lights: "0",
        congestion: "low"
      }),
      edge("TN", "CAMP", 8, paths.midTarget, "The direct campus road has a work-zone slowdown.", {
        distance: "3.2 km",
        speed: "20 km/h",
        lights: "3",
        congestion: "high"
      }),
      edge("BR", "CAMP", 2, paths.hubTarget, "The final campus approach is short and clear.", {
        distance: "1.0 km",
        speed: "45 km/h",
        lights: "1",
        congestion: "low"
      })
    ],
    learningFocus: [
      "Shortest path often means shortest time, not shortest physical distance.",
      "Traffic can make an indirect route faster.",
      "The final path is recovered from predecessor links."
    ],
    finalInsight:
      "The fastest path is H -> P -> TN -> BR -> CAMP with total cost 8."
  },
  {
    id: "warehouse-logistics",
    title: "Warehouse Logistics",
    shortTitle: "Warehouse",
    domain: "Logistics",
    description:
      "A delivery robot moves through warehouse zones while minimizing handling and travel cost.",
    story:
      "Weights combine travel distance, fuel or battery cost, road restrictions, and delivery priority.",
    objective: "Move goods from Dock to Dispatch with the lowest operational cost.",
    weightLabel: "logistics cost",
    nodesMeaning: "Warehouse zones, aisles, packing stations, and dispatch points.",
    edgesMeaning: "Allowed movements through aisles or service corridors.",
    weightsMeaning: "Distance, fuel or battery cost, priority, restrictions, and handling effort.",
    realLifeExample:
      "A warehouse robot skips a restricted cold-storage route when a packing-lane route is cheaper overall.",
    learningGoal:
      "Understand how graph weights can include business rules and operational constraints.",
    telemetryLabels: ["distance", "fuelCost", "priority", "restrictions"],
    tags: ["Logistics", "Robotics", "Operations"],
    difficulty: "Intermediate",
    startNode: "DOCK",
    targetNode: "OUT",
    nodes: [
      node("DOCK", 120, 340, "Loading dock", "Dock", "start"),
      node("A1", 315, 220, "Aisle A", "Aisle A", "storage"),
      node("B1", 315, 425, "Aisle B", "Aisle B", "storage"),
      node("PACK", 570, 210, "Packing station", "Packing", "service"),
      node("COLD", 665, 330, "Cold storage", "Cold room", "busy"),
      node("OUT", 905, 345, "Dispatch gate", "Dispatch", "destination")
    ],
    edges: [
      edge("DOCK", "A1", 3, paths.startUpper, "Aisle A is clear and close to the dock.", {
        distance: "55 m",
        fuelCost: "low",
        priority: "normal",
        restrictions: "none"
      }),
      edge("DOCK", "B1", 4, paths.startLower, "Aisle B is reachable but busier.", {
        distance: "72 m",
        fuelCost: "medium",
        priority: "normal",
        restrictions: "forklift crossing"
      }),
      edge("A1", "B1", 2, paths.upperLower, "The cross-aisle is short but narrow.", {
        distance: "30 m",
        fuelCost: "low",
        priority: "normal",
        restrictions: "slow zone"
      }),
      edge("A1", "PACK", 2, paths.upperMid, "A clear route connects Aisle A to packing.", {
        distance: "48 m",
        fuelCost: "low",
        priority: "high",
        restrictions: "none"
      }),
      edge("B1", "COLD", 2, paths.lowerHub, "Cold storage is close to Aisle B.", {
        distance: "35 m",
        fuelCost: "medium",
        priority: "urgent",
        restrictions: "temperature gate"
      }),
      edge("PACK", "COLD", 4, paths.midHub, "Moving from packing to cold storage requires a controlled door.", {
        distance: "42 m",
        fuelCost: "medium",
        priority: "normal",
        restrictions: "access checkpoint"
      }),
      edge("PACK", "OUT", 3, paths.midTarget, "The dispatch lane from packing is direct and efficient.", {
        distance: "65 m",
        fuelCost: "low",
        priority: "high",
        restrictions: "none"
      }),
      edge("COLD", "OUT", 4, paths.hubTarget, "Cold storage dispatch requires careful handling.", {
        distance: "58 m",
        fuelCost: "medium",
        priority: "urgent",
        restrictions: "sealed-container check"
      })
    ],
    learningFocus: [
      "Weights can include business rules, not just physical distance.",
      "Dijkstra supports routing under operational constraints.",
      "A low total path can avoid costly restricted areas."
    ],
    finalInsight:
      "The best logistics route is DOCK -> A1 -> PACK -> OUT with total cost 8."
  },
  {
    id: "game-pathfinding",
    title: "Game Map Pathfinding",
    shortTitle: "Game AI",
    domain: "Games",
    description:
      "A game character chooses a route across terrain while avoiding costly or dangerous areas.",
    story:
      "Weights represent movement cost from terrain, danger, obstacles, and tactical risk.",
    objective: "Move from Spawn to Goal with the lowest movement cost.",
    weightLabel: "movement cost",
    nodesMeaning: "Game map regions, tiles, waypoints, and the goal.",
    edgesMeaning: "Allowed moves between neighboring areas.",
    weightsMeaning: "Terrain difficulty, danger, stamina use, movement cost, and obstacles.",
    realLifeExample:
      "A character avoids a dangerous enemy zone even when that route looks more direct.",
    learningGoal:
      "Understand how game AI can choose paths using movement cost instead of distance alone.",
    telemetryLabels: ["terrain", "danger", "movementCost", "obstacle"],
    tags: ["Game AI", "Pathfinding", "Movement"],
    difficulty: "Beginner",
    startNode: "SP",
    targetNode: "GOAL",
    nodes: [
      node("SP", 120, 340, "Spawn", "Spawn", "start"),
      node("FOR", 315, 220, "Forest", "Forest", "safe"),
      node("SW", 315, 425, "Swamp", "Swamp", "busy"),
      node("RU", 570, 210, "Ruins", "Ruins", "terrain"),
      node("CL", 665, 330, "Cliff path", "Cliff", "terrain"),
      node("GOAL", 905, 345, "Goal", "Goal", "destination")
    ],
    edges: [
      edge("SP", "FOR", 2, paths.startUpper, "Forest tiles are easy to cross.", {
        terrain: "forest",
        danger: "low",
        movementCost: "low",
        obstacle: "trees"
      }),
      edge("SP", "SW", 5, paths.startLower, "Swamp tiles slow the character down.", {
        terrain: "swamp",
        danger: "medium",
        movementCost: "high",
        obstacle: "mud"
      }),
      edge("FOR", "SW", 3, paths.upperLower, "The forest-to-swamp trail is passable but slower.", {
        terrain: "mixed",
        danger: "medium",
        movementCost: "medium",
        obstacle: "wet ground"
      }),
      edge("FOR", "RU", 2, paths.upperMid, "A forest trail reaches the ruins quickly.", {
        terrain: "trail",
        danger: "low",
        movementCost: "low",
        obstacle: "minor cover"
      }),
      edge("SW", "CL", 4, paths.lowerHub, "The swamp route reaches the cliff but costs more movement.", {
        terrain: "swamp",
        danger: "high",
        movementCost: "high",
        obstacle: "deep water"
      }),
      edge("RU", "CL", 1, paths.midHub, "The ruins have a shortcut to the cliff path.", {
        terrain: "stone",
        danger: "low",
        movementCost: "very low",
        obstacle: "stairs"
      }),
      edge("RU", "GOAL", 8, paths.midTarget, "The direct route crosses a dangerous enemy zone.", {
        terrain: "open field",
        danger: "high",
        movementCost: "high",
        obstacle: "enemy patrol"
      }),
      edge("CL", "GOAL", 3, paths.hubTarget, "The cliff path is longer but safer than the enemy zone.", {
        terrain: "cliff trail",
        danger: "medium",
        movementCost: "medium",
        obstacle: "narrow path"
      })
    ],
    learningFocus: [
      "Game AI can use edge weights for terrain and danger.",
      "The cheapest path may avoid visually direct but dangerous areas.",
      "Dijkstra works when all movement costs are non-negative."
    ],
    finalInsight:
      "The character chooses SP -> FOR -> RU -> CL -> GOAL with total cost 8."
  }
];

export const defaultScenarioId = scenarios[0].id;

export function getScenarioById(id: string): GraphScenario {
  return scenarios.find((scenario) => scenario.id === id) ?? scenarios[0];
}
