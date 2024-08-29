'use client';

import {
  addEdge,
  Background,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect } from 'react';
import {
  CentralNode,
  TextUpdaterNode
} from './reactflow/customnodes';

const getLayoutedElements = (nodes: any, edges: any) => {
  return { nodes, edges };
};

const initialNodes = [
    { 
      id: '1', 
      type: 'textUpdater', 
      position: { x: 0, y: 200 }, 
      data: { header:'User Input', value: 'Translate french to succinct english' } 
    },
    // { id: '2', type: 'textUpdater' , position: { x: 1100, y: 400 }, data: { header:'Examples', value: 
    //   <div>
    //     <ol className='flex flex-col gap-2 overflow-hidden text-ellipsis whitespace-nowrap text-xs list-decimal list-inside'>
    //       {[
    //         "Bonjour -> Hello", 
    //         "Comment ça va? -> How are you?", 
    //         "Je suis un étudiant -> I am a student", 
    //         "..."
    //       ].map((example, index) => (
    //         <li key={index} className='px-2 bg-gray-100 border border-gray-200 rounded-md truncate'>{example}</li>
    //       ))}
    //     </ol>
    //   </div>
    //  }},
    //  { id: '3', type: 'textUpdater', position: { x: 500, y: 200 }, data: { header:'Evaluation Criteria', value: 'Ensure that it is succinct and that no other shorter variation exists.' } },
    { 
      id: '4', 
      type: 'CentralNode', 
      position: { x: 100, y: 350 }, 
      data: { header:'Composer', value: undefined } 
    },
];

const initialEdges = [
    { id: 'e1-4', source: '1', target: '4', animated: true },
];

const nodeTypes = {
    textUpdater: TextUpdaterNode,
    CentralNode: CentralNode,
};

const proOptions = { hideAttribution: true };

function LandingFlowComponent() {

  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onLayout = useCallback(() => {
    const layouted = getLayoutedElements(nodes, edges);

    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);

    window.requestAnimationFrame(() => {
      fitView();
    });
  }, [nodes, edges]);

  // const onConnect = useCallback(
  //   (params: any) => setEdges((eds) => addEdge(params, eds)),
  //   [setEdges],
  // );

  useEffect(() => {
    onLayout();
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }} className='bg-primary'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        fitView
      >
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default function LandingFlow() {
  return (
    <ReactFlowProvider>
      <LandingFlowComponent />
    </ReactFlowProvider>
  );
}