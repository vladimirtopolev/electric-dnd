import React from 'react';
import {ConnectorPoint, Point} from '../types';

export default ({firstPointConnector, currentMousePosition}
                    : { firstPointConnector: ConnectorPoint| undefined, currentMousePosition: Point|undefined }) => {
    if (!firstPointConnector || !currentMousePosition) {
        return null;
    }
    const {element, connectorPointIndex: connectorIndex} = firstPointConnector;
    const {x: x2, y: y2} = currentMousePosition;
    const connectors = element.getConnectors();
    const x1 = element.x + connectors[connectorIndex].x;
    const y1 = element.y + connectors[connectorIndex].y;
    return (
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth="3"/>
    );
};
