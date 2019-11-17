import {useState} from 'react';
import {Connection, Element} from '../types';
import {isArray} from 'lodash';
export default () => {
    const [elements, setElements] = useState<Element[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);


    const deleteElements = (deletingElements: Element | Element[]) => {
        const deletedElements: Element[] = isArray(deletingElements) ? deletingElements : [deletingElements];
        setElements(elements.reduce((memo, element) => {
            const isDeletingElement = deletedElements.find(el => el.id === element.id);
            return isDeletingElement ? memo : [...memo, element];
        }, [] as Element[]));
        setConnections(connections.reduce((memo, connection) => {
            const isFirstElementDeleting = deletedElements.find(el => el.id === connection.first.element.id);
            const isSecondElementDeleting = deletedElements.find(el => el.id === connection.second.element.id);
            return (isFirstElementDeleting || isSecondElementDeleting) ? memo : [...memo, connection]
        }, [] as Connection[]))
    };

    return {elements, setElements, deleteElements, connections, setConnections};
}
