export interface Point {
    x: number,
    y: number
}

export interface Element {
    id: string,
    originX: number,
    originY: number,
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
    id: string,
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

export interface CartesianVector{
    dx: number,
    dy: number
}

export interface PolarVector {
    r: number,
    deg: number
}
