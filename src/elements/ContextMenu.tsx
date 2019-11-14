import React from 'react';
import {ContextMenuElement, Element, Point} from '../types';
import './ContextMenu.styles.css';


export default ({contextMenuElement, contextPosition, setElements, elements, closeContextMenu, deleteElement}: {
    contextMenuElement: Element | undefined | null,
    contextPosition: Point,
    deleteElement: (element: Element) => void,
    elements: Element[],
    setElements: (e: Element[]) => void,
    closeContextMenu: () => void
}) => {

    if (!contextMenuElement) {
        return null;
    }


    const changeElementRotation = (deltaDeg: number) => {
        setElements(elements.map(el => {
            return el.id === contextMenuElement.id ? {...el, rotate: el.rotate + deltaDeg} : el;
        }));
        closeContextMenu();
    };

    return (
        <ul className="ContextMenu"
            style={{
                top: contextPosition.y,
                left: contextPosition.x
            }}>
            <li>
                <button className="ContextMenu__btn"
                        onClick={() => changeElementRotation(+90)}>90º по часовой
                </button>
            </li>
            <li>
                <button className="ContextMenu__btn"
                        onClick={() => changeElementRotation(-90)}>90º против часовой
                </button>
            </li>
            <li>
                <button className="ContextMenu__btn"
                        onClick={() => {
                            deleteElement(contextMenuElement);
                            closeContextMenu();
                        }}>Удалить
                </button>
            </li>
        </ul>
    );
}
