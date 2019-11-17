import React from 'react';
import {Connection, Element} from '../types';
import {fromCartesianToPolarVector, fromPolarToCartesianVector} from '../helpers/vectors';

export default ({connection, elements, onConnectorClick, selectedConnection}:
                    {
                        connection: Connection,
                        elements: Element[],
                        selectedConnection: Connection | undefined | null,
                        onConnectorClick: (connector: Connection) => void
                    }) => {
    const {first, second} = connection;
    const element1 = elements.find(el => el.id === first.element.id) || {x: 0, y: 0, rotate: 0};
    const element2 = elements.find(el => el.id === second.element.id) || {x: 0, y: 0, rotate: 0};
    const connector1 = first.element.getConnectors()[first.connectorPointIndex];
    const connector2 = second.element.getConnectors()[second.connectorPointIndex];

    const polarConnector1 = fromCartesianToPolarVector({dx: connector1.x, dy: connector1.y});
    const polarConnector2 = fromCartesianToPolarVector({dx: connector2.x, dy: connector2.y});

    const cartesianConnector1WithRotation =
        fromPolarToCartesianVector({...polarConnector1, deg: polarConnector1.deg + element1.rotate});
    const cartesianConnector2WithRotation =
        fromPolarToCartesianVector({...polarConnector2, deg: polarConnector2.deg + element2.rotate});

    const x1 = cartesianConnector1WithRotation.dx + element1.x;
    const y1 = cartesianConnector1WithRotation.dy + element1.y;
    const x2 = cartesianConnector2WithRotation.dx + element2.x;
    const y2 = cartesianConnector2WithRotation.dy + element2.y;

    const isSelectedConnector = selectedConnection && (selectedConnection.id === connection.id);
    return (
        <g onClick={() => {
            onConnectorClick(connection)
        }}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={isSelectedConnector ? 'red' : 'black'} strokeWidth="3"/>
            <line x1={x1-2} y1={y1-2} x2={x2} y2={y2} stroke="black" opacity={0} strokeWidth="6"/>
        </g>
    );
};
