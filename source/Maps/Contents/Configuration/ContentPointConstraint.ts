import { MapObject } from "../../../Model/MapObject";
import { Point } from "../../../Model/Point";
import { Vector } from "../../../Model/Vector";

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

export class VerticalConstraint implements ContentPointConstraint {
    public apply(object: MapObject, pointIndex: number, change: Vector): boolean {
        change.x = 0;
        return true;
    }
}