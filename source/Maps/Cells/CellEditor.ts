import { ContentConfiguration } from "../../Contents/ContentConfiguration";
import { ContentPoints } from "../../Contents/ContentPoints";
import { Observable } from "../../Engine/Events/Observable";
import { Drawer } from "../../Engine/Rendering/Drawer";
import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";
import { CellIndex } from "../../Model/CellIndex";
import { MapObject } from "../../Model/MapObject";
import { Point } from "../../Model/Point";
import { PointerButtons, PointerStatus, PointerTarget } from "../../UI/PointerTarget";
import { RadioSelect } from "../../UI/RadioSelect";
import { UIElement } from "../../UI/UIElement";
import { GridHelper } from "../../Utilities/GridHelper";
import { VectorMath } from "../../Utilities/VectorMath";
import { MapManager } from "../MapManager";

class CellContext {
    public constructor(
        public readonly cell: CellIndex,
        public readonly objects: MapObject[]
    ) { }
}

export class CellEditor implements UIElement {
    private readonly radius = .03;
    private readonly scale = 3;

    private readonly drawer: Drawer;
    private readonly ui: Drawer;
    private readonly pointer: PointerTarget;
    private readonly context: CellContext;
    private readonly container: HTMLDivElement;

    private readonly selectedObject: Observable<MapObject | undefined>;

    public readonly configuration = {
        id: 'select',
        labelResourceId: 'tool_label_select',
        layerTypes: []
    };

    private points: ContentPoints = {};
    private activePoint?: Point;

    public constructor(
        cell: CellIndex,
        private readonly mapManager: MapManager,
        drawerFactory: DrawerFactory,
        private readonly contents: ContentConfiguration[]
    ) {
        const cellName = GridHelper.cellIndexToName(cell),
            id = `${mapManager.id}-${cellName}-editor`,
            scale = this.scale * mapManager.mapAccessor.map.data.pixelsPerCell,
            context = new CellContext(cell, this.mapManager.mapAccessor.map.data.objects.filter(o => o.cell === cellName)),
            container = document.createElement('div'),
            drawer = drawerFactory.create(id, scale, scale),
            ui = drawerFactory.create(id + '-ui', scale, scale, scale);

        this.selectedObject = new Observable<MapObject | undefined>(undefined);

        const list = new RadioSelect(this.selectedObject, context.objects, (item, label) => {
            label.innerText = item.type;
        });

        this.pointer = new PointerTarget();

        this.drawer = drawer;
        this.ui = ui;
        this.context = context;

        container.style.display = 'flex';
        container.style.alignItems = 'start';

        this.pointer.html.append(this.drawer.html);
        container.append(this.pointer.html, list.html);

        this.container = container;

        this.pointer.status.subscribe(s => this.mouseMoveHandler(s));

        this.selectedObject.subscribe(_ => {
            this.getPoints();
            this.draw();
        });
    }

    public get html() {
        return this.container;
    }

    private draw() {
        const points = this.points,
            drawer = this.drawer;

        drawer.clear();
        this.ui.clear();
        this.mapManager.layers.layers.forEach(l => {
            const cellDrawer = this.mapManager.cells.render(this.context.cell, l.id, this.scale);

            drawer.image(cellDrawer, VectorMath.zero);
        });

        if (points.position) {
            this.ui.circle(points.position, this.radius, { fillStyle: 'red' });
        }

        if (points.mainPoints) {
            points.mainPoints.forEach(p => this.ui.circle(p, this.radius, { fillStyle: 'blue' }));
        }

        if (points.helperPoints) {
            points.helperPoints.forEach(p => this.ui.circle(p, this.radius, { fillStyle: 'green' }));
        }

        drawer.image(this.ui, VectorMath.zero);
    }

    private getPoints() {
        const selected = this.selectedObject.value,
            content = this.contents.find(c => c.type === selected?.type);

        this.points = selected !== undefined && content !== undefined
            ? content.points(selected)
            : {};
    }

    private mouseMoveHandler(s: PointerStatus | undefined) {
        if (s === undefined || s.button !== PointerButtons.primary) {
            this.activePoint = undefined;
            return;
        }

        const scale = this.scale * this.mapManager.mapAccessor.map.data.pixelsPerCell,
            pointer = VectorMath.divide(s.position, scale);

        if (this.activePoint) {
            this.activePoint.x = pointer.x;
            this.activePoint.y = pointer.y;
            this.draw();
        } else {
            let points: Point[] = [];

            if (this.points.helperPoints) {
                points = [...this.points.helperPoints];
            }

            if (this.points.mainPoints) {
                points = [...points, ...this.points.mainPoints];
            }

            if (this.points.position) {
                points.push(this.points.position);
            }

            this.activePoint = points.find(p =>
                p.x - this.radius < pointer.x &&
                p.x + this.radius > pointer.x &&
                p.y - this.radius < pointer.y &&
                p.y + this.radius > pointer.y
            );
        }
    }
}