# Dijkstra Learning Lab

Interactive React + TypeScript learning website for Dijkstra's algorithm.

The app started as an IoT energy-aware route planner and now includes a broader student learning workflow:

- Learning dashboard with objectives and guided entry points
- Interactive Dijkstra route planner with play, pause, step, reset, and final route replay
- Multiple graph scenarios:
  - IoT smart city route planner
  - Internet packet routing
  - GPS navigation map
  - Warehouse logistics
  - Game map pathfinding
- Scenario-specific edge metadata and weights
- Beginner-friendly explanation panel for every algorithm step
- Real-world application cards with "Try scenario" actions
- 10-question quiz with instant feedback and final score
- Local browser upload for PDF, PPT, and PPTX course materials
- Scenario-specific student notes saved in localStorage

## Run locally

From this folder:

```powershell
cd C:\Users\Sbenhelalmehd\grap
$env:Path = "$PWD\.tools\node-v24.15.0-win-x64;$env:Path"
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

If port 5173 is already in use, Vite will print the next available local URL.

## Build

```powershell
$env:Path = "$PWD\.tools\node-v24.15.0-win-x64;$env:Path"
npm run build
```

## Notes

This is a frontend-only Vite app. Course material files are not uploaded to a server. Metadata is stored locally in the browser, and PDF previews use temporary object URLs for the current session.
