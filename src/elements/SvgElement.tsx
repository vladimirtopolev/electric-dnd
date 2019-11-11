import {Element} from '../types';
import React, {MouseEvent, useRef, useEffect} from 'react';
import isClickedLeftMouseBtn from '../helpers/isClickedLeftMouseBtn';

interface SvgElementProps {
    element: Element,
    doubleClickElementHandler: (el: Element, event: MouseEvent) => void,
    mouseDownElementHandler: (el: Element, event: MouseEvent) => void,
    contextMenuElementHandler: (el: Element, event: MouseEvent) => void,
    mouseDownConnectorHandler: (el: Element, connectorPointIndex: number, event: MouseEvent) => void,
    mouseMoveConnectorHandler: (el: Element, connectorPointIndex: number, event: MouseEvent) => void,
    clickElementHandler: (el: Element, event?: MouseEvent) => void,
    isActiveConnectorPoint: (el: Element, connectorIndex: number) => boolean,
    isActive: boolean
}


export default ({
                    element,
                    doubleClickElementHandler,
                    mouseDownElementHandler,
                    contextMenuElementHandler,
                    mouseDownConnectorHandler,
                    mouseMoveConnectorHandler,
                    clickElementHandler,
                    isActiveConnectorPoint,
                    isActive
                }: SvgElementProps) => {

    const groupRef = useRef<SVGGElement>(null);
    useEffect(() => {
        console.log(groupRef.current && groupRef.current.getBoundingClientRect())
       ;
    });

    return (
        <g ref={groupRef}
           transform={`translate(${element.x}, ${element.y}) rotate(${element.rotate})`}
           onDoubleClick={(e: MouseEvent) => doubleClickElementHandler(element, e)}
           onMouseDown={(e: MouseEvent) => isClickedLeftMouseBtn(e) && mouseDownElementHandler(element, e)}
           onContextMenu={(e: MouseEvent) => contextMenuElementHandler(element, e)}
           onClick={(e: MouseEvent) => clickElementHandler(element, e)}
        >
            {element.render()}
            {element.getConnectors().map((point, i) => {
                return (
                    <>
                        <circle cx={point.x}
                                cy={point.y}
                                r={10}
                                key={i}
                                fill={'black'}
                                fillOpacity={0}
                                onMouseDown={(e: MouseEvent) => mouseDownConnectorHandler(element, i, e)}
                                onMouseMove={(e: MouseEvent) => mouseMoveConnectorHandler(element, i, e)}/>
                        <circle cx={point.x}
                                cy={point.y}
                                r={5}
                                key={i}
                                fill={'red'}
                                fillOpacity={isActiveConnectorPoint(element, i) ? 1 : 0}
                                onMouseDown={(e: MouseEvent) => mouseDownConnectorHandler(element, i, e)}
                                onMouseMove={(e: MouseEvent) => mouseMoveConnectorHandler(element, i, e)}/>
                    </>
                );
            })}
            {isActive && element.renderBorderArea()}
        </g>
    );
}
