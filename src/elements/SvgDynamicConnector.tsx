import React from 'react';
import {ConnectorPoint, Point, WorkspacePosition} from '../types';
import {fromCartesianToPolarVector, fromPolarToCartesianVector} from "../helpers/vectors";

export default ({firstPointConnector, currentMousePosition, workspacePosition}
                    : {
    firstPointConnector: ConnectorPoint | undefined | null,
    currentMousePosition: Point | undefined,
    workspacePosition: WorkspacePosition
}) => {
    if (!firstPointConnector || !currentMousePosition) {
        return null;
    }
    const {element, connectorPointIndex: connectorIndex} = firstPointConnector;
    const {scale, x: workspaceX, y: workspaceY} = workspacePosition;
    const {x: x2, y: y2} = currentMousePosition;
    const pointConnector = element.getConnectors()[connectorIndex];

    const polarConnector = fromCartesianToPolarVector({dx: pointConnector.x, dy: pointConnector.y});
    const cartesianConnectorWithRotation =
        fromPolarToCartesianVector({...polarConnector, deg: polarConnector.deg + element.rotate});

    const x1 = cartesianConnectorWithRotation.dx + element.x;
    const y1 = cartesianConnectorWithRotation.dy + element.y;
    return (
        <line x1={x1} y1={y1} x2={x2/scale - workspaceX} y2={y2/scale - workspaceY} stroke="black" strokeWidth="3"/>
    );
};
