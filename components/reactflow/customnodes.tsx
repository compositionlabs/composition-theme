'use client';

import { useCallback } from 'react';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { Handle, Position } from '@xyflow/react';
 
import '@xyflow/react/dist/style.css';

function CentralNode({ data }: any) {
  return (
    <div className=''>
      <Handle type="target" position={Position.Top} />
      <div className='rounded-md bg-white p-4 border-4 border-gray-200'>
        {data.header}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
 
function TextUpdaterNode({ data }: any) {
 
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className='w-72'>
        <Card className='overflow-hidden'>
          <CardHeader className='py-2 border-b bg-gray-100'>
            <CardTitle className='text-sm'>{data.header}</CardTitle>
          </CardHeader>
          <CardContent className='pt-4 text-xs'>
            {data.value}
          </CardContent>
        </Card>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}

export {
    CentralNode,
    TextUpdaterNode
};
