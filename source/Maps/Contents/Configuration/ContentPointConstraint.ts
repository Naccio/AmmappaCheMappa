import { MapObject } from "../../../Model/MapObject";
import { Point } from "../../../Model/Point";
import { Vector } from "../../../Model/Vector";
import { MathHelper } from "../../../Utilities/MathHelper";

export interface ContentPointConstraint {
    apply(object: MapObject, pointIndex: number, change: Vector): boolean;
}

export class ApplyToOthersConstraint implements ContentPointConstraint {
    public constructor(private readonly indexes?: number[]) { }

    public apply(object: MapObject, pointIndex: number, change: Vector): boolean {
        if (this.indexes === undefined) {
            object.points.forEach(p => this.applyChange(p, change));
        } else {
            const indexes = [pointIndex, ...this.indexes];

            indexes.forEach(i => this.applyChange(object.points[i], change));
        }

        return false;
    }

    private applyChange(point: Point, change: Vector) {
        point.x += change.x;
        point.y += change.y;
    }
}

export class HorizontalConstraint implements ContentPointConstraint {
    public apply(object: MapObject, pointIndex: number, change: Vector): boolean {
        change.y = 0;
        return true;
    }
}

export class RangeConstraint implements ContentPointConstraint {
    public constructor(
        private readonly min: number,
        private readonly max: number
    ) {
    }

    public apply(object: MapObject, pointIndex: number, change: Vector): boolean {
        const point = object.points[pointIndex],
            minChangeX = this.min - point.x,
            maxChangeX = this.max - point.x,
            minChangeY = this.min - point.y,
            maxChangeY = this.max - point.y;

        change.x = MathHelper.clamp(change.x, minChangeX, maxChangeX);
        change.y = MathHelper.clamp(change.y, minChangeY, maxChangeY);
        return true;
    }
}

export class VerticalConstraint implements ContentPointConstraint {
    public apply(object: MapObject, pointIndex: number, change: Vector): boolean {
        change.x = 0;
        return true;
    }
}