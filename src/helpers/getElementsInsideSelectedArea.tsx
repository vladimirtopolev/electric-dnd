import {Point, Element} from '../types';
import {rotateCartesianVector} from './vectors';

export default (elements: Element[], selectedArea: { start: Point, end: Point }): Element[] => {

    const {start, end} = selectedArea;
    const x1Outer = Math.min(start.x, end.x);
    const x2Outer = Math.max(start.x, end.x);
    const y1Outer = Math.min(start.y, end.y);
    const y2Outer = Math.max(start.y, end.y);


    return elements.filter(el => {
        const elementBorderWithRotation = rotateCartesianVector(el.getBorders(), el.rotate);

        const x1Inside = Math.min(el.x, el.x + elementBorderWithRotation.dx);
        const x2Inside = Math.max(el.x, el.x + elementBorderWithRotation.dx);
        const y1Inside = Math.min(el.y, el.y + elementBorderWithRotation.dy);
        const y2Inside = Math.max(el.y, el.y + elementBorderWithRotation.dy);
        return (x1Outer < x1Inside && x2Inside < x2Outer && y1Outer < y1Inside && y2Inside < y2Outer);
    });
}
