import {Element} from '../types';
import React, {MouseEvent} from 'react';
import isClickedLeftMouseBtn from '../helpers/isClickedLeftMouseBtn';

export default class SvgElement {
    constructor(
        public element: Element,
        public index: number,
        public doubleClickElementHandler: (el: Element, event: MouseEvent) => void,
        public mouseDownElementHandler: (el: Element, event: MouseEvent) => void,
        public contextMenuElementHandler: (el: Element, event: MouseEvent) => void,
        public mouseDownConnectorHandler: (el: Element, connectorPointIndex: number, event: MouseEvent) => void,
        public mouseMoveConnectorHandler: (el: Element, connectorPointIndex: number, event: MouseEvent) => void,
        public clickElementHandler: (el: Element, event: MouseEvent) => void,
        public isActiveConnectorPoint: (el: Element, connectorIndex: number) => boolean
    ) {
    }

    render(isActive?: boolean): JSX.Element {
        return (
            <g transform={`translate(${this.element.x}, ${this.element.y}) rotate(${this.element.rotate})`}
               key={this.index}
               onDoubleClick={(e: MouseEvent) => this.doubleClickElementHandler(this.element, e)}
               onMouseDown={(e: MouseEvent) => isClickedLeftMouseBtn(e) && this.mouseDownElementHandler(this.element, e)}
               onContextMenu={(e: MouseEvent) => this.contextMenuElementHandler(this.element, e)}
               onClick={(e: MouseEvent) => this.clickElementHandler(this.element, e)}
            >
                {this.element.render()}
                {this.element.getConnectors().map((point, i) => {
                    return <circle cx={point.x}
                                   cy={point.y}
                                   r={5}
                                   key={i}
                                   fill={'red'}
                                   fillOpacity={
                                       this.isActiveConnectorPoint(this.element, i) ? 1 : 0}
                                   onMouseDown={(e: MouseEvent) => this.mouseDownConnectorHandler(this.element, i, e)}
                                   onMouseMove={(e: MouseEvent) => this.mouseMoveConnectorHandler(this.element, i, e)}
                    />;
                })}
                {isActive && this.element.renderBorderArea()}
            </g>
        );
    }
}
