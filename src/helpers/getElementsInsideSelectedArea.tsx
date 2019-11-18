import {Point, Element, WorkspacePosition} from '../types';
import {rotateCartesianVector} from './vectors';

export default (elements: Element[], selectedArea: { start: Point, end: Point }, workspacePosition: WorkspacePosition): Element[] => {

    const {scale} = workspacePosition;
    const {start, end} = selectedArea;
    const x1Outer = Math.min(start.x / scale, end.x / scale);
    const x2Outer = Math.max(start.x / scale, end.x / scale);
    const y1Outer = Math.min(start.y / scale, end.y / scale);
    const y2Outer = Math.max(start.y / scale, end.y / scale);


    return elements.filter(el => {
        const elementBorderWithRotation = rotateCartesianVector(el.getBorders(), el.rotate);

        const x1Inside = Math.min(el.x, el.x + elementBorderWithRotation.dx);
        const x2Inside = Math.max(el.x, el.x + elementBorderWithRotation.dx);
        const y1Inside = Math.min(el.y, el.y + elementBorderWithRotation.dy);
        const y2Inside = Math.max(el.y, el.y + elementBorderWithRotation.dy);
        return (x1Outer < x1Inside && x2Inside < x2Outer && y1Outer < y1Inside && y2Inside < y2Outer);
    });
}
