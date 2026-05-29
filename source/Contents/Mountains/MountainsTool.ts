import { MapManager } from "../../Maps/MapManager";
import { CellIndex } from "../../Model/CellIndex";
import { MapObject } from "../../Model/MapObject";
import { Point } from "../../Model/Point";
import { CellTool } from "../../UI/Tools/CellTool";
import { GridHelper } from "../../Utilities/GridHelper";
import { MathHelper } from "../../Utilities/MathHelper";
import { VectorMath } from "../../Utilities/VectorMath";

export class MountainsTool extends CellTool {
    public readonly configuration = {
        id: 'mountains',
        labelResourceId: 'tool_label_mountains',
        layerTypes: ['terrain']
    };

    constructor(private readonly map: MapManager) {
        super(map.mapAccessor);
    }

    public useOnCell(cell: CellIndex) {
        const mountains: MapObject[] = [];

        for (let quadrant = 0; quadrant < 4; quadrant++) {
            const points = this.create(quadrant),
                mountain = this.map.createObject('mountain', cell, points);

            mountains.push(mountain);
        }

        this.map.addObjects(mountains);
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