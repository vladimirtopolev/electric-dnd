import {ConnectorPoint, Element, ElementGeometry, Point} from './types';
import {MouseEvent} from 'react';


export interface WorkspaceState {
    type: WorkspaceStateEnum,
    contextMenuElement: Element | null | undefined,
    draggableElements: Element[],
    activeConnectorPoints: ConnectorPoint[],
    selectedElements: Element[],
    previousPosition: Point,
    currentPosition: Point,
}

export interface BaseAction {
    type: WorkspaceStateEnum,
    element?: Element,
    connectorPointIndex?: number,
    currentMousePosition?: Point,
    selectedElements?: Element[]
}

export enum WorkspaceStateEnum {
    NO_USER_INTERACTION = 'NO_USER_INTERACTION',
    DRAGGING_ELEMENT = 'DRAGGING_ELEMENT',
    DRAG_ELEMENT = 'DRAG_ELEMENT',
    DROP_ELEMENT = 'DROP_ELEMENT',
    ACTIVATE_CONNECTOR_POINT = 'ACTIVATE_CONNECTOR_POINT',
    REMOVE_ACTIVATED_CONNECTOR_POINT = 'REMOVE_ACTIVATED_CONNECTOR_POINT',
    OPEN_CONTEXT_MENU = 'OPEN_CONTEXT_MENU',
    CLOSE_CONTEXT_MENU = 'CLOSE_CONTEXT_MENU',
    OPENED_CONTEXT_MENU = 'OPENED_CONTEXT_MENU',
    START_DRAW_SELECTED_AREA = 'START_DRAW_SELECTED_AREA',
    DRAWING_SELECTED_AREA = 'DRAWING_SELECTED_AREA',
    REPLACE_SELECTED_ELEMENTS = 'REPLACE_SELECTED_ELEMENTS',
}

export const initWorkspaceState: WorkspaceState = {
    type: WorkspaceStateEnum.NO_USER_INTERACTION,
    contextMenuElement: null,
    selectedElements: [],
    draggableElements: [],
    activeConnectorPoints: [],
    previousPosition: {x: 0, y: 0},
    currentPosition: {x: 0, y: 0},
};

export default (state: WorkspaceState, action: BaseAction): WorkspaceState => {
    const {type, currentMousePosition} = action;
    switch (action.type) {
        case WorkspaceStateEnum.DRAG_ELEMENT: {
            const element = action.element as Element;
            return {
                ...state,
                type,
                draggableElements: [element],
                selectedElements: [element],
                activeConnectorPoints: [],
                previousPosition: currentMousePosition || {x: 0, y: 0},
                currentPosition: currentMousePosition || {x: 0, y: 0},
            };
        }
        case WorkspaceStateEnum.DRAGGING_ELEMENT: {
            return {
                ...state,
                type,
                previousPosition: state.currentPosition,
                currentPosition: currentMousePosition || {x: 0, y: 0},
            };
        }
        case WorkspaceStateEnum.DROP_ELEMENT: {
            return {
                ...state,
                type,
                draggableElements: []
            };
        }
        case WorkspaceStateEnum.ACTIVATE_CONNECTOR_POINT: {
            const element = action.element as Element;
            const connectorPointIndex = action.connectorPointIndex || 0;
            return {
                ...state,
                activeConnectorPoints: [{element, connectorPointIndex}]
            };
        }
        case WorkspaceStateEnum.REMOVE_ACTIVATED_CONNECTOR_POINT: {
            return {
                ...state,
                activeConnectorPoints: []
            };
        }
        case WorkspaceStateEnum.OPEN_CONTEXT_MENU: {
            return {
                ...state,
                type: WorkspaceStateEnum.OPENED_CONTEXT_MENU,
                contextMenuElement: action.element,
                currentPosition: currentMousePosition || {x: 0, y: 0},
            };
        }
        case WorkspaceStateEnum.CLOSE_CONTEXT_MENU: {
            return {
                ...state,
                contextMenuElement: null,
                type: WorkspaceStateEnum.NO_USER_INTERACTION,
            };
        }
        case WorkspaceStateEnum.NO_USER_INTERACTION: {
            return {
                ...state,
                type,
                selectedElements: [],
                draggableElements: []
            };
        }
        case WorkspaceStateEnum.START_DRAW_SELECTED_AREA: {
            return {
                ...state,
                type,
                previousPosition: currentMousePosition || {x: 0, y: 0},
                currentPosition: currentMousePosition || {x: 0, y: 0},
            };
        }
        case WorkspaceStateEnum.DRAWING_SELECTED_AREA: {
            return {
                ...state,
                type: WorkspaceStateEnum.DRAWING_SELECTED_AREA,
                currentPosition: currentMousePosition || {x: 0, y: 0},
            };
        }
        case WorkspaceStateEnum.REPLACE_SELECTED_ELEMENTS: {
            return {
                ...state,
                selectedElements: action.selectedElements || state.selectedElements
            }
        }
        default:
            return state;
    }
};

export const createDropElementAction = (e: MouseEvent) => ({
    type: WorkspaceStateEnum.DROP_ELEMENT,
    currentMousePosition: {x: e.clientX, y: e.clientY}
});
export const createDragElementAction = (element: Element, e: MouseEvent) => ({
    type: WorkspaceStateEnum.DRAG_ELEMENT,
    element,
    currentMousePosition: {x: e.clientX, y: e.clientY}
});
export const createDraggingElementAction = (e: MouseEvent) => ({
    type: WorkspaceStateEnum.DRAGGING_ELEMENT,
    currentMousePosition: {x: e.clientX, y: e.clientY}
});

export const createNoUserInteractionAction = () => ({
    type: WorkspaceStateEnum.NO_USER_INTERACTION
});

export const createOpenContextMenuAction = (element: Element, e: MouseEvent) => ({
    type: WorkspaceStateEnum.OPEN_CONTEXT_MENU,
    element,
    currentMousePosition: {x: e.clientX, y: e.clientY}
});
