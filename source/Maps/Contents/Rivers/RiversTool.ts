import { MapObject } from "../../../Model/MapObject";
import { Point } from "../../../Model/Point";
import { LinkedCellTool } from "../../../UI/Tools/LinkedCellTool";
import { BezierType, GeometryHelper } from "../../../Utilities/GeometryHelper";
import { GridHelper } from "../../../Utilities/GridHelper";
import { MathHelper } from "../../../Utilities/MathHelper";
import { VectorMath } from "../../../Utilities/VectorMath";
import { CellContext } from "../../Cells/CellContext";


export class RiversTool extends LinkedCellTool {
    public readonly configuration = {
        id: 'rivers',
        labelResourceId: 'tool_label_rivers',
        layerTypes: ['terrain']
    };

    protected createObject(cell: CellContext, from: Point, to: Point) {
        const control = this.generateControlPoints(from),
            points = [from, to, ...control];

        this.avoidLoops(points);

        const river = cell.createObject('river', points);

        cell.clear();
        cell.addObjects([river]);

        return river;
    }

    protected updateObject(cell: CellContext, object: MapObject, position: Point) {
        const points = [...object.points];

        points[1] = VectorMath.round(position, 2);
        this.avoidLoops(points);
        cell.update(object.id, points);
    }

    private avoidLoops(points: Point[]) {
        const bezier = {
            from: points[0],
            to: points[1],
            control1: points[2],
            control2: points[3]
        },
            threshold = 1000;

        let type = GeometryHelper.getBezierType(bezier),
            i = 0;

        while (type === BezierType.Cusp || type === BezierType.Loop) {
            const control = this.generateControlPoints(points[0]);

            bezier.control1 = control[0];
            bezier.control2 = control[1];
            type = GeometryHelper.getBezierType(bezier);

            if (i++ > threshold) {
                break;
            }
        }

        points[2] = bezier.control1;
        points[3] = bezier.control2;
    }

    private generateControlPoints(from: Point) {
        const previous = this.previousObject;
        let bend1 = this.generateControlPoint();

        if (previous !== undefined) {
            const direction = VectorMath.direction(previous.points[3], previous.points[1]),
                connection = GridHelper.getConnection(from, direction),
                maxLength = VectorMath.startOperation(connection.point)
                    .subtract(from)
                    .magnitude(),
                length = maxLength < .1 ? maxLength : MathHelper.random(.1, maxLength),
                scale = direction.multiply(length);

            bend1 = scale.add(from).round(2);
        }

        const bend2 = this.generateControlPoint();

        return [bend1, bend2];
    }

    private generateControlPoint() {
        return {
            x: MathHelper.round(MathHelper.random(.1, .9), 2),
            y: MathHelper.round(MathHelper.random(.1, .9), 2)
        };
    }
}