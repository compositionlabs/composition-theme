'use client';

import React, { useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Handle, Position } from '@xyflow/react';
 
import '@xyflow/react/dist/style.css';
 
function TextUpdaterNode({ data }: any) {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);
 
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div>
        <Card>
          <CardHeader>
            <CardTitle>{data.header}</CardTitle>
          </CardHeader>
          <CardContent>
            {data.value}
          </CardContent>
        </Card>
      </div>
      <Handle type="source" position={Position.Right} id="a" />
    </>
  );
}

const initialNodes = [
    { id: '1', type: 'textUpdater', position: { x: 500, y: 200 }, data: { header:'Task', value: 'Translate french to succinct english' } },
    { id: '2', type: 'textUpdater' , position: { x: 1100, y: 400 }, data: { header:'Examples', value: '2' } },
    { id: '3', type: 'textUpdater' , position: { x: 1100, y: 500 }, data: { header:'Prompt Optimization', value: '2' } },
    { id: '4', type: 'textUpdater' , position: { x: 1100, y: 600 }, data: { header:'Few Shot Optimization', value: '2' } },
    { id: '5', type: 'textUpdater' , position: { x: 1100, y: 700 }, data: { header:'Model Optimization', value: '2' } }
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
];

const nodeTypes = {
    textUpdater: TextUpdaterNode,
};

const proOptions = { hideAttribution: true };

export default function LandingFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
 
  return (
    <div style={{ width: '100%', height: '100%' }} className='bg-primary'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
      >
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}