import { MapObject } from "../../../Model/MapObject";
import { Vector } from "../../../Model/Vector";
import { GeometryHelper } from "../../../Utilities/GeometryHelper";
import { MathHelper } from "../../../Utilities/MathHelper";
import { VectorMath } from "../../../Utilities/VectorMath";

export interface ContentPointConstraint {
    apply(object: MapObject, pointIndex: number, change: Vector): Vector;
}

export class BetweenConstraint implements ContentPointConstraint {
    public constructor(
        private readonly index1: number,
        private readonly index2: number
    ) { }

    apply(object: MapObject, pointIndex: number, change: Vector) {
        const points = object.points,
            point = points[pointIndex],
            newPoint = VectorMath.add(point, change),
            p1 = points[this.index1],
            p2 = points[this.index2],
            projection = GeometryHelper.getProjection(newPoint, { from: p1, to: p2 });

        return VectorMath.subtract(projection, point);
    }
}

export class BetweenConstraintOld implements ContentPointConstraint {
    public constructor(
        private readonly index1: number,
        private readonly index2: number
    ) { }

    apply(object: MapObject, pointIndex: number, change: Vector) {
        const points = object.points,
            point = points[pointIndex],
            p1 = points[this.index1],
            p2 = points[this.index2],
            minX = Math.min(p1.x, p2.x),
            maxX = Math.max(p1.x, p2.x),
            minY = Math.min(p1.y, p2.y),
            maxY = Math.max(p1.y, p2.y),
            minChangeX = minX - point.x,
            maxChangeX = maxX - point.x,
            minChangeY = minY - point.y,
            maxChangeY = maxY - point.y,
            direction = VectorMath.direction(p1, p2);

        change = direction.hadamardProduct(change);

        return {
            x: MathHelper.clamp(change.x, minChangeX, maxChangeX),
            y: MathHelper.clamp(change.y, minChangeY, maxChangeY)
        };
    }
}

export class CustomConstraint implements ContentPointConstraint {
    public constructor(private readonly action: (object: MapObject, pointIndex: number, change: Vector) => Vector) {
    }

    apply(object: MapObject, pointIndex: number, change: Vector) {
        return this.action(object, pointIndex, change);
    }
}

export class DirectionConstraint implements ContentPointConstraint {
    public constructor(private readonly direction: Vector) {
    }

    public apply(object: MapObject, pointIndex: number, change: Vector) {
        return VectorMath.hadamardProduct(change, this.direction);
    }
}

export class RangeConstraint implements ContentPointConstraint {
    public constructor(
        private readonly min: number,
        private readonly max: number
    ) {
    }

    public apply(object: MapObject, pointIndex: number, change: Vector) {
        const point = object.points[pointIndex],
            minChangeX = this.min - point.x,
            maxChangeX = this.max - point.x,
            minChangeY = this.min - point.y,
            maxChangeY = this.max - point.y;

        return {
            x: MathHelper.clamp(change.x, minChangeX, maxChangeX),
            y: MathHelper.clamp(change.y, minChangeY, maxChangeY)
        };
    }
}