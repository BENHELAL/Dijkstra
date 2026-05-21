import { edgeId, scenarios } from "./scenarios";

const smartCityScenario = scenarios[0];

export const nodeOrder = smartCityScenario.nodes.map((node) => node.id);
export const roadNodes = smartCityScenario.nodes;
export const roadEdges = smartCityScenario.edges;
export const optimalRouteNodes = ["S", "A", "C", "D", "T"];
export const optimalRouteEdges = optimalRouteNodes
  .slice(0, -1)
  .map((node, index) => edgeId(node, optimalRouteNodes[index + 1]));
export { edgeId };
