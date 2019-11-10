export interface Point {
    x: number,
    y: number
}

export interface Element {
    id: string,
    x: number,
    y: number,
    rotate: number,
    getConnectors: () => Point[],
    render: () => JSX.Element,
    renderBorderArea: () => JSX.Element
}

export interface ConnectorPoint {
    element: Element,
    connectorPointIndex: number
}

export interface Connector {
    first: ConnectorPoint,
    second: ConnectorPoint
}

export interface ContextMenuElement {
    element: Element,
    mousePosition: Point
}

export interface DraggedElement {
    element: Element,
    offset: Point
}

export interface Offset{
    dx: number,
    dy: number
}
