import React from 'react';
import {Element} from '../types'

export default {
    type: 'generator',
    x: 20,
    y: 20,
    rotate: 0,
    originX: 0,
    originY: 0,
    id: new Date().getUTCMilliseconds().toString(),
    getConnectors: () => {
        return [{
            x: 5,
            y: -1
        }];
    },
    getLabelPosition: () => {
        return {
            dx: 8,
            dy: 8,
        }
    },
    getBorders: () => {
        return {dx: 8, dy: 8}
    },
    render: () => (
        <>
            <circle cx={5} cy={5} r={3}
                    stroke="black" strokeWidth="3" fill="black"/>
        </>
    ),
    label: '',
    getInitLabel: (elements => {
        const targetElements = elements.filter(el => el.type === 'generator');
        return `G${targetElements.length}`;
    })
} as Element;
