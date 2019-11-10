import React, {useState, MouseEvent, KeyboardEvent} from 'react';
import {ConnectorPoint, Point, Element, Connector, DraggedElement} from './types';
import GeneratorElement from './electricComponents/Generator';

import SvgElement from './elements/SvgElement';
import SvgDynamicConnector from './elements/SvgDynamicConnector';
import SvgConnector from './elements/SvgConnector';
import EditElementModal from './elements/EditElementModal';
import ContextMenu from './elements/ContextMenu';
import SelectinArea from './elements/SelectingArea';
import useContextMenuElement from './helpers/useContextMenuElement';
import getMoveDirection from './helpers/getMoveDirection';
import isDeleteBtn from './helpers/isDeleteBtn';


function App() {
    const [elements, setElements] = useState<Element[]>([]);
    const [connectors, setConnectors] = useState<Connector[]>([]);

    const [doubleClickedElement, setDoubleClickedElement] = useState<Element>();
    const [draggedElement, setDraggedElement] = useState<DraggedElement>();
    const {contextMenuElement, setContextMenuElement} = useContextMenuElement();
    const [underElementConnectorPoint, setUnderElementConnectorPoint] = useState<ConnectorPoint>();
    const [firstChosenElementConnectorPoint, setFirstChosenElementConnectorPoint] = useState<ConnectorPoint>();
    const [currentMousePosition, setCurrentMousePosition] = useState<Point>();
    const [selectedElements, setSelectedElements] = useState<Element[]>([]);

    const closeContextMenuElement = () => {
        setContextMenuElement(undefined);
        setFirstPointOfSelectingArea(undefined);
    };

    const [firstPointOfSelectingArea, setFirstPointOfSelectingArea] = useState<Point>();

    const doubleClickElementHandler = (el: Element) => setDoubleClickedElement(el);
    const mouseDownElementHandler = (element: Element, e: MouseEvent) => {
        e.stopPropagation();
        setDraggedElement({element, offset: {x: element.x - e.clientX, y: element.y - e.clientY}});
        setSelectedElements([element]);
    };
    const contextMenuElementHandler = (element: Element, e: MouseEvent) => {
        e.preventDefault();
        setContextMenuElement({element, mousePosition: {x: e.clientX, y: e.clientY}});
    };
    const mouseDownConnectorHandler = (element: Element, connectorPointIndex: number, e: MouseEvent) => {
        e.stopPropagation();
        setFirstChosenElementConnectorPoint({element, connectorPointIndex});
        setCurrentMousePosition({x: e.clientX, y: e.clientY});
        setDraggedElement(undefined);
    };
    const mouseMoveConnectorHandler = (element: Element, connectorPointIndex: number, e: MouseEvent) => {
        e.stopPropagation();
        setUnderElementConnectorPoint({element, connectorPointIndex});
    };

    const onClickElementHandler = (element: Element) => {
        setSelectedElements([element]);
    };

    const isActiveConnectorPoint = (element: Element, connectorPointIndex: number) => {
        if (!underElementConnectorPoint) {
            return false;
        }
        return element.id === underElementConnectorPoint.element.id
            && connectorPointIndex === underElementConnectorPoint.connectorPointIndex;
    };


    return (
        <div style={{padding: 0, margin: 0, position: 'relative', outline: 'none'}}
             tabIndex={0}
             onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                 const baseShift = 2;
                 const offset = getMoveDirection(e);
                 const deleteElement = isDeleteBtn(e);

                 const newElements = elements.reduce((memo, el) => {
                     const isSelectedElement = selectedElements.find(selEl => selEl.id === el.id);
                     if (deleteElement) {
                         return isSelectedElement ? memo : [...memo, el];
                     }
                     return isSelectedElement
                         ? [...memo, {...el, x: el.x + offset.dx * baseShift, y: el.y + offset.dy * baseShift}]
                         : [...memo, el];
                 }, [] as Element[]);
                 setElements(newElements);
             }}>
            <svg width="100%"
                 height={500}
                 onMouseDown={(e: MouseEvent) => {
                     closeContextMenuElement();
                     setSelectedElements([]);
                     setFirstPointOfSelectingArea({x: e.clientX, y: e.clientY});
                 }}
                 onMouseMove={(e: MouseEvent) => {
                     if (draggedElement) {
                         const x = e.clientX + draggedElement.offset.x;
                         const y = e.clientY + draggedElement.offset.y;
                         setElements(elements.map(el => el.id === draggedElement.element.id
                             ? {...el, x, y}
                             : el));
                     }
                     setCurrentMousePosition({x: e.clientX, y: e.clientY});
                     setUnderElementConnectorPoint(undefined);
                 }}
                 onMouseUp={() => {
                     if (firstChosenElementConnectorPoint && underElementConnectorPoint
                         && firstChosenElementConnectorPoint.element.id !== underElementConnectorPoint.element.id) {
                         setConnectors([...connectors, {
                             first: firstChosenElementConnectorPoint,
                             second: underElementConnectorPoint
                         }]);
                     }
                     setDraggedElement(undefined);
                     setFirstChosenElementConnectorPoint(undefined);
                     setFirstPointOfSelectingArea(undefined);
                 }}
                 onContextMenu={(e: MouseEvent) => {
                     e.preventDefault();
                 }}
            >

                {elements.map((el, i) => {
                    const elementInstance = new SvgElement(
                        el, i,
                        doubleClickElementHandler,
                        mouseDownElementHandler,
                        contextMenuElementHandler,
                        mouseDownConnectorHandler,
                        mouseMoveConnectorHandler,
                        onClickElementHandler,
                        isActiveConnectorPoint);
                    return elementInstance.render(!!selectedElements.find(selEl => selEl.id === el.id));
                })}
                {connectors.map((connection, i) => {
                    return <SvgConnector key={i} connection={connection} elements={elements}/>;
                })}
                {firstPointOfSelectingArea
                && <SelectinArea start={firstPointOfSelectingArea}
                                 end={currentMousePosition}/>}
                <SvgDynamicConnector currentMousePosition={currentMousePosition}
                                     firstPointConnector={firstChosenElementConnectorPoint}/>
            </svg>
            <div>
                <button onClick={() => {
                    setElements([...elements, {...GeneratorElement, id: new Date().getUTCMilliseconds().toString()}]);
                }}>Generator
                </button>
            </div>
            <EditElementModal doubleClickedElement={doubleClickedElement}
                              setDoubleClickedElement={setDoubleClickedElement}/>
            <ContextMenu contextMenuElement={contextMenuElement}
                         elements={elements}
                         setElements={setElements}
                         closeContextMenu={closeContextMenuElement}/>
        </div>
    );
}

export default App;
