import {CartesianVector, Offset, PolarVector} from "../types";

export function fromCartesianToPolarVector(cartesianVector: CartesianVector | Offset): PolarVector {
    const {dx, dy} = cartesianVector;
    const r = Math.pow(dx * dx + dy * dy, 0.5)
    return {
        r,
        deg: Math.acos(dx / r) * 180 / Math.PI
    }
}

export function fromPolarToCartesianVector(polarVector: PolarVector): CartesianVector {
    const {r, deg} = polarVector;
    return {
        dx: r * Math.cos(deg * Math.PI / 180),
        dy: r * Math.sin(deg * Math.PI / 180)
    }
}
