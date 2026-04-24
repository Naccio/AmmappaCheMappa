import { Observable } from "../../Engine/Events/Observable";
import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";
import { MapManager } from "../../Maps/MapManager";
import { CellIndex } from "../../Model/CellIndex";
import { MapObject } from "../../Model/MapObject";
import { Point } from "../../Model/Point";
import { GridHelper } from "../../Utilities/GridHelper";
import { VectorMath } from "../../Utilities/VectorMath";
import { RadioSelect } from "../RadioSelect";
import { ModalLauncher } from "../ModalLauncher";
import { Tool } from "./Tool";

class CellContext {
    public constructor(
        public readonly cell: CellIndex,
        public readonly objects: MapObject[]
    ) { }
}

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
            context = new CellContext(cell, this.mapManager.mapAccessor.map.data.objects.filter(o => o.cell === cellName)),
            container = document.createElement('div'),
            drawer = this.draw(context),
            list = this.buildList(context);

        container.style.display = 'flex';
        container.style.alignItems = 'start';

        container.append(drawer.html, list.html);

        this.modal.launch(cellName, [container]);
    }

    public move() {
    }

    public stop() {
    }

    private buildList(context: CellContext) {
        const selected = new Observable<MapObject | undefined>(undefined),
            list = new RadioSelect(selected, context.objects, (item, label) => {
                label.innerText = item.type;
            });

        return list;
    }

    private draw(context: CellContext) {
        const scale = 3,
            size = this.mapManager.mapAccessor.map.data.pixelsPerCell * scale,
            drawer = this.drawerFactory.create('select-modal', size, size);

        this.mapManager.layers.layers.forEach(l => {
            const cellDrawer = this.mapManager.cells.render(context.cell, l.id, scale);

            drawer.image(cellDrawer, VectorMath.zero);
        });

        return drawer;
    }
}