/// <reference path='../../UI/Tools/CellTool.ts'/>
/// <reference path='MountainFactory.ts'/>
/// <reference path='MountainsHelper.ts'/>

class MountainsTool extends CellTool {
    public readonly id = 'mountains';
    public readonly labelResourceId = 'tool_label_mountains';

    constructor(mapAccessor: MapAccessor, private mountainFactory: MountainFactory, private layers: LayersManager) {
        super(mapAccessor);
    }

    public useOnCell(cell: CellIndex) {
        const mountains: Mountain[] = [];

        for (let quadrant = 0; quadrant < 4; quadrant++) {
            const mountain = this.mountainFactory.create(quadrant);

            mountains.push(mountain);
        }

        this.layers.setObjects(cell, mountains);
    }
}