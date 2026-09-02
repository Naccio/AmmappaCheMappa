import { Vector } from "../Model/Vector";
import { VectorMath } from "./VectorMath";

export class VectorCalculator {
    constructor(public x: number, public y: number) {
    }

    public add(x: number, y: number): VectorCalculator;
    public add(v: Vector): VectorCalculator;
    public add(xOrV: number | Vector, y?: number) {
        const v = this.getVector(xOrV, y);

        return VectorMath.add(this, v);
    }

    public angle(v?: Vector) {
        return VectorMath.angle(this, v);
    }

    public clamp(min: number, max: number) {
        return VectorMath.clamp(this, min, max);
    }

    public direction(v: Vector) {
        return VectorMath.direction(this, v);
    }

    public distance(v: Vector) {
        return VectorMath.distance(this, v);
    }

    public divide(n: number) {
        return VectorMath.divide(this, n);
    }

    public dotProduct(v: Vector) {
        return VectorMath.dotProduct(this, v);
    }

    public hadamardProduct(v: Vector) {
        return VectorMath.hadamardProduct(this, v);
    }

    public invert() {
        return VectorMath.invert(this);
    }

    public isEqual(v: Vector) {
        return VectorMath.isEqual(this, v);
    }

    public magnitude() {
        return VectorMath.magnitude(this);
    }

    public multiply(n: number) {
        return VectorMath.multiply(this, n);
    }

    public normalize() {
        return VectorMath.normalize(this);
    }

    public rotate(rad: number) {
        return VectorMath.rotate(this, rad);
    }

    public round(places: number) {
        return VectorMath.round(this, places);
    }

    public subtract(x: number, y: number): VectorCalculator;
    public subtract(v: Vector): VectorCalculator;
    public subtract(xOrV: number | Vector, y?: number) {
        const v = this.getVector(xOrV, y);

        return VectorMath.subtract(this, v);
    }

    private getVector(xOrV: number | Vector, y?: number): Vector {
        if (typeof xOrV === 'number') {
            return {
                x: xOrV,
                y: y ?? 0
            };
        } else {
            return xOrV;
        }
    }
}
