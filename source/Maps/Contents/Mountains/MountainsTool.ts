import { MapObject } from "../../../Model/MapObject";
import { Point } from "../../../Model/Point";
import { CellTool } from "../../../UI/Tools/CellTool";
import { GridHelper } from "../../../Utilities/GridHelper";
import { MathHelper } from "../../../Utilities/MathHelper";
import { VectorMath } from "../../../Utilities/VectorMath";
import { CellContext } from "../../Cells/CellContext";
import { MapManager } from "../../MapManager";


export class MountainsTool extends CellTool {
    public readonly configuration = {
        id: 'mountains',
        labelResourceId: 'tool_label_mountains',
        layerTypes: ['terrain']
    };

    constructor(map: MapManager) {
        super(map);
    }

    public useOnCell(cell: CellContext) {
        const mountains: MapObject[] = [];

        for (let quadrant = 0; quadrant < 4; quadrant++) {
            const points = this.create(quadrant),
                mountain = cell.createObject('mountain', points);

            mountains.push(mountain);
        }

        cell.clear();
        cell.addObjects(mountains);
    }

    private create(quadrant?: number): Point[] {
        const M = MathHelper,
            scale = quadrant === undefined ? 1 : .5,
            width = M.round(M.random(.8, .9) * scale, 2),
            height = M.round(M.random(.5, .8) * scale, 2),
            x = M.random(.4, .6) * scale,
            y = M.random(.8, 1) * scale,
            halfWidth = width / 2,
            position = VectorMath
                .startOperation(GridHelper.quadrantShift[quadrant ?? 0])
                .multiply(scale)
                .add({ x, y })
                .round(2),
            p1 = {
                x: position.x - halfWidth,
                y: position.y
            },
            p2 = {
                x: position.x,
                y: position.y - height,
            },
            p3 = {
                x: position.x + halfWidth,
                y: position.y
            };

        return [p1, p2, p3];
    }
}