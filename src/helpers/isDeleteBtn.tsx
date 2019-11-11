import {KeyboardEvent} from 'react';

export default (e: KeyboardEvent<HTMLDivElement>): boolean => {
    e.preventDefault();
    return e.key === 'Backspace' || e.key === 'Delete';
}
