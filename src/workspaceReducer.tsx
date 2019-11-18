import {Connection, ConnectorPoint, Element, Point} from './types';
import {MouseEvent} from 'react'

export interface WorkspaceState {
    type: WorkspaceStateEnum,
    workspacePosition: Point,
    contextMenuElement: Element | null | undefined,
    draggableElements: Element[],
    highlightConnectorPoints: ConnectorPoint[],
    selectedConnectorPoint: ConnectorPoint | null | undefined,
    selectedElements: Element[],
    selectedConnection: Connection | null | undefined,
    previousPosition: Point,
    currentPosition: Point,
}


export interface BaseAction {
    type: WorkspaceActionEnum,
    elements?: Element[],
    workspacePosition?: Point,
    connectorPointIndex?: number,
    currentMousePosition?: Point,
    selectedElements?: Element[],
    selectedConnection?: Connection
}

export enum WorkspaceActionEnum {
    CHANGE_WORKSPACE_POSITION = 'CHANGE_WORKSPACE_POSITION',
    START_DRAG_ELEMENT = 'START_DRAG_ELEMENT',
    START_DRAG_ELEMENTS = 'START_DRAG_ELEMENTS',
    DRAG_ELEMENTS = 'DRAG_ELEMENTS',
    DROP_ELEMENTS = 'DROP_ELEMENTS',
    CHANGE_CURRENT_MOUSE_POSITION = 'CHANGE_CURRENT_MOUSE_POSITION',
    START_DRAW_SELECTED_AREA = 'START_DRAW_SELECTED_AREA',
    REPLACE_SELECTED_ELEMENTS = 'REPLACE_SELECTED_ELEMENTS',
    NO_USER_ACTION = 'NO_USER_ACTION',
    OPEN_CONTEXT_MENU = 'OPEN_CONTEXT_MENU',
    ACTIVATE_CONNECTOR_POINT = 'ACTIVATE_CONNECTOR_POINT',
    REMOVE_ACTIVATED_CONNECTOR_POINT = 'REMOVE_ACTIVATED_CONNECTOR_POINT',
    START_DRAW_CONNECTION = 'START_DRAW_CONNECTION',
    SELECT_CONNECTIONS = 'SELECT_CONNECTIONS'
}

export enum WorkspaceStateEnum {
    NO_USER_INTERACTION = 'NO_USER_INTERACTION',
    DRAGGING_ELEMENTS = 'DRAGGING_ELEMENTS',
    DRAWING_SELECTED_AREA = 'DRAWING_SELECTED_AREA',
    DRAWING_CONNECTION = 'DRAW_CONNECTION',
    OPENED_CONTEXT_MENU = 'OPENED_CONTEXT_MENU',
}

export const initWorkspaceState: WorkspaceState = {
    type: WorkspaceStateEnum.NO_USER_INTERACTION,
    workspacePosition: {x: 0, y: 0},
    contextMenuElement: null,
    selectedElements: [],
    selectedConnection: null,
    draggableElements: [],
    selectedConnectorPoint: null,
    highlightConnectorPoints: [],
    previousPosition: {x: 0, y: 0},
    currentPosition: {x: 0, y: 0},
};

export default (state: WorkspaceState, action: BaseAction): WorkspaceState => {
    const {currentMousePosition} = action;
    switch (action.type) {
        case WorkspaceActionEnum.CHANGE_WORKSPACE_POSITION: {
            return {
                ...state,
                workspacePosition: action.workspacePosition as Point
            }
        }
        case WorkspaceActionEnum.START_DRAG_ELEMENT: {
            const elements = action.elements as Element[];
            return {
                ...state,
                type: WorkspaceStateEnum.DRAGGING_ELEMENTS,
                draggableElements: elements,
                selectedElements: elements,
                previousPosition: state.currentPosition,
                currentPosition: state.currentPosition
            };
        }
        case WorkspaceActionEnum.START_DRAG_ELEMENTS: {
            return {
                ...state,
                type: WorkspaceStateEnum.DRAGGING_ELEMENTS,
                draggableElements: state.selectedElements,
                previousPosition: state.currentPosition,
                currentPosition: state.currentPosition
            };
        }
        case WorkspaceActionEnum.DRAG_ELEMENTS: {
            return {
                ...state,
                previousPosition: state.currentPosition
            };
        }
        case WorkspaceActionEnum.DROP_ELEMENTS: {
            return {
                ...state,
                type: WorkspaceStateEnum.NO_USER_INTERACTION,
                draggableElements: [],
            };
        }
        case WorkspaceActionEnum.CHANGE_CURRENT_MOUSE_POSITION: {
            const mousePosition = currentMousePosition || {x: 0, y: 0};
            return {
                ...state,
                currentPosition: {
                    x: mousePosition.x - state.workspacePosition.x,
                    y: mousePosition.y - state.workspacePosition.y
                },
            };
        }
        case WorkspaceActionEnum.START_DRAW_SELECTED_AREA: {
            return {
                ...state,
                type: WorkspaceStateEnum.DRAWING_SELECTED_AREA,
                previousPosition: state.currentPosition,
                currentPosition: state.currentPosition
            };
        }
        case WorkspaceActionEnum.REPLACE_SELECTED_ELEMENTS: {
            const elements = action.elements as Element[];
            return {
                ...state,
                selectedElements: elements
            };
        }
        case WorkspaceActionEnum.NO_USER_ACTION: {
            return {
                ...state,
                type: WorkspaceStateEnum.NO_USER_INTERACTION,
                selectedConnection: null,
                highlightConnectorPoints: [],

            };
        }
        case WorkspaceActionEnum.OPEN_CONTEXT_MENU: {
            const elements = action.elements as Element[];
            return {
                ...state,
                type: WorkspaceStateEnum.OPENED_CONTEXT_MENU,
                contextMenuElement: elements[0]
            };
        }
        case WorkspaceActionEnum.ACTIVATE_CONNECTOR_POINT: {
            const elements = action.elements as Element[];
            const connectorPointIndex = action.connectorPointIndex || 0;
            return {
                ...state,
                highlightConnectorPoints: [{element: elements[0], connectorPointIndex}]
            };
        }
        case WorkspaceActionEnum.REMOVE_ACTIVATED_CONNECTOR_POINT: {
            return {
                ...state,
                highlightConnectorPoints: []
            };
        }
        case WorkspaceActionEnum.START_DRAW_CONNECTION: {
            const elements = action.elements as Element[];
            const connectorPointIndex = action.connectorPointIndex || 0;
            return {
                ...state,
                type: WorkspaceStateEnum.DRAWING_CONNECTION,
                selectedConnection: null,
                selectedConnectorPoint: {element: elements[0], connectorPointIndex}
            };
        }
        case WorkspaceActionEnum.SELECT_CONNECTIONS: {
            return {
                ...state,
                selectedConnection: action.selectedConnection as Connection
            };
        }
        default:
            return state;
    }
};

export const createStartDragElementAction = (element: Element) => ({
    type: WorkspaceActionEnum.START_DRAG_ELEMENT, elements: [element]
});

export const createDropElementsAction = () => (
    {type: WorkspaceActionEnum.DROP_ELEMENTS}
);

export const createOpenContextMenuAction = (element: Element) => (
    {
        type: WorkspaceActionEnum.OPEN_CONTEXT_MENU,
        elements: [element]
    }
);

export const createActivateConnectorPointAction = (element: Element, connectorPointIndex: number) => (
    {
        type: WorkspaceActionEnum.ACTIVATE_CONNECTOR_POINT,
        elements: [element],
        connectorPointIndex
    }
);

export const createChangeCurrentMousePositionAction = (e: MouseEvent, workspacePosition: Point) => (
    {
        type: WorkspaceActionEnum.CHANGE_CURRENT_MOUSE_POSITION,
        currentMousePosition: {x: e.clientX, y: e.clientY}
    }
);

