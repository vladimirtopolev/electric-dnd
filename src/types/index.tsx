export interface Point {
    x: number,
    y: number
}


export interface ElementGeometry {
    element: Element,
    position: DOMRect
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


export interface Element {
    id: string,
    originX: number,
    originY: number,
    x: number,
    y: number,
    rotate: number,
    getBorders: () => CartesianVector,
    getConnectors: () => Point[],
    render: () => JSX.Element
}
