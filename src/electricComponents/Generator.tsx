import React from 'react';
import {Element} from '../types'

export default {
    x: 20,
    y: 20,
    rotate: 90,
    originX: 0,
    originY: 0,
    id: new Date().getUTCMilliseconds().toString(),
    getConnectors: () => {
        return [{
            x: 20,
            y: 0
        }];
    },
    getBorders: () => {
        return {dx: 40, dy: 50}
    },
    render: () => (
        <>
            <line x1={20} y1={0} x2={20} y2={10} stroke="black" strokeWidth="3"/>
            <circle cx={20} cy={30} r={20}
                    stroke="black" strokeWidth="3" fill="#fff" fillOpacity={0}/>
        </>
    )
} as Element;
