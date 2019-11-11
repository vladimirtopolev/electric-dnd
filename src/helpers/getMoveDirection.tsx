import {Offset} from '../types';
import {KeyboardEvent} from 'react';

export default (e: KeyboardEvent<HTMLDivElement>): Offset => {
    console.log(e.key);
    switch (e.key) {
        case 'ArrowUp': {
            return {dx: 0, dy: -1};
        }
        case 'ArrowDown': {
            return {dx: 0, dy: 1};
        }
        case 'ArrowRight': {
            return {dx: 1, dy: 0};
        }
        case 'ArrowLeft': {
            return {dx: -1, dy: 0};
        }
        default: {
            return {
                dx: 0,
                dy: 0
            };
        }
    }
}
