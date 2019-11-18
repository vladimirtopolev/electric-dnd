import {Point, Element, WorkspacePosition} from '../types';
import {rotateCartesianVector} from './vectors';

export default (elements: Element[], selectedArea: { start: Point, end: Point }, workspacePosition: WorkspacePosition): Element[] => {

    const {scale, x, y} = workspacePosition;
    const {start, end} = selectedArea;
    const x1Outer = Math.min(start.x / scale - x, end.x / scale - x);
    const x2Outer = Math.max(start.x / scale - x, end.x / scale - x);
    const y1Outer = Math.min(start.y / scale - y, end.y / scale - y);
    const y2Outer = Math.max(start.y / scale - y, end.y / scale - y);


    return elements.filter(el => {
        const elementBorderWithRotation = rotateCartesianVector(el.getBorders(), el.rotate);

        const x1Inside = Math.min(el.x, el.x + elementBorderWithRotation.dx);
        const x2Inside = Math.max(el.x, el.x + elementBorderWithRotation.dx);
        const y1Inside = Math.min(el.y, el.y + elementBorderWithRotation.dy);
        const y2Inside = Math.max(el.y, el.y + elementBorderWithRotation.dy);
        return (x1Outer < x1Inside && x2Inside < x2Outer && y1Outer < y1Inside && y2Inside < y2Outer);
    });
}
