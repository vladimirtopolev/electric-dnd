import React from 'react';
import {Point, WorkspacePosition} from '../types';

export default ({start, end, workspacePosition}:{start: Point, end: Point | undefined, workspacePosition: WorkspacePosition}) => {
    if (!start || !end) {
        return null;
    }

    const {scale} = workspacePosition;
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);

    return <rect x={x/scale}
                 y={y/scale}
                 width={Math.abs(end.x - start.x)/scale}
                 height={Math.abs(end.y - start.y)/scale}
                 strokeWidth={2} strokeDasharray={4} stroke="red" fill="none"/>;
}
