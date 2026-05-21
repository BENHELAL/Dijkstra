export type ApplicationDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface ApplicationSource {
  title: string;
  url: string;
}

export interface DijkstraApplication {
  id: string;
  title: string;
  icon: string;
  scenarioId: string;
  difficulty: ApplicationDifficulty;
  tags: string[];
  shortExplanation: string;
  whereUsed: string[];
  realLifeExample: string;
  graphModel: {
    nodes: string;
    edges: string;
    weights: string;
  };
  whyUseful: string;
  limitations: string;
  analogy: string;
  keyIdea: string;
  thinkLikeGraph: string;
  miniChallenge: string;
  checkPrompt: string;
  sources: ApplicationSource[];
}

export const applications: DijkstraApplication[] = [
  {
    id: "iot-routing",
    title: "IoT Routing",
    icon: "IOT",
    scenarioId: "iot-smart-city",
    difficulty: "Intermediate",
    tags: ["Smart City", "Sensors", "Mobility"],
    shortExplanation:
      "Connected sensors can turn traffic, weather, and battery readings into route costs for smart-city systems.",
    whereUsed: ["Smart traffic platforms", "Connected vehicle fleets", "Industrial IoT logistics"],
    realLifeExample:
      "A connected vehicle receives traffic-light delay, road occupancy, and wet-surface alerts. The route planner chooses a slightly longer but lower-energy path.",
    graphModel: {
      nodes: "Intersections, roadside units, charging points, or delivery checkpoints.",
      edges: "Road segments, wireless hops, or service corridors between smart-city points.",
      weights: "Battery cost, delay, congestion, safety risk, signal wait, or a combined IoT score."
    },
    whyUseful:
      "Dijkstra gives a clear minimum-cost route when all sensor-derived edge weights are non-negative.",
    limitations:
      "If conditions change every second, systems may need repeated re-planning, A*, time-dependent routing, or predictive models.",
    analogy:
      "It is like choosing hallways in a school where every hallway has a live sign showing crowding and walking effort.",
    keyIdea:
      "IoT data does not replace the graph. It gives meaning to the edge weights.",
    thinkLikeGraph:
      "Ask: what are the decision points, what moves are allowed, and what live cost should each move carry?",
    miniChallenge:
      "A delivery robot must choose between a short crowded street and a longer empty street. Should the edge weight be distance, energy cost, or delay? Explain your choice.",
    checkPrompt:
      "Can you name three sensor readings that could change the best route?",
    sources: [
      { title: "AWS: What is IoT?", url: "https://aws.amazon.com/what-is/iot/" },
      { title: "IBM: Internet of Things", url: "https://www.ibm.com/topics/internet-of-things" },
      { title: "Dijkstra's algorithm", url: "https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm" }
    ]
  },
  {
    id: "network-routing",
    title: "Network Routing",
    icon: "NET",
    scenarioId: "internet-routing",
    difficulty: "Intermediate",
    tags: ["Networks", "Latency", "Packets"],
    shortExplanation:
      "Routers model a network as links with costs and choose paths for packets across the topology.",
    whereUsed: ["Enterprise networks", "Internet service providers", "Campus networks", "Cloud networks"],
    realLifeExample:
      "A packet may avoid a direct link if that link is congested or has high packet loss, choosing a lower-cost router chain instead.",
    graphModel: {
      nodes: "Routers, switches, gateways, or network regions.",
      edges: "Physical or logical links between network devices.",
      weights: "Latency, hop cost, congestion, loss rate, bandwidth penalty, or routing metric."
    },
    whyUseful:
      "Shortest-path routing can quickly compute best paths across a known topology using link-state information.",
    limitations:
      "Internet-scale routing also deals with policies, failures, and business agreements, so protocols like BGP or traffic-engineering systems may be needed.",
    analogy:
      "It is like mailing a letter through post offices where each road has a delay score.",
    keyIdea:
      "The shortest route for packets is usually the lowest network cost, not the fewest cables.",
    thinkLikeGraph:
      "Treat each router as a node and each link as an edge whose cost describes how expensive that hop is right now.",
    miniChallenge:
      "If one link has low latency but heavy packet loss, should its edge weight stay low? Why or why not?",
    checkPrompt:
      "What network metric would you use for video calls: hop count, latency, or bandwidth?",
    sources: [
      { title: "Cloudflare: What is routing?", url: "https://www.cloudflare.com/learning/network-layer/what-is-routing/" },
      { title: "Open Shortest Path First", url: "https://en.wikipedia.org/wiki/Open_Shortest_Path_First" },
      { title: "Dijkstra's algorithm", url: "https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm" }
    ]
  },
  {
    id: "gps-navigation",
    title: "GPS Navigation",
    icon: "GPS",
    scenarioId: "gps-navigation",
    difficulty: "Beginner",
    tags: ["Mobility", "Maps", "Routing"],
    shortExplanation:
      "Navigation systems can model roads as weighted graphs and search for the shortest, fastest, or lowest-cost route.",
    whereUsed: ["Navigation systems", "Delivery apps", "Ride-sharing apps", "Fleet management platforms"],
    realLifeExample:
      "A GPS app models intersections as nodes and road segments as edges. Weights can be travel time, distance, fuel cost, tolls, or traffic delay.",
    graphModel: {
      nodes: "Intersections, addresses, waypoints, or map locations.",
      edges: "Road segments that connect locations.",
      weights: "Travel time, distance, congestion, toll cost, fuel use, or energy consumption."
    },
    whyUseful:
      "Dijkstra guarantees the lowest-cost path when the road costs are non-negative.",
    limitations:
      "Large live maps often use optimized methods such as A*, contraction hierarchies, or specialized routing engines.",
    analogy:
      "It is like comparing every possible school route, but always expanding the currently cheapest partial route first.",
    keyIdea:
      "A road that looks shorter can lose if its traffic or delay weight is high.",
    thinkLikeGraph:
      "Turn a map into decision points and road segments, then decide what 'best' means: time, distance, money, or energy.",
    miniChallenge:
      "A route with fewer kilometers takes longer because of traffic. Which edge weight better represents the best route: distance or travel time?",
    checkPrompt:
      "Why can the fastest route and shortest-distance route be different?",
    sources: [
      { title: "Google Maps Platform Routes API", url: "https://developers.google.com/maps/documentation/routes" },
      { title: "Route planning", url: "https://en.wikipedia.org/wiki/Route_planning" },
      { title: "Shortest path problem", url: "https://en.wikipedia.org/wiki/Shortest_path_problem" }
    ]
  },
  {
    id: "logistics-optimization",
    title: "Logistics Optimization",
    icon: "LOG",
    scenarioId: "warehouse-logistics",
    difficulty: "Advanced",
    tags: ["Logistics", "Optimization", "Delivery"],
    shortExplanation:
      "Logistics systems route vehicles, robots, or packages through networks while minimizing cost and respecting constraints.",
    whereUsed: ["Package delivery", "Warehouse automation", "Field service scheduling", "Fleet routing"],
    realLifeExample:
      "A delivery planner may choose routes that reduce total distance while also considering time windows, vehicle capacity, fuel, and priority stops.",
    graphModel: {
      nodes: "Customers, depots, warehouse zones, loading docks, or service stops.",
      edges: "Road links, warehouse aisles, or allowed travel between stops.",
      weights: "Distance, travel time, fuel, handling cost, delay, or priority penalty."
    },
    whyUseful:
      "Dijkstra is useful for subproblems such as finding cheapest paths between stops before solving a larger routing plan.",
    limitations:
      "Full logistics problems often include multiple vehicles, capacities, and time windows, so VRP solvers or mixed optimization methods are usually better.",
    analogy:
      "It is like planning errands where each street has a cost, but a full delivery day also has deadlines and vehicle limits.",
    keyIdea:
      "Dijkstra solves a shortest path; logistics often wraps many shortest paths inside a bigger optimization problem.",
    thinkLikeGraph:
      "Identify stops as nodes, allowed travel as edges, and operational effort as the cost.",
    miniChallenge:
      "If a route is shortest but misses a delivery time window, should it still be considered best?",
    checkPrompt:
      "What extra constraint makes logistics harder than a single shortest path?",
    sources: [
      { title: "Google OR-Tools: Vehicle Routing", url: "https://developers.google.com/optimization/routing" },
      { title: "Esri Route analysis layer", url: "https://doc.esri.com/en/arcgis-pro/latest/help/analysis/networks/route-analysis-layer.html" },
      { title: "Shortest path problem", url: "https://en.wikipedia.org/wiki/Shortest_path_problem" }
    ]
  },
  {
    id: "game-ai-pathfinding",
    title: "Game AI Pathfinding",
    icon: "AI",
    scenarioId: "game-pathfinding",
    difficulty: "Beginner",
    tags: ["AI", "Games", "Pathfinding"],
    shortExplanation:
      "Game characters use graph search to move through maps with terrain, obstacles, danger, and movement cost.",
    whereUsed: ["Strategy games", "Role-playing games", "Simulation games", "NPC navigation"],
    realLifeExample:
      "A game enemy may avoid swamp tiles and dangerous zones even if the direct line to the player is shorter.",
    graphModel: {
      nodes: "Tiles, waypoints, rooms, navmesh points, or map states.",
      edges: "Legal moves between tiles or navigation points.",
      weights: "Movement cost, terrain difficulty, danger level, stamina cost, or tactical risk."
    },
    whyUseful:
      "Dijkstra finds the cheapest reachable route when no heuristic is available or when the game needs costs to many targets.",
    limitations:
      "A* is often faster for one target because it uses a heuristic to guide the search toward the goal.",
    analogy:
      "It is like a character spreading out a wave of possible moves and always trying the cheapest wave edge next.",
    keyIdea:
      "In games, shortest usually means lowest movement cost, not straight-line distance.",
    thinkLikeGraph:
      "Convert the map into legal moves, then assign costs that match how hard or risky each move feels.",
    miniChallenge:
      "Should lava, grass, and roads have the same weight? Design three movement costs and justify them.",
    checkPrompt:
      "Why might A* be preferred when an enemy has one clear destination?",
    sources: [
      { title: "Red Blob Games: A* introduction", url: "https://www.redblobgames.com/pathfinding/a-star/introduction.html" },
      { title: "Pathfinding", url: "https://en.wikipedia.org/wiki/Pathfinding" },
      { title: "Dijkstra's algorithm", url: "https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm" }
    ]
  },
  {
    id: "emergency-response",
    title: "Emergency Response Routing",
    icon: "SOS",
    scenarioId: "gps-navigation",
    difficulty: "Intermediate",
    tags: ["Safety", "Mobility", "GIS"],
    shortExplanation:
      "Emergency routing searches for fast, reliable paths while accounting for traffic, blocked roads, and service constraints.",
    whereUsed: ["Ambulance dispatch", "Fire response", "Disaster response", "Police routing"],
    realLifeExample:
      "A dispatch system can route an ambulance around a closed road while minimizing travel time to the incident.",
    graphModel: {
      nodes: "Stations, intersections, hospitals, incidents, and access points.",
      edges: "Road segments, emergency lanes, or permitted travel paths.",
      weights: "Travel time, blockage penalty, road priority, turn delay, or response risk."
    },
    whyUseful:
      "It gives an explainable baseline for finding a lowest-cost response path when all costs are non-negative.",
    limitations:
      "Real emergency systems may need live traffic, stochastic travel times, road closures, and multi-vehicle dispatch optimization.",
    analogy:
      "It is like choosing the quickest hallway to a classroom while some doors are blocked and some corridors are crowded.",
    keyIdea:
      "For emergencies, the best route is the lowest expected response time, not necessarily the shortest distance.",
    thinkLikeGraph:
      "Represent roads as edges and encode urgent constraints, closures, and delays directly into weights.",
    miniChallenge:
      "If a highway is longer but always clear, while a local road is shorter but unpredictable, which should receive the lower emergency weight?",
    checkPrompt:
      "What live data would make emergency routing more reliable?",
    sources: [
      { title: "Esri Route analysis layer", url: "https://doc.esri.com/en/arcgis-pro/latest/help/analysis/networks/route-analysis-layer.html" },
      { title: "Google Maps Platform Routes API", url: "https://developers.google.com/maps/documentation/routes" },
      { title: "Route planning", url: "https://en.wikipedia.org/wiki/Route_planning" }
    ]
  },
  {
    id: "public-transport",
    title: "Public Transport Planning",
    icon: "TRN",
    scenarioId: "gps-navigation",
    difficulty: "Advanced",
    tags: ["Transit", "Schedules", "Mobility"],
    shortExplanation:
      "Transit route planners combine walking links, stops, lines, transfers, and timetables into a graph-like model.",
    whereUsed: ["Trip planners", "Transit agency tools", "Mobility apps", "Schedule analysis"],
    realLifeExample:
      "Your route planner may choose a transfer if it reduces waiting time compared with staying on one slow bus.",
    graphModel: {
      nodes: "Stops, stations, platforms, transfer points, or time-expanded stop events.",
      edges: "Vehicle trips, walking transfers, waiting arcs, or line changes.",
      weights: "Travel time, waiting time, transfer penalty, fare cost, or reliability risk."
    },
    whyUseful:
      "Dijkstra helps explain the core shortest-path idea behind finding low-cost journeys through a transit graph.",
    limitations:
      "Timetables make the graph time-dependent, so transit systems often use specialized algorithms and schedule-aware models.",
    analogy:
      "It is like picking a path through a school timetable where waiting for the next class counts as part of the cost.",
    keyIdea:
      "In public transport, waiting and transfers can be just as important as travel distance.",
    thinkLikeGraph:
      "Model not only places, but also time: a stop at 08:10 and the same stop at 08:20 may act like different graph states.",
    miniChallenge:
      "A route has fewer stops but a 20-minute wait. Another has more stops but no wait. Which weight should decide?",
    checkPrompt:
      "Why are public transport graphs harder than simple road graphs?",
    sources: [
      { title: "GTFS Static Overview", url: "https://developers.google.com/transit/gtfs" },
      { title: "OpenTripPlanner documentation", url: "https://docs.opentripplanner.org/en/dev-2.x/" },
      { title: "Journey planner", url: "https://en.wikipedia.org/wiki/Journey_planner" }
    ]
  },
  {
    id: "robotics-path-planning",
    title: "Robotics Path Planning",
    icon: "BOT",
    scenarioId: "warehouse-logistics",
    difficulty: "Intermediate",
    tags: ["Robotics", "Autonomy", "Safety"],
    shortExplanation:
      "Robots plan paths through maps while avoiding obstacles, unsafe zones, and high-energy movements.",
    whereUsed: ["Warehouse robots", "Service robots", "Autonomous mobile robots", "Research robots"],
    realLifeExample:
      "A warehouse robot may avoid a crowded aisle and take a safer path that protects people and cargo.",
    graphModel: {
      nodes: "Grid cells, navigation waypoints, poses, or map regions.",
      edges: "Possible robot movements between neighboring states.",
      weights: "Distance, energy, obstacle proximity, turning cost, slope, or safety risk."
    },
    whyUseful:
      "Dijkstra is reliable for finding minimum-cost paths on occupancy grids or waypoint graphs with non-negative costs.",
    limitations:
      "Robots often use A*, sampling-based planners, dynamic obstacle avoidance, and local controllers for real-time motion.",
    analogy:
      "It is like a vacuum robot choosing rooms while avoiding furniture and slippery floors.",
    keyIdea:
      "Robotics path cost can combine movement effort and safety, not only distance.",
    thinkLikeGraph:
      "Turn the map into possible robot states and make unsafe or difficult moves more expensive.",
    miniChallenge:
      "How would you increase the weight near humans so a robot keeps a safe distance?",
    checkPrompt:
      "Why does a robot need both a global path and local obstacle avoidance?",
    sources: [
      { title: "Nav2 documentation", url: "https://docs.nav2.org/" },
      { title: "Pathfinding", url: "https://en.wikipedia.org/wiki/Pathfinding" },
      { title: "Red Blob Games: A* introduction", url: "https://www.redblobgames.com/pathfinding/a-star/introduction.html" }
    ]
  },
  {
    id: "data-center-routing",
    title: "Data Center Traffic Routing",
    icon: "DC",
    scenarioId: "internet-routing",
    difficulty: "Advanced",
    tags: ["Cloud", "Networks", "Infrastructure"],
    shortExplanation:
      "Cloud and data center networks route traffic between services while balancing latency, capacity, and reliability.",
    whereUsed: ["Cloud VPCs", "Load-balanced services", "Service meshes", "Data center fabrics"],
    realLifeExample:
      "A cloud platform sends service traffic through route tables and network paths that avoid unavailable or overloaded links.",
    graphModel: {
      nodes: "Subnets, gateways, switches, services, regions, or availability zones.",
      edges: "Network links, peering connections, gateways, or virtual routes.",
      weights: "Latency, utilization, failure risk, bandwidth cost, or policy penalty."
    },
    whyUseful:
      "Shortest-path thinking helps you reason about how traffic moves through complex infrastructure.",
    limitations:
      "Production cloud routing also uses policy rules, route tables, load balancers, SDN controllers, and failure recovery logic.",
    analogy:
      "It is like moving between classrooms through corridors while avoiding overloaded hallways.",
    keyIdea:
      "In infrastructure, 'shortest' can mean low latency, low congestion, or policy-compliant.",
    thinkLikeGraph:
      "Model services and gateways as nodes, then encode network health and policy as edge costs.",
    miniChallenge:
      "If a low-latency link is almost full, should the routing weight increase? What metric would you add?",
    checkPrompt:
      "How is cloud routing different from a single road-map shortest path?",
    sources: [
      { title: "Google Cloud VPC routes", url: "https://cloud.google.com/vpc/docs/routes" },
      { title: "AWS VPC route tables", url: "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html" },
      { title: "Cloudflare: What is routing?", url: "https://www.cloudflare.com/learning/network-layer/what-is-routing/" }
    ]
  },
  {
    id: "airline-railway",
    title: "Airline or Railway Route Planning",
    icon: "AIR",
    scenarioId: "gps-navigation",
    difficulty: "Advanced",
    tags: ["Transport", "Scheduling", "Networks"],
    shortExplanation:
      "Airline and railway planners reason about networks of stations, airports, connections, costs, and schedules.",
    whereUsed: ["Flight planning", "Rail journey planning", "Timetable design", "Passenger connection tools"],
    realLifeExample:
      "A traveler may prefer a one-transfer rail route with a reliable connection over a direct route that arrives too late.",
    graphModel: {
      nodes: "Airports, rail stations, platforms, waypoints, or scheduled departure events.",
      edges: "Flights, rail segments, transfers, layovers, or operational links.",
      weights: "Travel time, fare, fuel burn, delay risk, transfer time, or operational cost."
    },
    whyUseful:
      "Dijkstra explains the foundation of choosing low-cost routes through a transportation network.",
    limitations:
      "Real airline and railway planning is time-dependent and constraint-heavy, often requiring schedule optimization and multi-criteria search.",
    analogy:
      "It is like choosing classes across a campus where each hallway opens only at certain times.",
    keyIdea:
      "The route network is only half the problem; schedules and transfer reliability can change the best path.",
    thinkLikeGraph:
      "Represent not just locations, but possible connection events, then weight edges by time, cost, and risk.",
    miniChallenge:
      "A cheaper route has a risky five-minute transfer. A more expensive route has a safe transfer. What edge weight should capture that risk?",
    checkPrompt:
      "Why might a passenger route planner need more than one 'best' answer?",
    sources: [
      { title: "Flight planning", url: "https://en.wikipedia.org/wiki/Flight_planning" },
      { title: "Route planning", url: "https://en.wikipedia.org/wiki/Route_planning" },
      { title: "Shortest path problem", url: "https://en.wikipedia.org/wiki/Shortest_path_problem" }
    ]
  }
];
