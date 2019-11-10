import React from 'react';
import {Point} from '../types';

export default ({start, end}:{start: Point, end: Point | undefined}) => {
    if (!start || !end) {
        return null;
    }
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);

    return <rect x={x}
                 y={y}
                 width={Math.abs(end.x - start.x)}
                 height={Math.abs(end.y - start.y)}
                 strokeWidth={2} strokeDasharray={4} stroke="red" fill="none"/>;
}
