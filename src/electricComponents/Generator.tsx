import React from 'react';
import {Element} from '../types'

export default {
    x: 0,
    y: 0,
    rotate: 0,
    id: new Date().getUTCMilliseconds().toString(),
    getConnectors: () => {
        return [{
            x: 20,
            y: 0
        }];
    },
    renderBorderArea: () => {
        return <rect x={-2} y={-2} width={44} height={54} strokeDasharray={4} strokeWidth={2} stroke="red" fill="none"/>
    },
    render: () => (
        <>
            <line x1={20} y1={0} x2={20} y2={10} stroke="black" strokeWidth="3"/>
            <circle cx={20} cy={30} r={20}
                    stroke="black" strokeWidth="3" fill="#fff" fillOpacity={0}/>
        </>
    )
} as Element;
