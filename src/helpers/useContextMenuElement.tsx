import {useState} from 'react';
import {ContextMenuElement} from '../types';

export default () => {
    const [contextMenuElement, setContextMenuElement] = useState<ContextMenuElement>();
    const closeContextMenuElement = () => setContextMenuElement(undefined);
    return {contextMenuElement, closeContextMenuElement, setContextMenuElement};
}
