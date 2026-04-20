import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";
import { MapManager } from "../../Maps/MapManager";
import { Point } from "../../Model/Point";
import { GridHelper } from "../../Utilities/GridHelper";
import { VectorMath } from "../../Utilities/VectorMath";
import { ModalLauncher } from "../ModalLauncher";
import { Tool } from "./Tool";

export class SelectTool implements Tool {
    public readonly configuration = {
        id: 'select',
        labelResourceId: 'tool_label_select',
        layerTypes: []
    };

    public constructor(
        private readonly mapManager: MapManager,
        private readonly drawerFactory: DrawerFactory,
        private readonly modal: ModalLauncher
    ) { }

    public start(point: Point) {
        const cell = this.mapManager.mapAccessor.getIndex(point);

        if (cell === undefined) {
            return;
        }

        const cellName = GridHelper.cellIndexToName(cell),
            size = this.mapManager.mapAccessor.map.data.pixelsPerCell,
            drawer = this.drawerFactory.create(cellName + '-modal', size, size);

        this.mapManager.layers.layers.forEach(l => {
            const cellDrawer = this.mapManager.cells.render(cell, l.id);

            drawer.image(cellDrawer, VectorMath.zero);
        });

        this.modal.launch(cellName, [drawer.html]);
    }

    public move() {
    }

    public stop() {
    }
}