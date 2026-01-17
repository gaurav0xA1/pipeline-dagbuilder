//react hooks
import { useState, useCallback } from 'react'

// react flow components 
import {
  Position,
  ReactFlow,
  addEdge,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges
} from "@xyflow/react";

//react flow styles
import "@xyflow/react/dist/style.css";

//CSS
import './App.css'


function App() {
  //store all your nodes
  const [nodes, setNodes] = useState([]);

  //stores connectipns between nodes
  const [edges, setEdges] = useState([]);

  //counter for unique Ids
  const [nodeId, setNodeId] = useState(1);

  const addNode = () => {

    const newNode = {
      id: String(nodeId),
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      data: { label: `Node ${nodeId}` },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };

    //step 2 : Add to the nodes array
    setNodes((prevNodes) => [...prevNodes, newNode]);

    //step 3 : Increment ID for the next node
    setNodeId((prevId) => prevId + 1);
  };

  const onConnect = useCallback(
    (params) => {
      if (wouldCreateCycle(params.source, params.target)) {
        alert("⚠️ Cannot connect: This would create a loop!");
        return;
      }
      setEdges((eds) => addEdge(params, eds));
    },
    [edges, setEdges] // Make sure 'edges' is in the dependency array
  );

  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );


  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );


  const autoLayout = () => {
    setNodes((prevNodes) =>
      prevNodes.map((node, index) => ({
        ...node,                    // Keep id, data, type, etc.
        position: {
          x: 300,                   // All nodes centered at x=300
          y: index * 120,           // Stack vertically, 120px apart
        },
      }))
    );
  };


  const wouldCreateCycle = (source, target) => {
    if (source === target) return true;

    const stack = [target];
    const visited = new Set(); // Fixed 'S' typo

    while (stack.length > 0) {
      const currentNode = stack.pop();

      if (!visited.has(currentNode)) {
        visited.add(currentNode);

        // 1. Get all outgoing edges
        const outEdges = edges.filter((edge) => edge.source === currentNode);

        for (const edge of outEdges) {
          // 2. If we reach the starting 'source', it's a loop!
          if (edge.target === source) return true;

          // 3. Keep searching from the next node
          stack.push(edge.target);
        }
      }
    }
    return false;
  };

  return (
    <div className="app-wrapper">
      <div className="buttons">
        <button onClick={addNode}>Add Node</button>
        <button onClick={autoLayout}>Auto Layout</button>
      </div>

      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}

export default App
