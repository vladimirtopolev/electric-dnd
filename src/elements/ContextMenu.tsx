import React from 'react';
import {ContextMenuElement, Element} from '../types';
import './ContextMenu.styles.css';


export default ({contextMenuElement, setElements, elements, closeContextMenu, deleteElement}: {
    contextMenuElement: ContextMenuElement | undefined,
    deleteElement: (element: Element) => void,
    elements: Element[],
    setElements: (e: Element[]) => void,
    closeContextMenu: () => void
}) => {

    if (!contextMenuElement) {
        return null;
    }

    const {element, mousePosition: {x, y}} = contextMenuElement;

    const changeElementRotation = (deltaDeg: number) => {
        setElements(elements.map(el => {
            return el.id === element.id ? {...el, rotate: el.rotate + deltaDeg} : el;
        }));
        closeContextMenu();
    };

    return (
        <ul className="ContextMenu"
            style={{
                top: y,
                left: x
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
                            deleteElement(element);
                            closeContextMenu();
                        }}>Удалить
                </button>
            </li>
        </ul>
    );
}
