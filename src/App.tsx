import React, {useState, MouseEvent, KeyboardEvent, WheelEvent} from 'react';
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
import {isArray} from 'lodash';
import isPointBelongConnector from "./helpers/isPointBelongConnector";

function App() {
    const [elements, setElements] = useState<Element[]>([]);
    const [connectors, setConnectors] = useState<Connector[]>([]);
    const deleteElements = (deletingElements: Element | Element[]) => {
        const deletedElements: Element[] = isArray(deletingElements) ? deletingElements : [deletingElements];
        setElements(elements.reduce((memo, element) => {
            const isDeletingElement = deletedElements.find(el => el.id === element.id);
            return isDeletingElement ? memo : [...memo, element];
        }, [] as Element[]));
        setConnectors(connectors.reduce((memo, connector) => {
            const isFirstElementDeleting = deletedElements.find(el => el.id === connector.first.element.id);
            const isSecondElementDeleting = deletedElements.find(el => el.id === connector.second.element.id);
            return (isFirstElementDeleting || isSecondElementDeleting) ? memo : [...memo, connector]
        }, [] as Connector[]))
    };

    const [doubleClickedElement, setDoubleClickedElement] = useState<Element>();
    const [draggedElement, setDraggedElement] = useState<DraggedElement>();
    const {contextMenuElement, setContextMenuElement} = useContextMenuElement();
    const [underElementConnectorPoint, setUnderElementConnectorPoint] = useState<ConnectorPoint>();
    const [firstChosenElementConnectorPoint, setFirstChosenElementConnectorPoint] = useState<ConnectorPoint>();
    const [currentMousePosition, setCurrentMousePosition] = useState<Point>();
    const [selectedElements, setSelectedElements] = useState<Element[]>([]);
    const [selectedConnectors, setSelectedConnectors] = useState<Connector[]>([]);

    const closeContextMenuElement = () => {
        setContextMenuElement(undefined);
        setFirstPointOfSelectingArea(undefined);
    };

    const [firstPointOfSelectingArea, setFirstPointOfSelectingArea] = useState<Point>();

    const doubleClickElementHandler = (el: Element, e: MouseEvent) => {
        e.preventDefault();
        setDoubleClickedElement(el)
    };
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
        if (selectedConnectors.length === 0) {
            // it means client tries to create new connection
            setFirstChosenElementConnectorPoint({element, connectorPointIndex});
            setCurrentMousePosition({x: e.clientX, y: e.clientY});
        } else {
            // it means client probably tries to modify existed connection
            const selectedConnector = selectedConnectors[0];
            if (isPointBelongConnector({element, connectorPointIndex}, selectedConnector)) {
                const fixedConnectorPoint = selectedConnector.first.element.id === element.id
                    ? selectedConnector.second : selectedConnector.first;
                const updatedElementForFixedConnectorPoint = elements.find(el => el.id === fixedConnectorPoint.element.id);
                setConnectors(connectors.filter(con => con.id !== selectedConnector.id));
                setCurrentMousePosition({x: e.clientX, y: e.clientY});
                setSelectedConnectors([]);
                setFirstChosenElementConnectorPoint(updatedElementForFixedConnectorPoint
                    ? {...fixedConnectorPoint, element: updatedElementForFixedConnectorPoint}
                    : fixedConnectorPoint);
            }
        }
        setDraggedElement(undefined);
    };
    const mouseMoveConnectorHandler = (element: Element, connectorPointIndex: number, e: MouseEvent) => {
        e.stopPropagation();
        setUnderElementConnectorPoint({element, connectorPointIndex});
    };

    const clickElementHandler = (element: Element) => {
        setSelectedElements([element]);
    };

    const isActiveConnectorPoint = (element: Element, connectorPointIndex: number) => {
        if (!underElementConnectorPoint) {
            return false;
        }
        return element.id === underElementConnectorPoint.element.id
            && connectorPointIndex === underElementConnectorPoint.connectorPointIndex;
    };

    const onClickConnector = (connector: Connector) => {
        setSelectedConnectors([connector]);
    };


    return (
        <div style={{padding: 0, margin: 0, position: 'relative', outline: 'none'}}
             tabIndex={0}
             onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                 const baseShift = 2;
                 const offset = getMoveDirection(e);
                 const deleteElement = isDeleteBtn(e);
                 if (deleteElement) {
                     deleteElements(selectedElements);
                     return;
                 }
                 const newElements = elements.reduce((memo, el) => {
                     const isSelectedElement = selectedElements.find(selEl => selEl.id === el.id);
                     return isSelectedElement
                         ? [...memo, {...el, x: el.x + offset.dx * baseShift, y: el.y + offset.dy * baseShift}]
                         : [...memo, el];
                 }, [] as Element[]);
                 setElements(newElements);
             }}>
            <svg width="100%"
                 height={500}
                 onWheel={(e: WheelEvent<SVGSVGElement>) => {
                     console.log(e)
                 }}
                 onMouseDown={(e: MouseEvent) => {
                     closeContextMenuElement();
                     setSelectedElements([]);
                     setFirstPointOfSelectingArea({x: e.clientX, y: e.clientY});
                     setSelectedConnectors([]);
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
                             id: (new Date()).getUTCMilliseconds().toString(),
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
                {connectors.map((connection, i) => {
                    return <SvgConnector key={i}
                                         connection={connection}
                                         elements={elements}
                                         selectedConnectors={selectedConnectors}
                                         onConnectorClick={onClickConnector}/>;
                })}
                {elements.map((el, i) => {
                    return <SvgElement
                        key={i}
                        element={el}
                        doubleClickElementHandler={doubleClickElementHandler}
                        mouseDownElementHandler={mouseDownElementHandler}
                        contextMenuElementHandler={contextMenuElementHandler}
                        mouseDownConnectorHandler={mouseDownConnectorHandler}
                        mouseMoveConnectorHandler={mouseMoveConnectorHandler}
                        clickElementHandler={clickElementHandler}
                        isActiveConnectorPoint={isActiveConnectorPoint}
                        isActive={!!selectedElements.find(selEl => selEl.id === el.id)}
                    />
                })}
                {firstPointOfSelectingArea && <SelectinArea start={firstPointOfSelectingArea}
                                                            end={currentMousePosition}/>}
                <SvgDynamicConnector currentMousePosition={currentMousePosition}
                                     firstPointConnector={firstChosenElementConnectorPoint}/>
            </svg>
            <div>
                <button onClick={() => {
                    setElements([...elements, {...GeneratorElement, id: new Date().getUTCMilliseconds().toString()}]);
                }}>G
                </button>
            </div>
            <EditElementModal doubleClickedElement={doubleClickedElement}
                              setDoubleClickedElement={setDoubleClickedElement}/>
            <ContextMenu contextMenuElement={contextMenuElement}
                         elements={elements}
                         deleteElement={deleteElements}
                         setElements={setElements}
                         closeContextMenu={closeContextMenuElement}/>
        </div>
    );
}

export default App;
