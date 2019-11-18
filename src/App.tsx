import React, {KeyboardEvent, MouseEvent, useEffect, useReducer, useState, WheelEvent} from 'react';
import {Connection, Element, WorkspacePosition} from './types';
import workspaceReducer, {
    createActivateConnectorPointAction,
    createChangeCurrentMousePositionAction,
    createDropElementsAction,
    createOpenContextMenuAction,
    createStartDragElementAction,
    initWorkspaceState,
    WorkspaceActionEnum,
    WorkspaceStateEnum
} from './workspaceReducer';
import SvgElement from './elements/SvgElement';
import GeneratorElement from './electricComponents/Generator';
import PointElement from './electricComponents/Point';

import SelectingArea from './elements/SelectingArea';
import ContextMenu from './elements/ContextMenu';
import getElementsInsideSelectedArea from './helpers/getElementsInsideSelectedArea';
import SvgDynamicConnector from './elements/SvgDynamicConnector';
import SvgConnection from './elements/SvgConnection';
import isPointBelongConnector from './helpers/isPointBelongConnector';
import getMoveDirection from './helpers/getMoveDirection';
import isDeleteBtn from './helpers/isDeleteBtn';
import useElementsAndConnectionsManager from './helpers/useElementsAndConnectionsManager';

function App() {
    const {elements, setElements, connections, setConnections, deleteElements} = useElementsAndConnectionsManager();
    const [workspaceState, dispatch] = useReducer(workspaceReducer, initWorkspaceState);
    const [workspacePosition, setWorkspacePosition] = useState<WorkspacePosition>({
        scale: 1,
        x: 0,
        y: 0
    });
    const setScale = (delta: number) => workspacePosition.scale + delta > 0 && setWorkspacePosition({
        ...workspacePosition,
        scale: workspacePosition.scale + delta
    });

    useEffect(() => {
        if (workspaceState.type === WorkspaceStateEnum.DRAGGING_ELEMENTS) {
            const {previousPosition, currentPosition, draggableElements} = workspaceState;
            const {scale} = workspacePosition;
            setElements(elements => {
                return elements.map(el => {
                    const isDraggableEl = !!draggableElements.find(dEl => dEl.id === el.id);
                    return !isDraggableEl
                        ? el
                        : {
                            ...el,
                            x: el.x + (currentPosition.x - previousPosition.x) / scale,
                            y: el.y + (currentPosition.y - previousPosition.y) / scale
                        };
                });
            });
        }
    }, [workspaceState]);

    const doubleClickElementHandler = (el: Element, e: MouseEvent) => {
    };


    const mouseDownElementHandler = (element: Element, e: MouseEvent) => {
        e.stopPropagation();
        const isElementsStartDrag = !!workspaceState.selectedElements.find(el => el.id === element.id);
        if (!isElementsStartDrag) {
            dispatch(createStartDragElementAction(element));
        } else {
            dispatch({type: WorkspaceActionEnum.START_DRAG_ELEMENTS})
        }
    };

    const mouseUpElementHandler = (element: Element, e: MouseEvent) => {
        e.stopPropagation();
        dispatch(createDropElementsAction());
    };

    const contextMenuElementHandler = (element: Element, e: MouseEvent) => {
        e.preventDefault();
        dispatch(createOpenContextMenuAction(element));
    };

    const mouseMoveConnectorHandler = (element: Element, connectorPointIndex: number, e: MouseEvent) => {
        e.stopPropagation();
        dispatch(createActivateConnectorPointAction(element, connectorPointIndex));
        dispatch(createChangeCurrentMousePositionAction(e));
    };

    const mouseDownConnectorHandler = (element: Element, connectorPointIndex: number, e: MouseEvent) => {
        e.stopPropagation();
        let elementConnection: Element, connectorPointIndexConnection: number;
        if (!workspaceState.selectedConnection
            || !isPointBelongConnector({element, connectorPointIndex}, workspaceState.selectedConnection)) {
            // it means client tries to create new connection
            elementConnection = element;
            connectorPointIndexConnection = connectorPointIndex;
        } else {
            // it means client probably tries to modify existed connection
            const connection = workspaceState.selectedConnection as Connection;
            const {first, second} = connection;
            const connector = first.element.id === element.id && first.connectorPointIndex === connectorPointIndex
                ? second : first;
            elementConnection = elements.find(el => el.id === connector.element.id) as Element;
            connectorPointIndexConnection = connector.connectorPointIndex;
            setConnections(connections.filter(con => con.id !== connection.id));
        }
        dispatch({
            type: WorkspaceActionEnum.START_DRAW_CONNECTION,
            elements: [elementConnection],
            connectorPointIndex: connectorPointIndexConnection
        });
    };

    const mouseUpConnectorHandler = (element: Element, connectorPointIndex: number, e: MouseEvent) => {
        if (workspaceState.selectedConnectorPoint) {
            setConnections(connections.concat({
                id: new Date().getUTCMilliseconds().toString(),
                first: workspaceState.selectedConnectorPoint,
                second: {element, connectorPointIndex}
            }));
        }
    };

    const clickElementHandler = (element: Element) => {
    };

    const isActiveConnectorPoint = (element: Element, connectorPointIndex: number) => {
        // TODO: probably enough have only one connector point insted of array of them
        // TODO: since there may be not case in which we need to keep 2 connector points
        if (workspaceState.highlightConnectorPoints.length === 0) {
            return false;
        }
        const connectorPoint = workspaceState.highlightConnectorPoints[0];
        return element.id === connectorPoint.element.id
            && connectorPointIndex === connectorPoint.connectorPointIndex;

    };

    const clickConnectorHandler = (connection: Connection) => {
        dispatch({
            type: WorkspaceActionEnum.SELECT_CONNECTIONS,
            selectedConnection: connection
        });
    };


    return (
        <div style={{padding: 0, margin: 0, position: 'relative', outline: 'none'}}
             tabIndex={0}
             onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                 const baseShift = 2;
                 const offset = getMoveDirection(e);
                 const deleteElement = isDeleteBtn(e);
                 if (deleteElement) {
                     deleteElements(workspaceState.selectedElements);
                     return;
                 }
                 const newElements = elements.reduce((memo, el) => {
                     const isSelectedElement = workspaceState.selectedElements.find(selEl => selEl.id === el.id);
                     return isSelectedElement
                         ? [...memo, {...el, x: el.x + offset.dx * baseShift, y: el.y + offset.dy * baseShift}]
                         : [...memo, el];
                 }, [] as Element[]);
                 setElements(newElements);
             }}>
            <svg width="100%"
                 height={500}
                 onWheel={(e: WheelEvent<SVGSVGElement>) => {
                     e.deltaY < 0 && setScale(0.1);
                     e.deltaY > 0 && setScale(-0.1);
                 }}
                 onMouseDown={(e: MouseEvent) => {
                     dispatch({type: WorkspaceActionEnum.START_DRAW_SELECTED_AREA});
                 }}
                 onMouseMove={(e: MouseEvent) => {
                     if (workspaceState.type === WorkspaceStateEnum.DRAGGING_ELEMENTS) {
                         dispatch({type: WorkspaceActionEnum.DRAG_ELEMENTS});
                     }
                     if (workspaceState.highlightConnectorPoints.length > 0) {
                         dispatch({type: WorkspaceActionEnum.REMOVE_ACTIVATED_CONNECTOR_POINT});
                     }
                     dispatch(createChangeCurrentMousePositionAction(e));
                 }}
                 onMouseUp={(e: MouseEvent) => {
                     if (workspaceState.type === WorkspaceStateEnum.DRAWING_SELECTED_AREA) {
                         dispatch({
                             type: WorkspaceActionEnum.REPLACE_SELECTED_ELEMENTS,
                             elements: getElementsInsideSelectedArea(
                                 elements, {
                                     start: workspaceState.previousPosition,
                                     end: workspaceState.currentPosition
                                 },
                                 workspacePosition)
                         });
                     }
                     dispatch({type: WorkspaceActionEnum.NO_USER_ACTION});
                 }}
                 onContextMenu={(e: MouseEvent) => {
                 }}
            >
                <g transform={`scale(${workspacePosition.scale}) translate(${workspacePosition.x}, ${workspacePosition.y})`}>
                    {workspaceState.type === WorkspaceStateEnum.DRAWING_CONNECTION
                    && <SvgDynamicConnector firstPointConnector={workspaceState.selectedConnectorPoint}
                                            currentMousePosition={workspaceState.currentPosition}
                                            workspacePosition={workspacePosition}/>}
                    {connections.map((connection, i) => {
                        return <SvgConnection key={i}
                                              connection={connection}
                                              elements={elements}
                                              selectedConnection={workspaceState.selectedConnection}
                                              onConnectorClick={clickConnectorHandler}
                        />;
                    })}
                    {elements.map((element, i) => {
                        return <SvgElement
                            key={i}
                            element={element}
                            doubleClickElementHandler={doubleClickElementHandler}
                            mouseDownElementHandler={mouseDownElementHandler}
                            mouseUpElementHandler={mouseUpElementHandler}
                            contextMenuElementHandler={contextMenuElementHandler}
                            mouseDownConnectorHandler={mouseDownConnectorHandler}
                            mouseUpConnectorHandler={mouseUpConnectorHandler}
                            mouseMoveConnectorHandler={mouseMoveConnectorHandler}
                            clickElementHandler={clickElementHandler}
                            isActiveConnectorPoint={isActiveConnectorPoint}
                            isActive={!!elements.find(el => workspaceState.selectedElements.map(e => e.id).includes(element.id))}
                        />;
                    })}
                    {workspaceState.type === WorkspaceStateEnum.DRAWING_SELECTED_AREA
                    && <SelectingArea start={workspaceState.previousPosition}
                                      end={workspaceState.currentPosition}
                                      workspacePosition={workspacePosition}/>}
                </g>
            </svg>

            {workspaceState.type === WorkspaceStateEnum.OPENED_CONTEXT_MENU
            && <ContextMenu
                contextPosition={workspaceState.currentPosition}
                contextMenuElement={workspaceState.contextMenuElement}
                elements={elements}
                closeContextMenu={() => dispatch({type: WorkspaceActionEnum.NO_USER_ACTION})}
                deleteElement={(element: Element) => deleteElements([element])}
                setElements={setElements}
            />}
            <div>
                <button onClick={() => {
                    setElements([...elements, {
                        ...GeneratorElement,
                        id: new Date().getUTCMilliseconds().toString(),
                        label: GeneratorElement.getInitLabel && GeneratorElement.getInitLabel(elements) || ''
                    }]);
                }}>G
                </button>
                <button onClick={() => {
                    setElements([...elements, {
                        ...PointElement,
                        id: new Date().getUTCMilliseconds().toString(),
                    }]);
                }}>P
                </button>
            </div>
        </div>
    );
}

export default App;
