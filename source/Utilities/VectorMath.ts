import { MathHelper } from "./MathHelper";
import { Vector } from "../Model/Vector";
import { VectorCalculator } from "./VectorCalculator";

export class VectorMath {
    public static readonly zero = {
        x: 0,
        y: 0
    };

    private constructor() { }

    public static add(v1: Vector, v2: Vector) {
        return new VectorCalculator(v1.x + v2.x, v1.y + v2.y);
    }

    public static angle(v1: Vector, v2: Vector) {
        v1 = this.normalize(v1);
        v2 = this.normalize(v2);

        return Math.acos(this.dotProduct(v1, v2));
    }

    public static checkNormalized(v: Vector) {
        if (v.x < -1 || v.x > 1 || v.y < -1 || v.y > 1) {
            throw new Error(`Vector '${v.x},${v.y}' is not normalized.`);
        }
    }

    public static clamp(v: Vector, min: number, max: number) {
        return new VectorCalculator(
            MathHelper.clamp(v.x, min, max),
            MathHelper.clamp(v.y, min, max)
        );
    }

    public static direction(v1: Vector, v2: Vector) {
        return this.subtract(v2, v1).normalize();
    }

    public static distance(v1: Vector, v2: Vector) {
        const d = this.subtract(v2, v1);

        return Math.sqrt(Math.pow(d.x, 2) + Math.pow(d.y, 2));
    }

    public static divide(v: Vector, number: number) {
        return new VectorCalculator(v.x / number, v.y / number);
    }

    public static dotProduct(v1: Vector, v2: Vector) {
        return v1.x * v2.x + v1.y * v2.y;
    }

    public static hadamardProduct(v1: Vector, v2: Vector) {
        return new VectorCalculator(v1.x * v2.x, v1.y * v2.y);
    }

    public static invert(v: Vector) {
        return this.multiply(v, -1);
    }

    public static isEqual(v1?: Vector, v2?: Vector) {
        if (v1 === undefined || v2 === undefined) {
            return false;
        }

        return v1.x === v2.x && v1.y === v2.y;
    }

    public static magnitude(v: Vector) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }

    public static multiply(v: Vector, number: number) {
        return new VectorCalculator(v.x * number, v.y * number);
    }

    public static normalize(v: Vector) {
        const m = this.magnitude(v);

        return this.divide(v, m);
    }

    public static randomDirection() {
        const angle = MathHelper.random(-Math.PI, Math.PI);

        return new VectorCalculator(
            Math.cos(angle),
            Math.sin(angle)
        );
    }

    public static rotate(v: Vector, rad: number) {
        const cos = Math.cos(rad),
            sin = Math.sin(rad);

        return new VectorCalculator(
            cos * v.x - sin * v.y,
            sin * v.x + cos * v.y
        );
    }

    public static round(v: Vector, decimalPlaces: number) {
        return new VectorCalculator(
            MathHelper.round(v.x, decimalPlaces),
            MathHelper.round(v.y, decimalPlaces)
        );
    }

    public static startOperation(v: Vector) {
        return new VectorCalculator(v.x, v.y);
    }

    public static subtract(v1: Vector, v2: Vector) {
        return new VectorCalculator(v1.x - v2.x, v1.y - v2.y);
    }
}