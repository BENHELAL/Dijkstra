import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { DijkstraStep, GraphEdge, GraphNode, GraphScenario } from "../types";

interface RoadNetworkProps {
  scenario: GraphScenario;
  step: DijkstraStep;
  playbackSpeed: number;
  routeReplayKey: number;
  showDetails: boolean;
}

interface VehiclePose {
  x: number;
  y: number;
  angle: number;
}

const viewBox = { width: 1040, height: 620 };

function nodeVisualState(node: GraphNode, step: DijkstraStep) {
  const isCurrent = step.currentNode === node.id;
  const isVisited = step.visited.includes(node.id);
  const isFinal = step.finalPathNodes.includes(node.id);
  const isUpdated = step.updatedNode === node.id;

  if (isCurrent) {
    return { fill: "#2563eb", stroke: "#1d4ed8", text: "#ffffff", ring: "#93c5fd", scale: 1.1 };
  }

  if (isFinal) {
    return { fill: "#fff7ed", stroke: "#f97316", text: "#1f2937", ring: "#fdba74", scale: 1.05 };
  }

  if (node.role === "start") {
    return {
      fill: "#dcfce7",
      stroke: "#16a34a",
      text: "#064e3b",
      ring: "#86efac",
      scale: isUpdated ? 1.08 : 1
    };
  }

  if (node.role === "destination") {
    return { fill: "#fee2e2", stroke: "#dc2626", text: "#7f1d1d", ring: "#fca5a5", scale: 1 };
  }

  if (node.role === "busy") {
    return { fill: "#fff1f2", stroke: "#fb7185", text: "#881337", ring: "#fecdd3", scale: isUpdated ? 1.06 : 1 };
  }

  if (node.role === "safe") {
    return { fill: "#ecfdf5", stroke: "#10b981", text: "#064e3b", ring: "#a7f3d0", scale: isUpdated ? 1.06 : 1 };
  }

  if (isVisited) {
    return { fill: "#e0f2fe", stroke: "#0284c7", text: "#0c4a6e", ring: "#7dd3fc", scale: 1 };
  }

  if (isUpdated) {
    return { fill: "#fef3c7", stroke: "#f59e0b", text: "#78350f", ring: "#fbbf24", scale: 1.07 };
  }

  return { fill: "#ffffff", stroke: "#94a3b8", text: "#1f2937", ring: "transparent", scale: 1 };
}

function mapNodeById(scenario: GraphScenario, id?: string) {
  return scenario.nodes.find((node) => node.id === id);
}

function CityBackground({ domain }: { domain: string }) {
  const blocks = [
    { x: 54, y: 72, w: 146, h: 82, tone: "blue" },
    { x: 96, y: 470, w: 132, h: 74, tone: "green" },
    { x: 410, y: 286, w: 112, h: 70, tone: "amber" },
    { x: 462, y: 58, w: 150, h: 72, tone: "blue" },
    { x: 762, y: 52, w: 148, h: 86, tone: "rose" },
    { x: 804, y: 452, w: 132, h: 76, tone: "green" }
  ];

  const fillFor = (tone: string) => {
    if (tone === "green") return "#dff4e4";
    if (tone === "amber") return "#fff2c7";
    if (tone === "rose") return "#ffe4e6";
    return "#e6edf4";
  };

  return (
    <g>
      <rect width={viewBox.width} height={viewBox.height} rx="34" fill="url(#mapGradient)" />
      <path d="M35 560 C260 512 370 584 555 542 C720 504 808 535 995 474" stroke="#d9ecdf" strokeWidth="44" fill="none" opacity="0.22" />
      <path d="M40 92 C230 150 350 72 520 136 C720 212 830 154 984 215" stroke="#dce9f7" strokeWidth="34" fill="none" opacity="0.25" />

      {blocks.map((block) => (
        <rect
          key={`${block.x}-${block.y}`}
          x={block.x}
          y={block.y}
          width={block.w}
          height={block.h}
          rx="18"
          fill={fillFor(block.tone)}
          stroke="#cfdae7"
          strokeWidth="1.2"
          opacity="0.28"
        />
      ))}

      <g opacity="0.07">
        {Array.from({ length: 8 }, (_, index) => (
          <path key={`grid-h-${index}`} d={`M 50 ${88 + index * 62} H 995`} stroke="#94a3b8" strokeDasharray="4 22" />
        ))}
        {Array.from({ length: 10 }, (_, index) => (
          <path key={`grid-v-${index}`} d={`M ${88 + index * 90} 54 V 566`} stroke="#94a3b8" strokeDasharray="4 22" />
        ))}
      </g>

      <text x="50" y="590" className="fill-slate-500 text-[11px] font-black uppercase tracking-[0.18em]">
        Scenario layer: {domain}
      </text>
    </g>
  );
}

function WirelessArcs({ x, y, color = "#0891b2", active = false }: { x: number; y: number; color?: string; active?: boolean }) {
  return (
    <g opacity={active ? 0.9 : 0.48}>
      {[0, 1, 2].map((index) => (
        <motion.path
          key={index}
          d={`M ${x - 8 - index * 6} ${y - index * 8} C ${x - 4 - index * 5} ${y - 12 - index * 9}, ${x + 4 + index * 5} ${y - 12 - index * 9}, ${x + 8 + index * 6} ${y - index * 8}`}
          fill="none"
          stroke={color}
          strokeWidth="1.7"
          strokeLinecap="round"
          animate={active ? { opacity: [0.25, 0.9, 0.25] } : undefined}
          transition={active ? { duration: 2.1, repeat: Infinity, delay: index * 0.18 } : undefined}
        />
      ))}
    </g>
  );
}

function DataHub({ scenario, active }: { scenario: GraphScenario; active: boolean }) {
  return (
    <g transform="translate(40 36)" filter="url(#subtleShadow)">
      <rect width="246" height="68" rx="18" fill="#ffffff" stroke="#c7d7ea" strokeWidth="1.4" opacity="0.96" />
      <path d="M28 39 H66 C77 39 84 32 84 23 C84 14 77 8 68 9 C64 1 52 3 49 13 C39 12 30 19 30 28 C30 34 31 38 28 39 Z" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.35" />
      <motion.circle
        cx="106"
        cy="27"
        r="5"
        fill={active ? "#22c55e" : "#94a3b8"}
        animate={active ? { opacity: [0.55, 1, 0.55] } : undefined}
        transition={active ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" } : undefined}
      />
      <text x="120" y="31" className="fill-slate-900 text-[15px] font-black">
        Weight Engine
      </text>
      <text x="28" y="58" className="fill-slate-500 text-[10px] font-black uppercase tracking-[0.12em]">
        {scenario.weightLabel}
      </text>
    </g>
  );
}

function ContextLayer({
  scenario,
  activeTarget,
  showDetails,
  active
}: {
  scenario: GraphScenario;
  activeTarget: GraphNode | undefined;
  showDetails: boolean;
  active: boolean;
}) {
  const hub = { x: 250, y: 64 };

  return (
    <g>
      <DataHub scenario={scenario} active={active || showDetails} />
      {showDetails && (
        <>
          <g transform="translate(292 176)" opacity={active ? 0.94 : 0.68}>
            <rect x="-15" y="-13" width="30" height="26" rx="8" fill="#f8fafc" stroke="#10b981" strokeWidth="1.4" />
            <path d="M-8 5 H8 M-6 -2 H6 M-3 -8 H3" stroke="#047857" strokeWidth="1.6" strokeLinecap="round" />
            <WirelessArcs x={23} y={-13} color="#0ea5e9" active={active} />
          </g>
          <g transform="translate(690 294)" opacity={active ? 0.94 : 0.66}>
            <rect x="-16" y="-12" width="32" height="24" rx="8" fill="#f8fafc" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="1" cy="0" r="3" fill="#38bdf8" stroke="#0369a1" strokeWidth="1" />
          </g>
        </>
      )}

      {activeTarget && (
        <g opacity={showDetails ? 0.68 : 0.32}>
          <motion.path
            d={`M ${hub.x} ${hub.y} C ${hub.x + 140} ${hub.y + 12}, ${activeTarget.x - 150} ${activeTarget.y - 72}, ${activeTarget.x} ${activeTarget.y}`}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeDasharray="4 13"
            animate={{ strokeDashoffset: [34, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
          />
          <motion.circle
            cx={activeTarget.x}
            cy={activeTarget.y}
            r="11"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="1.2"
            animate={{ r: [9, 16, 9], opacity: [0.34, 0.06, 0.34] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>
      )}
    </g>
  );
}

function Vehicle({ pose }: { pose: VehiclePose }) {
  return (
    <motion.g
      animate={{ x: pose.x, y: pose.y, rotate: pose.angle }}
      transition={{ duration: 0.08, ease: "linear" }}
      style={{ originX: "50%", originY: "50%" }}
      filter="url(#vehicleShadow)"
    >
      <rect x="-22" y="-11.5" width="44" height="23" rx="9" fill="url(#vehicleGradient)" stroke="#064e3b" strokeWidth="1.6" />
      <path d="M-5 -8.5 H9.5 C14 -8.5 17 -4.8 17 0 C17 4.8 14 8.5 9.5 8.5 H-5 C-10.5 8.5 -13.5 4.8 -13.5 0 C-13.5 -4.8 -10.5 -8.5 -5 -8.5 Z" fill="#cffafe" stroke="#0f766e" strokeWidth="1.1" />
      <circle cx="17" cy="0" r="3" fill="#f8fafc" />
      <circle cx="-13" cy="-12.5" r="2.8" fill="#111827" />
      <circle cx="13" cy="-12.5" r="2.8" fill="#111827" />
      <circle cx="-13" cy="12.5" r="2.8" fill="#111827" />
      <circle cx="13" cy="12.5" r="2.8" fill="#111827" />
      <motion.circle
        cx="0"
        cy="0"
        r="25"
        fill="none"
        stroke="#67e8f9"
        strokeWidth="1.05"
        animate={{ r: [25, 33, 25], opacity: [0.09, 0.28, 0.09] }}
        transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }}
      />
      <WirelessArcs x={0} y={-22} color="#06b6d4" active />
    </motion.g>
  );
}

function CostBadge({
  x,
  y,
  value,
  active,
  final,
  muted
}: {
  x: number;
  y: number;
  value: number;
  active: boolean;
  final: boolean;
  muted: boolean;
}) {
  const width = active || final ? 38 : 34;
  const height = active || final ? 26 : 24;
  const stroke = active ? "#7c3aed" : final ? "#f97316" : "#cbd5e1";
  const textColor = active ? "#5b21b6" : final ? "#9a3412" : "#334155";

  return (
    <motion.g
      animate={{ opacity: muted ? 0.42 : 0.98, scale: active || final ? 1.06 : 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      filter="url(#badgeShadow)"
    >
      <rect
        x={x - width / 2}
        y={y - height / 2}
        width={width}
        height={height}
        rx="9"
        fill="#ffffff"
        stroke={stroke}
        strokeWidth={active || final ? 1.7 : 1.2}
      />
      <text x={x} y={y + 4.5} textAnchor="middle" fill={textColor} className="text-[12px] font-black">
        {value}
      </text>
    </motion.g>
  );
}

function EdgeTooltip({
  edge,
  scenario,
  showDetails
}: {
  edge: GraphEdge;
  scenario: GraphScenario;
  showDetails: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      className="pointer-events-none absolute right-4 top-4 max-w-sm rounded-xl border border-slate-200 bg-white/95 p-3 text-sm shadow-xl backdrop-blur"
    >
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-700">
        Edge {edge.from} {"->"} {edge.to}
      </p>
      <p className="mt-1 font-black text-slate-950">
        {scenario.weightLabel}: {edge.weight}
      </p>
      <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">{edge.interpretation}</p>
      {showDetails && (
        <div className="mt-2 grid grid-cols-2 gap-1 text-xs font-bold text-slate-600">
          {Object.entries(edge.metadata).map(([key, value]) => (
            <span key={key}>
              {key}: {value}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function VehicleSignalLink({
  pose,
  target,
  show
}: {
  pose: VehiclePose;
  target: GraphNode | undefined;
  show: boolean;
}) {
  if (!show || !target) {
    return null;
  }

  const controlX = (pose.x + target.x) / 2;
  const controlY = Math.min(pose.y, target.y) - 60;

  return (
    <motion.path
      d={`M ${pose.x} ${pose.y - 18} Q ${controlX} ${controlY} ${target.x} ${target.y}`}
      fill="none"
      stroke="#06b6d4"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeDasharray="5 10"
      animate={{ strokeDashoffset: [30, 0], opacity: [0.18, 0.72, 0.18] }}
      transition={{ duration: 2.1, repeat: Infinity, ease: "linear" }}
    />
  );
}

export function RoadNetwork({
  scenario,
  step,
  playbackSpeed,
  routeReplayKey,
  showDetails
}: RoadNetworkProps) {
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const startNode = mapNodeById(scenario, scenario.startNode) ?? scenario.nodes[0];
  const targetNode = mapNodeById(scenario, scenario.targetNode) ?? scenario.nodes[scenario.nodes.length - 1];
  const parkedPose = useMemo<VehiclePose>(
    () => ({ x: startNode.x - 54, y: startNode.y + 66, angle: -9 }),
    [startNode.x, startNode.y]
  );
  const arrivalPose = useMemo<VehiclePose>(
    () => ({ x: targetNode.x - 55, y: targetNode.y + 31, angle: 8 }),
    [targetNode.x, targetNode.y]
  );
  const [vehiclePose, setVehiclePose] = useState<VehiclePose>(parkedPose);

  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const frameRef = useRef<number | null>(null);

  const hoveredEdge = useMemo(
    () => scenario.edges.find((edge) => edge.id === hoveredEdgeId) ?? null,
    [hoveredEdgeId, scenario.edges]
  );
  const activeEdge = scenario.edges.find((edge) => edge.id === step.activeEdgeId);
  const activeTarget = activeEdge ? mapNodeById(scenario, activeEdge.to) : undefined;
  const signalTarget = activeTarget ?? (step.phase === "final" ? targetNode : startNode);

  useEffect(() => {
    setVehiclePose(parkedPose);
  }, [parkedPose, scenario.id]);

  useEffect(() => {
    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (step.phase !== "final" || step.finalPathEdges.length === 0) {
      setVehiclePose(parkedPose);
      return;
    }

    const pathInfo = step.finalPathEdges
      .map((edge) => {
        const path = pathRefs.current[edge];
        return path ? { path, length: path.getTotalLength() } : null;
      })
      .filter(Boolean) as { path: SVGPathElement; length: number }[];

    if (pathInfo.length === 0) {
      setVehiclePose(arrivalPose);
      return;
    }

    const totalLength = pathInfo.reduce((sum, item) => sum + item.length, 0);
    const duration = 8600 / playbackSpeed;
    const startTime = performance.now();

    const poseOnEdge = (distance: number): VehiclePose => {
      let traveled = 0;
      let active = pathInfo[pathInfo.length - 1];

      for (const item of pathInfo) {
        if (traveled + item.length >= distance) {
          active = item;
          break;
        }
        traveled += item.length;
      }

      const localDistance = Math.max(0, Math.min(active.length, distance - traveled));
      const point = active.path.getPointAtLength(localDistance);
      const nextPoint = active.path.getPointAtLength(Math.min(active.length, localDistance + 3));
      const angle = (Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180) / Math.PI;

      return { x: point.x, y: point.y, angle };
    };

    const tick = (now: number) => {
      const elapsed = Math.min(now - startTime, duration);
      const progress = elapsed / duration;
      const distance = Math.min(progress / 0.92, 1) * totalLength;
      const pathPose = poseOnEdge(distance);

      if (progress > 0.92) {
        const localProgress = (progress - 0.92) / 0.08;
        const ease = 1 - Math.pow(1 - localProgress, 3);
        setVehiclePose({
          x: pathPose.x + (arrivalPose.x - pathPose.x) * ease,
          y: pathPose.y + (arrivalPose.y - pathPose.y) * ease,
          angle: pathPose.angle + (arrivalPose.angle - pathPose.angle) * ease
        });
      } else {
        setVehiclePose(pathPose);
      }

      if (elapsed < duration) {
        frameRef.current = window.requestAnimationFrame(tick);
      } else {
        setVehiclePose(arrivalPose);
      }
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [
    arrivalPose,
    parkedPose,
    playbackSpeed,
    routeReplayKey,
    step.finalPathEdges,
    step.phase,
    step.id
  ]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.16)]">
      <svg viewBox={`0 0 ${viewBox.width} ${viewBox.height}`} className="aspect-[1040/620] w-full">
        <defs>
          <linearGradient id="mapGradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#eef7ff" />
            <stop offset="50%" stopColor="#f2f8f3" />
            <stop offset="100%" stopColor="#fff7ed" />
          </linearGradient>
          <linearGradient id="vehicleGradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>
          <filter id="vehicleShadow" x="-80%" y="-80%" width="260%" height="260%">
            <feDropShadow dx="0" dy="9" stdDeviation="7" floodColor="#0f172a" floodOpacity="0.28" />
          </filter>
          <filter id="subtleShadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0f172a" floodOpacity="0.10" />
          </filter>
          <filter id="badgeShadow" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.12" />
          </filter>
          <filter id="nodeShadow" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#0f172a" floodOpacity="0.13" />
          </filter>
          <marker id="arrowNormal" markerWidth="13" markerHeight="13" refX="10" refY="6.5" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 13 6.5 L 0 13 z" fill="#f8fafc" opacity="0.82" />
          </marker>
          <marker id="arrowActive" markerWidth="15" markerHeight="15" refX="11.5" refY="7.5" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 15 7.5 L 0 15 z" fill="#ffffff" stroke="#7c3aed" strokeWidth="1.4" />
          </marker>
          <marker id="arrowFinal" markerWidth="15" markerHeight="15" refX="11.5" refY="7.5" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 15 7.5 L 0 15 z" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.4" />
          </marker>
        </defs>

        <CityBackground domain={scenario.domain} />
        <ContextLayer
          scenario={scenario}
          activeTarget={activeTarget}
          showDetails={showDetails}
          active={Boolean(step.activeEdgeId) || step.phase === "final"}
        />

        <g>
          {scenario.edges.map((edge) => {
            const isActive = step.activeEdgeId === edge.id;
            const finalIndex = step.finalPathEdges.indexOf(edge.id);
            const isFinal = finalIndex >= 0;
            const isKnownEdge = !isFinal && step.predecessors[edge.to] === edge.from && step.phase !== "intro";
            const isMuted = step.phase === "final" ? !isFinal : Boolean(step.activeEdgeId) && !isActive && !isKnownEdge;
            const marker = isFinal ? "url(#arrowFinal)" : isActive ? "url(#arrowActive)" : "url(#arrowNormal)";
            const edgeOpacity = isMuted ? 0.3 : isFinal || isActive ? 0.95 : isKnownEdge ? 0.72 : 0.66;
            const laneOpacity = isMuted ? 0.15 : isFinal || isActive ? 0.72 : 0.42;
            const edgeColor = isFinal ? "#f97316" : isActive ? "#7c3aed" : isKnownEdge ? "#38bdf8" : "#a8b2c0";
            const edgeWidth = isFinal ? 20 : isActive ? 18 : isKnownEdge ? 15 : 14;

            return (
              <g
                key={edge.id}
                onMouseEnter={() => setHoveredEdgeId(edge.id)}
                onMouseLeave={() => setHoveredEdgeId(null)}
                className="cursor-help"
              >
                <title>
                  {edge.from} to {edge.to}, weight {edge.weight}
                </title>
                <path d={edge.pathD} fill="none" stroke="transparent" strokeWidth="30" strokeLinecap="round" />
                <path d={edge.pathD} fill="none" stroke="#0f172a" strokeWidth="23" strokeLinecap="round" opacity={isMuted ? 0.025 : 0.07} />
                {isActive && (
                  <motion.path
                    d={edge.pathD}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="25"
                    strokeLinecap="round"
                    animate={{ opacity: [0.14, 0.24, 0.14] }}
                    transition={{ duration: 1.8 / playbackSpeed, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <motion.path
                  d={edge.pathD}
                  fill="none"
                  stroke={edgeColor}
                  strokeWidth={edgeWidth}
                  strokeLinecap="round"
                  opacity={edgeOpacity}
                  animate={{ stroke: edgeColor, opacity: edgeOpacity, strokeWidth: edgeWidth }}
                  transition={{ duration: 0.42, ease: "easeOut" }}
                />
                <path d={edge.pathD} fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeDasharray="12 18" opacity={laneOpacity} />

                {isActive && (
                  <motion.path
                    d={edge.pathD}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="16 28"
                    animate={{ strokeDashoffset: [80, 0] }}
                    transition={{ duration: 1.25 / playbackSpeed, repeat: Infinity, ease: "linear" }}
                  />
                )}

                {isFinal && (
                  <>
                    <motion.path
                      d={edge.pathD}
                      fill="none"
                      stroke="#fb923c"
                      strokeWidth="23"
                      strokeLinecap="round"
                      opacity="0.22"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.85 / playbackSpeed, delay: (finalIndex * 0.18) / playbackSpeed, ease: "easeOut" }}
                    />
                    <motion.path
                      d={edge.pathD}
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="7.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.85 / playbackSpeed, delay: (finalIndex * 0.18) / playbackSpeed, ease: "easeOut" }}
                    />
                  </>
                )}

                <path
                  ref={(element) => {
                    pathRefs.current[edge.id] = element;
                  }}
                  d={edge.pathD}
                  fill="none"
                  stroke={isFinal ? "#fff7ed" : isActive ? "#f5f3ff" : "#f8fafc"}
                  strokeWidth={isActive || isFinal ? 3.1 : 2.2}
                  strokeLinecap="round"
                  opacity={isMuted ? 0.32 : isFinal || isActive ? 0.88 : 0.7}
                  markerEnd={marker}
                />

                <CostBadge x={edge.labelX} y={edge.labelY} value={edge.weight} active={isActive} final={isFinal} muted={isMuted} />
              </g>
            );
          })}
        </g>

        <g>
          {scenario.nodes.map((node) => {
            const visual = nodeVisualState(node, step);
            const isCurrent = step.currentNode === node.id;
            const isUpdated = step.updatedNode === node.id;
            const captionY = node.y < 260 ? -44 : node.role === "destination" ? 43 : 42;

            return (
              <g key={node.id} transform={`translate(${node.x} ${node.y})`}>
                <motion.g animate={{ scale: visual.scale }} transition={{ type: "spring", stiffness: 220, damping: 20 }} style={{ originX: "50%", originY: "50%" }}>
                  {isCurrent && (
                    <motion.circle
                      r="38"
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="2.6"
                      animate={{ opacity: [0.44, 0], scale: [0.92, 1.22] }}
                      transition={{ duration: 1.65 / playbackSpeed, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                  {isUpdated && (
                    <motion.circle
                      r="35"
                      fill="#fbbf24"
                      initial={{ opacity: 0.24, scale: 0.86 }}
                      animate={{ opacity: [0.24, 0], scale: [0.92, 1.18] }}
                      transition={{ duration: 0.95 / playbackSpeed, repeat: 1, ease: "easeOut" }}
                    />
                  )}
                  <circle r="32" fill={visual.ring} opacity="0.16" />
                  <circle r="27" fill={visual.fill} stroke={visual.stroke} strokeWidth="3.1" filter="url(#nodeShadow)" />
                  <text y="7" textAnchor="middle" className="text-[18px] font-black" fill={visual.text}>
                    {node.id}
                  </text>
                  <text y={captionY} textAnchor="middle" className="fill-slate-700 text-[9.5px] font-black uppercase tracking-[0.06em]" opacity="0.82">
                    {node.shortLabel}
                  </text>
                </motion.g>
              </g>
            );
          })}
        </g>

        <VehicleSignalLink pose={vehiclePose} target={signalTarget} show={showDetails} />
        <Vehicle pose={vehiclePose} />
      </svg>

      <AnimatePresence>
        {hoveredEdge && <EdgeTooltip edge={hoveredEdge} scenario={scenario} showDetails={showDetails} />}
      </AnimatePresence>
    </div>
  );
}
