/// <reference path="Model/Line.ts" />

class VectorMath {
    public static readonly zero = {
        x: 0,
        y: 0
    };

    public static add(v1: Vector, v2: Vector) {
        return new VectorCalculator(v1.x + v2.x, v1.y + v2.y);
    }

    public static angle(v1: Vector, v2: Vector) {
        v1 = this.normalize(v1);
        v2 = this.normalize(v2);

        return Math.acos(this.dotProduct(v1, v2));
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

    public static divide(v: Vector, number: number) {
        return new VectorCalculator(v.x / number, v.y / number);
    }

    public static dotProduct(v1: Vector, v2: Vector) {
        return v1.x * v2.x + v1.y * v2.y;
    }

    public static invert(v: Vector) {
        return this.multiply(v, -1);
    }

    public static isEqual(v1: Vector, v2: Vector) {
        return v1.x === v2.x && v1.y === v2.y;
    }

    // http://paulbourke.net/geometry/pointlineplane/
    public static lineIntersection(line1: Line, line2: Line) : Point | undefined {
        const p1 = line1.from,
            p2 = line1.to,
            p3 = line2.from,
            p4 = line2.to,
            x1 = p1.x,
            y1 = p1.y,
            x2 = p2.x,
            y2 = p2.y,
            x3 = p3.x,
            y3 = p3.y,
            x4 = p4.x,
            y4 = p4.y,
            denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

        // Either segment length is 0
        if (this.isEqual(p1, p2) || this.isEqual(p3, p4)) {
            return undefined;
        }

        // Lines are parallel
        if (denominator === 0) {
            return undefined;
        }
    
        const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator,
            ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
    
        // Segments do not intersect
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
            return undefined;
        }
        
        return {
            x: x1 + ua * (x2 - x1),
            y: y1 + ua * (y2 - y1)
        };
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