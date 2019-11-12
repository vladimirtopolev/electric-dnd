import React, {useState, MouseEvent, KeyboardEvent, WheelEvent, useReducer, useEffect} from 'react';
import {ConnectorPoint, Point, Element, Connector, DraggedElement, ElementGeometry, CartesianVector} from './types';
import GeneratorElement from './electricComponents/Generator';

import SvgElement from './elements/SvgElement';
import SvgDynamicConnector from './elements/SvgDynamicConnector';
import SvgConnector from './elements/SvgConnector';
import EditElementModal from './elements/EditElementModal';
import ContextMenu from './elements/ContextMenu';
import SelectinArea from './elements/SelectingArea';

interface DraggableElement {
    element: Element,
    baseOffset: CartesianVector
}

interface WorkspaceState {
    type: WorkspaceStateEnum,
    draggableElements: DraggableElement[],
    selectedElements: Element[],
    currentMousePosition: Point
}

enum WorkspaceStateEnum {
    NO_ACTION = 'NO_ACTIOM',
    DRAGGING_ELEMENT = 'DRAGGING_ELEMENT',
    DRAG_ELEMENT = 'DRAG_ELEMENT',
    DROP_ELEMENT = 'DROP_ELEMENT'
}

interface BaseAction {
    type: WorkspaceStateEnum,
    element: Element | null,
    currentMousePosition: Point
}

function App() {
    const [elements, setElements] = useState<Element[]>([]);


    const workspaceReducer = (state: WorkspaceState, action: BaseAction): WorkspaceState => {
        const {type, currentMousePosition} = action;

        switch (action.type) {
            case WorkspaceStateEnum.DRAG_ELEMENT: {
                console.log('DRAG_ELEMENT');
                const element = action.element as Element;
                return {
                    type,
                    draggableElements: [{
                        element,
                        baseOffset: {dx: element.x - currentMousePosition.x, dy: element.y - currentMousePosition.y}
                    }],
                    selectedElements: [element],
                    currentMousePosition
                };
            }
            case WorkspaceStateEnum.DRAGGING_ELEMENT: {
                console.log('DRAGGING_ELEMENT');
                return {...state, type, currentMousePosition};
            }
            case WorkspaceStateEnum.DROP_ELEMENT: {
                console.log('DROP_ELEMENT');
                return {...state, type, currentMousePosition, draggableElements: []};
            }
            case WorkspaceStateEnum.NO_ACTION: {
                console.log('NO_ACTION');
                return {...state, type, selectedElements: [], draggableElements: []};
            }
            default:
                return state;
        }
    };
    const [workspaceState, dispatch] = useReducer(workspaceReducer, {
        type: WorkspaceStateEnum.NO_ACTION,
        selectedElements: [],
        currentMousePosition: {x: 0, y: 0},
        draggableElements: []
    });

    console.log(elements);

    useEffect(() => {
        if (workspaceState.type === WorkspaceStateEnum.DRAGGING_ELEMENT) {
            const {currentMousePosition, draggableElements} = workspaceState;
            setElements(elements => {
                return elements.map(el => {
                    return el.id !== draggableElements[0].element.id
                        ? el
                        : {
                            ...el,
                            x: currentMousePosition.x + draggableElements[0].baseOffset.dx,
                            y: currentMousePosition.y + draggableElements[0].baseOffset.dy
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
            dispatch({
                type: WorkspaceStateEnum.NO_ACTION,
                currentMousePosition: {x: e.clientX, y: e.clientY},
                element: null
            });
        } else {
            dispatch({
                type: WorkspaceStateEnum.DRAG_ELEMENT,
                element,
                currentMousePosition: {x: e.clientX, y: e.clientY}
            });
        }
    };
    const contextMenuElementHandler = (element: Element, e: MouseEvent) => {
    };
    const mouseDownConnectorHandler = (element: Element, connectorPointIndex: number, e: MouseEvent) => {
    };
    const mouseMoveConnectorHandler = (element: Element, connectorPointIndex: number, e: MouseEvent) => {
    };

    const clickElementHandler = (element: Element) => {
    };

    const isActiveConnectorPoint = (element: Element, connectorPointIndex: number) => {
        return true;
    };

    const clickConnectorHandler = (connector: Connector) => {
    };

    const elementChangeGeometryHandler = (element: Element, position: DOMRect) => {
    };

    console.log('SELECTED ---->', workspaceState.selectedElements);

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
                 }}
                 onMouseMove={(e: MouseEvent) => {
                     if (workspaceState.type === WorkspaceStateEnum.DRAG_ELEMENT
                         || workspaceState.type === WorkspaceStateEnum.DRAGGING_ELEMENT) {
                         dispatch({
                             type: WorkspaceStateEnum.DRAGGING_ELEMENT,
                             element: null,
                             currentMousePosition: {x: e.clientX, y: e.clientY}
                         });

                     }
                 }}
                 onMouseUp={(e: MouseEvent) => {
                     if (workspaceState.type === WorkspaceStateEnum.DRAGGING_ELEMENT) {
                         dispatch({
                             type: WorkspaceStateEnum.DROP_ELEMENT,
                             element: null,
                             currentMousePosition: {x: e.clientX, y: e.clientY}
                         });
                     }
                     if (workspaceState.type === WorkspaceStateEnum.DROP_ELEMENT) {
                         dispatch({
                             type: WorkspaceStateEnum.NO_ACTION,
                             element: null,
                             currentMousePosition: {x: e.clientX, y: e.clientY}
                         });
                     }
                 }}
                 onContextMenu={(e: MouseEvent) => {
                 }}
            >
                {elements.map((element, i) => {
                    return <SvgElement
                        key={i}
                        element={element}
                        doubleClickElementHandler={doubleClickElementHandler}
                        mouseDownElementHandler={mouseDownElementHandler}
                        contextMenuElementHandler={contextMenuElementHandler}
                        mouseDownConnectorHandler={mouseDownConnectorHandler}
                        mouseMoveConnectorHandler={mouseMoveConnectorHandler}
                        clickElementHandler={clickElementHandler}
                        isActiveConnectorPoint={isActiveConnectorPoint}
                        onElementChangeGeometry={elementChangeGeometryHandler}
                        isActive={!!elements.find(el => workspaceState.selectedElements.map(e => e.id).includes(element.id))}
                    />;
                })}
            </svg>
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
