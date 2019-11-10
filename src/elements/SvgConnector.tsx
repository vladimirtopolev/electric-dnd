import React from 'react';
import {Connector, Element} from '../types';

export default ({connection: {first, second}, elements}: { connection: Connector, elements: Element[] }) => {
    const element1 = elements.find(el => el.id === first.element.id) || {x: 0, y: 0};
    const element2 = elements.find(el => el.id === second.element.id) || {x: 0, y: 0};

    const connector1 = first.element.getConnectors()[first.connectorPointIndex];
    const connector2 = second.element.getConnectors()[second.connectorPointIndex];

    const x1 = connector1.x + element1.x;
    const y1 = connector1.y + element1.y;
    const x2 = connector2.x + element2.x;
    const y2 = connector2.y + element2.y;

    return (
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth="3"/>
    );
};
