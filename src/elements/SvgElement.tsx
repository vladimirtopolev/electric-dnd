import {Element} from '../types';
import React, {
    MouseEvent,
    useRef,
    useEffect,
    Fragment,
    useState, useLayoutEffect,
} from 'react';
import isClickedLeftMouseBtn from '../helpers/isClickedLeftMouseBtn';

interface SvgElementProps {
    element: Element,
    doubleClickElementHandler: (el: Element, event: MouseEvent) => void,
    mouseDownElementHandler: (el: Element, event: MouseEvent) => void,
    mouseUpElementHandler: (el: Element, event: MouseEvent) => void,
    contextMenuElementHandler: (el: Element, event: MouseEvent) => void,
    mouseDownConnectorHandler: (el: Element, connectorPointIndex: number, event: MouseEvent) => void,
    mouseUpConnectorHandler: (el: Element, connectorPointIndex: number, event: MouseEvent) => void,
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
                    mouseUpConnectorHandler,
                    mouseUpElementHandler,
                    mouseMoveConnectorHandler,
                    clickElementHandler,
                    isActiveConnectorPoint,
                    isActive
                }: SvgElementProps) => {

    const groupRef = useRef<SVGGElement>(null);
    const [groupBorder, setGroupBorder] = useState<DOMRect>(new DOMRect(0, 0, 0, 0));

    const labelPosition = element.getLabelPosition();

    useEffect(() => {
        if (groupRef.current) {
            setGroupBorder(groupRef.current.getBoundingClientRect());
        }
    }, [
        element.x,
        element.y,
        element.rotate
    ]);

    return (
        <g ref={groupRef}
           transform={`translate(${element.x}, ${element.y}) rotate(${element.rotate})`}
           onDoubleClick={(e: MouseEvent) => doubleClickElementHandler(element, e)}
           onMouseDown={(e: MouseEvent) => isClickedLeftMouseBtn(e) && mouseDownElementHandler(element, e)}
           onMouseUp={(e: MouseEvent) => mouseUpElementHandler(element, e)}
           onContextMenu={(e: MouseEvent) => contextMenuElementHandler(element, e)}
           onClick={(e: MouseEvent) => clickElementHandler(element, e)}
        >
            {element.render()}
            <g transform={`translate(${labelPosition.dx}, ${labelPosition.dy})`}>
                <text style={{userSelect: 'none'}}>{element.label}</text>
            </g>
            {element.getConnectors().map((point, i) => {
                return (
                    <Fragment key={i}>
                        <circle cx={point.x}
                                cy={point.y}
                                r={3}
                                fill={'red'}
                                fillOpacity={isActiveConnectorPoint(element, i) ? 1 : 0}/>
                        <circle cx={point.x}
                                cy={point.y}
                                r={5}
                                fill={'black'}
                                fillOpacity={0}
                                onMouseDown={(e: MouseEvent) => mouseDownConnectorHandler(element, i, e)}
                                onMouseUp={(e: MouseEvent) => mouseUpConnectorHandler(element, i, e)}
                                onMouseMove={(e: MouseEvent) => mouseMoveConnectorHandler(element, i, e)}/>
                    </Fragment>
                );
            })}
            {isActive && <rect x={0}
                               y={0}
                               width={element.getBorders().dx}
                               height={element.getBorders().dy}
                               fill="none"
                               stroke="red"
                               strokeDasharray={4}
                               strokeWidth={1}
            />}
        </g>
    );
};

