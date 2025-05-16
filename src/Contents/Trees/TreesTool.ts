/// <reference path='../../UI/Tools/CellTool.ts'/>
/// <reference path='Tree.ts'/>
/// <reference path='TreesHelper.ts'/>

class TreesTool extends CellTool {
    public readonly configuration = {
        id: 'trees',
        labelResourceId: 'tool_label_trees',
        layerTypes: ['terrain']
    };

    constructor(mapAccessor: MapAccessor, private layers: LayersManager) {
        super(mapAccessor);
    }

    public useOnCell(cell: CellIndex) {
        const trees: Tree[] = [],
            perColumn = 6,
            perRow = 4,
            xScale = 1 / perColumn,
            yScale = 1 / perRow;

        for (let x = 0; x < perColumn; x++) {
            for (let y = 0; y < perRow; y++) {
                const tree = TreesHelper.create(),
                    position = VectorMath.add({ x, y }, tree.position);

                tree.crownHeight = MathHelper.round(tree.crownHeight * yScale, 2);
                tree.crownWidth = MathHelper.round(tree.crownWidth * xScale, 2);
                tree.trunkHeight = MathHelper.round(tree.trunkHeight * yScale, 2);
                tree.position = {
                    x: MathHelper.round(position.x * xScale, 2),
                    y: MathHelper.round(position.y * yScale, 2)
                }

                trees.push(tree);
            }
        }

        this.layers.setObjects(cell, trees);
    }
}