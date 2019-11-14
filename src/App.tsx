import React, {KeyboardEvent, MouseEvent, useEffect, useReducer, useState, WheelEvent} from 'react';
import {Connector, Element} from './types';
import GeneratorElement from './electricComponents/Generator';

import ContextMenu from './elements/ContextMenu';
import workspaceReducer, {
    createDragElementAction,
    createDropElementAction,
    createNoUserInteractionAction,
    createOpenContextMenuAction,
    initWorkspaceState,
    WorkspaceStateEnum
} from './workspaceReducer';

import SvgElement from './elements/SvgElement';
import SelectingArea from './elements/SelectingArea';
import getElementsInsideSelectedArea from './helpers/getElementsInsideSelectedArea';

function App() {
    const [elements, setElements] = useState<Element[]>([]);
    const [workspaceState, dispatch] = useReducer(workspaceReducer, initWorkspaceState);

    useEffect(() => {
        if (workspaceState.type === WorkspaceStateEnum.DRAGGING_ELEMENT) {
            const {previousPosition, currentPosition, draggableElements} = workspaceState;
            setElements(elements => {
                return elements.map(el => {
                    return el.id !== draggableElements[0].id
                        ? el
                        : {
                            ...el,
                            x: el.x + (currentPosition.x - previousPosition.x),
                            y: el.y + (currentPosition.y - previousPosition.y)
                        };
                });
            });
        }
    }, [workspaceState]);

    const doubleClickElementHandler = (el: Element, e: MouseEvent) => {
    };


    const mouseDownElementHandler = (element: Element, e: MouseEvent) => {
        e.stopPropagation();
        if (workspaceState.type === WorkspaceStateEnum.DRAGGING_ELEMENT) {
            dispatch(createDropElementAction(e));
        } else {
            dispatch(createDragElementAction(element, e));
        }
    };

    const mouseUpElementHandler = (element: Element, e: MouseEvent) => {
        e.stopPropagation();
        dispatch(createDropElementAction(e));
    };

    const contextMenuElementHandler = (element: Element, e: MouseEvent) => {
        e.preventDefault();
        dispatch(createOpenContextMenuAction(element, e));
    };

    const mouseDownConnectorHandler = (element: Element, connectorPointIndex: number, e: MouseEvent) => {

    };

    const mouseMoveConnectorHandler = (element: Element, connectorPointIndex: number, e: MouseEvent) => {
        e.stopPropagation();
        dispatch({
            type: WorkspaceStateEnum.ACTIVATE_CONNECTOR_POINT,
            element,
            connectorPointIndex
        });
    };

    const clickElementHandler = (element: Element) => {
    };

    const isActiveConnectorPoint = (element: Element, connectorPointIndex: number) => {
        // TODO: probably enough have only one connector point insted of array of them
        // TODO: since there may be not case in which we need to keep 2 connector points
        if (workspaceState.activeConnectorPoints.length === 0) {
            return false;
        }
        const connectorPoint = workspaceState.activeConnectorPoints[0];
        return element.id === connectorPoint.element.id
            && connectorPointIndex === connectorPoint.connectorPointIndex;
    };

    const clickConnectorHandler = (connector: Connector) => {
    };


    return (
        <div style={{padding: 0, margin: 0, position: 'relative', outline: 'none'}}
             tabIndex={0}
             onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
             }}>
            <svg width="100%"
                 height={500}
                 onWheel={(e: WheelEvent<SVGSVGElement>) => {
                 }}
                 onMouseDown={(e: MouseEvent) => {
                     dispatch({type: WorkspaceStateEnum.CLOSE_CONTEXT_MENU});
                     dispatch({
                         type: WorkspaceStateEnum.START_DRAW_SELECTED_AREA,
                         currentMousePosition: {x: e.clientX, y: e.clientY}
                     });
                 }}
                 onMouseMove={(e: MouseEvent) => {
                     if (workspaceState.type === WorkspaceStateEnum.DRAG_ELEMENT
                         || workspaceState.type === WorkspaceStateEnum.DRAGGING_ELEMENT) {
                         dispatch({
                             type: WorkspaceStateEnum.DRAGGING_ELEMENT,
                             currentMousePosition: {x: e.clientX, y: e.clientY}
                         });
                     }
                     dispatch({type: WorkspaceStateEnum.REMOVE_ACTIVATED_CONNECTOR_POINT});
                     if (workspaceState.type === WorkspaceStateEnum.START_DRAW_SELECTED_AREA
                         || workspaceState.type === WorkspaceStateEnum.DRAWING_SELECTED_AREA) {
                         dispatch({
                             type: WorkspaceStateEnum.DRAWING_SELECTED_AREA,
                             currentMousePosition: {x: e.clientX, y: e.clientY}
                         });
                     }
                 }}
                 onMouseUp={(e: MouseEvent) => {
                     if (workspaceState.type === WorkspaceStateEnum.DRAGGING_ELEMENT) {
                         dispatch(createDropElementAction(e));
                     }
                     if (workspaceState.type === WorkspaceStateEnum.DROP_ELEMENT) {
                         dispatch(createNoUserInteractionAction());
                     }
                     if (workspaceState.type === WorkspaceStateEnum.DRAWING_SELECTED_AREA
                         || workspaceState.type === WorkspaceStateEnum.START_DRAW_SELECTED_AREA) {
                         dispatch(createNoUserInteractionAction());
                         dispatch({
                             type: WorkspaceStateEnum.REPLACE_SELECTED_ELEMENTS, selectedElements:
                                 getElementsInsideSelectedArea(elements, {
                                     start: workspaceState.previousPosition,
                                     end: workspaceState.currentPosition
                                 })
                         });
                     }
                     if (workspaceState.type === WorkspaceStateEnum.NO_USER_INTERACTION) {
                         dispatch(createNoUserInteractionAction());
                     }
                 }}
                 onContextMenu={(e: MouseEvent) => {
                 }}
            >
                {workspaceState.type === WorkspaceStateEnum.DRAWING_SELECTED_AREA
                && <SelectingArea start={workspaceState.previousPosition}
                                  end={workspaceState.currentPosition}/>}
                {elements.map((element, i) => {
                    return <SvgElement
                        key={i}
                        element={element}
                        doubleClickElementHandler={doubleClickElementHandler}
                        mouseDownElementHandler={mouseDownElementHandler}
                        mouseUpElementHandler={mouseUpElementHandler}
                        contextMenuElementHandler={contextMenuElementHandler}
                        mouseDownConnectorHandler={mouseDownConnectorHandler}
                        mouseMoveConnectorHandler={mouseMoveConnectorHandler}
                        clickElementHandler={clickElementHandler}
                        isActiveConnectorPoint={isActiveConnectorPoint}
                        isActive={!!elements.find(el => workspaceState.selectedElements.map(e => e.id).includes(element.id))}
                    />;
                })}
            </svg>
            <ContextMenu contextMenuElement={workspaceState.contextMenuElement}
                         contextPosition={workspaceState.currentPosition}
                         elements={elements}
                         deleteElement={() => {
                         }}
                         setElements={setElements}
                         closeContextMenu={() => dispatch({type: WorkspaceStateEnum.CLOSE_CONTEXT_MENU})}/>
            <div>
                <button onClick={() => {
                    setElements([...elements, {...GeneratorElement, id: new Date().getUTCMilliseconds().toString()}]);
                }}>G
                </button>
            </div>
        </div>
    );
}

export default App;
