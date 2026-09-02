import { MapObject } from "../../../Model/MapObject";
import { Point } from "../../../Model/Point";
import { Vector } from "../../../Model/Vector";
import { VectorMath } from "../../../Utilities/VectorMath";

export interface ContentPointEffect {
    apply(object: MapObject, pointIndex: number, change: Vector): void;
}

export class ApplyToOthersEffect implements ContentPointEffect {
    public constructor(private readonly indexes?: number[]) { }

    public apply(object: MapObject, pointIndex: number, change: Vector) {
        const indexes = this.indexes ?? object.points.map((_, i) => i);

        indexes.forEach(i => {
            if (i !== pointIndex) {
                this.applyChange(object.points[i], change)
            }
        });
    }

    private applyChange(point: Point, change: Vector) {
        const newPoint = VectorMath.add(point, change).round(2);

        point.x = newPoint.x;
        point.y = newPoint.y;
    }
}