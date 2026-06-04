import { MathHelper } from "../../Utilities/MathHelper";
import { CellIndex } from "../../Model/CellIndex";
import { CellTool } from "../../UI/Tools/CellTool";
import { VectorMath } from "../../Utilities/VectorMath";
import { MapManager } from "../../Maps/MapManager";
import { MapObject } from "../../Model/MapObject";
import { Point } from "../../Model/Point";

export class TreesTool extends CellTool {
    public readonly configuration = {
        id: 'trees',
        labelResourceId: 'tool_label_trees',
        layerTypes: ['terrain']
    };

    constructor(private readonly map: MapManager) {
        super(map.mapAccessor);
    }

    public useOnCell(cell: CellIndex) {
        const trees: MapObject[] = [],
            perColumn = 6,
            perRow = 4,
            xScale = 1 / perColumn,
            yScale = 1 / perRow;

        for (let x = 0; x < perColumn; x++) {
            for (let y = 0; y < perRow; y++) {
                const points = this.create()
                    .map(p => VectorMath.add(p, { x, y }).hadamardProduct({ x: xScale, y: yScale }));

                trees.push(this.map.createObject('tree', cell, points));
            }
        }

        this.map.clear(cell);
        this.map.addObjects(trees);
    }

    private create(): Point[] {
        const crownWidth = MathHelper.random(.4, .6),
            height = MathHelper.random(.8, .95),
            crownTrunkRatio = MathHelper.random(.2, .35),
            trunkHeight = height * crownTrunkRatio,
            crownHeight = height * (1 - crownTrunkRatio),
            position = {
                x: MathHelper.random(.35, .65),
                y: MathHelper.random(.8, 1)
            },
            trunkTop = {
                x: position.x,
                y: position.y - trunkHeight
            },
            crownCenter = {
                x: trunkTop.x,
                y: trunkTop.y - crownHeight / 2
            };

        return [
            position,
            crownCenter,
            trunkTop,
            {
                x: crownCenter.x + crownWidth / 2,
                y: crownCenter.y
            }
        ]
    }
}