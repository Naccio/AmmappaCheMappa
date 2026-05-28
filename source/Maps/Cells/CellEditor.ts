import { ContentConfiguration } from "../../Contents/ContentConfiguration";
import { ContentPoint, ContentPointType } from "../../Contents/ContentPoint";
import { Observable } from "../../Engine/Events/Observable";
import { Drawer } from "../../Engine/Rendering/Drawer";
import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";
import { CellIndex } from "../../Model/CellIndex";
import { MapObject } from "../../Model/MapObject";
import { PointerButtons, PointerStatus, PointerTarget } from "../../UI/PointerTarget";
import { RadioSelect } from "../../UI/RadioSelect";
import { UIElement } from "../../UI/UIElement";
import { GridHelper } from "../../Utilities/GridHelper";
import { VectorMath } from "../../Utilities/VectorMath";
import { MapManager } from "../MapManager";
import { CellContext } from "./CellContext";
import { CellGraphics } from "./CellGraphics";

export class CellEditor implements UIElement {
    private readonly radius = .03;
    private readonly scale = 3;

    private readonly drawer: Drawer;
    private readonly graphics: CellGraphics;
    private readonly pointer: PointerTarget;
    private readonly container: HTMLDivElement;

    private readonly selectedObject: Observable<MapObject | undefined>;

    public readonly configuration = {
        id: 'select',
        labelResourceId: 'tool_label_select',
        layerTypes: []
    };

    private points: ContentPoint[] = [];
    private activePoint?: ContentPoint;

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
            drawer = drawerFactory.create(id, scale, scale, scale);

        this.selectedObject = new Observable<MapObject | undefined>(undefined);

        const list = new RadioSelect(this.selectedObject, context.objects, (item, label) => {
            label.innerText = item.type;
        });

        this.pointer = new PointerTarget();

        this.drawer = drawer;
        this.graphics = new CellGraphics(context, contents);

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
        this.graphics.render(this.drawer);

        points.forEach(p => {
            switch (p.type) {
                case ContentPointType.position:
                    this.drawer.circle(p.point, this.radius, { fillStyle: 'red' });
                    break;

                case ContentPointType.primary:
                    this.drawer.circle(p.point, this.radius, { fillStyle: 'blue' });
                    break;

                case ContentPointType.helper:
                    this.drawer.circle(p.point, this.radius, { fillStyle: 'green' });
                    break;

                default:
                    throw new Error(`Invalid point type: '${p.type}'.`);
            }
        });
    }

    private getPoints() {
        const selected = this.selectedObject.value,
            content = this.contents.find(c => c.type === selected?.type);

        this.points = selected !== undefined && content !== undefined
            ? content.points(selected)
            : [];
    }

    private mouseMoveHandler(s: PointerStatus | undefined) {
        if (s === undefined || s.button !== PointerButtons.primary) {
            this.activePoint = undefined;
            return;
        }

        const scale = this.scale * this.mapManager.mapAccessor.map.data.pixelsPerCell,
            pointer = VectorMath.divide(s.position, scale);

        if (this.activePoint) {
            const point = this.activePoint.point;

            point.x = pointer.x;
            point.y = pointer.y;
            this.draw();
        } else {
            this.activePoint = this.points.find(p =>
                p.point.x - this.radius < pointer.x &&
                p.point.x + this.radius > pointer.x &&
                p.point.y - this.radius < pointer.y &&
                p.point.y + this.radius > pointer.y
            );
        }
    }
}