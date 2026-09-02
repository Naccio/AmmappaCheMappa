import { MapObject } from "../../../Model/MapObject";
import { Vector } from "../../../Model/Vector";
import { MathHelper } from "../../../Utilities/MathHelper";

export interface ContentPointConstraint {
    apply(object: MapObject, pointIndex: number, change: Vector): Vector;
}

export class CustomConstraint implements ContentPointConstraint {
    public constructor(private readonly action: (object: MapObject, pointIndex: number, change: Vector) => Vector) {
    }

    apply(object: MapObject, pointIndex: number, change: Vector) {
        return this.action(object, pointIndex, change);
    }
}

export class HorizontalConstraint implements ContentPointConstraint {
    public apply(object: MapObject, pointIndex: number, change: Vector) {
        return {
            x: change.x,
            y: 0
        };
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

export class VerticalConstraint implements ContentPointConstraint {
    public apply(object: MapObject, pointIndex: number, change: Vector) {
        return {
            x: 0,
            y: change.y
        };
    }
}