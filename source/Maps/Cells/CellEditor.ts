import { ContentPoint } from "../Contents/ContentPoint";
import { ContentPointType } from "../Contents/ContentPointType";
import { InternalObservable } from "../../Engine/Events/InternalObservable";
import { Drawer } from "../../Engine/Rendering/Drawer";
import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";
import { MapObject } from "../../Model/MapObject";
import { PointerButtons, PointerStatus, PointerTarget } from "../../UI/PointerTarget";
import { RadioSelect } from "../../UI/RadioSelect";
import { UIElement } from "../../UI/UIElement";
import { VectorMath } from "../../Utilities/VectorMath";
import { CellContext } from "./CellContext";
import { ContentsConfiguration } from "../Contents/Configuration/ContentsConfiguration";
import { CellRenderer } from "./CellRenderer";
import { CellIndex } from "../../Model/CellIndex";
import { GridHelper } from "../../Utilities/GridHelper";
import { ShapeStyle } from "../../Engine/Rendering/ShapeStyle";
import { Point } from "../../Model/Point";
import { Vector } from "../../Model/Vector";

export class CellEditor implements UIElement {
    private readonly radius = .02;
    private readonly scale = 2.5;

    private readonly drawer: Drawer;
    private readonly pointer: PointerTarget;
    private readonly container: HTMLDivElement;

    private readonly selectedObject: InternalObservable<MapObject | undefined>;

    private points: ContentPoint[] = [];
    private activePoint?: number;

    public constructor(
        private readonly cell: CellContext,
        drawerFactory: DrawerFactory,
        private readonly contents: ContentsConfiguration,
        private readonly renderer: CellRenderer
    ) {
        const scale = this.scale * cell.pixels,
            size = scale * 3,
            objects = cell.objects.value,
            container = document.createElement('div'),
            drawer = drawerFactory.create(size, size, scale);

        this.selectedObject = new InternalObservable<MapObject | undefined>(undefined);

        const list = new RadioSelect(this.selectedObject, objects, (item, label) => {
            label.innerText = item.type;
        });

        this.pointer = new PointerTarget();
        this.drawer = drawer;

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
        this.drawer.clear();
        this.drawCells();
        this.drawOverlay();
        this.drawConnections();
        this.drawPoints();
    }

    private drawConnections() {
        const points = this.points,
            drawer = this.drawer,
            alreadyDrawn = new Set<string>();

        for (let i = 0; i < points.length; i++) {
            const point = points[i];

            point.connections.forEach(c => {
                const key = [i, c].sort().toString();

                if (alreadyDrawn.has(key)) {
                    return;
                }

                const connectedPoint = points[c],
                    from = this.getRelativePoint(point),
                    to = this.getRelativePoint(connectedPoint);

                drawer.line([from, to], {
                    lineWidth: .01,
                    color: '#999',
                    dashed: true
                });
                alreadyDrawn.add(key);
            })

        }
    }

    private drawPoints() {
        const points = this.points,
            drawer = this.drawer;

        points.forEach(p => {
            const point = this.getRelativePoint(p);

            switch (p.type) {
                case ContentPointType.position:
                    drawer.circle(point, this.radius, { fillStyle: 'red' });
                    break;

                case ContentPointType.primary:
                    drawer.circle(point, this.radius, { fillStyle: 'blue' });
                    break;

                case ContentPointType.helper:
                    drawer.circle(point, this.radius, { fillStyle: 'green' });
                    break;

                default:
                    throw new Error(`Invalid point type: '${p.type}'.`);
            }
        });
    }

    private drawCell(cell?: CellContext) {
        if (cell === undefined) {
            return;
        }

        const shift = this.getCellShift(cell.index),
            image = this.renderer.render(cell, undefined, this.scale);

        this.drawer.image(image, shift);
    }

    private drawCells() {
        const c = this.cell,
            t = c.topNeighbor,
            r = c.rightNeighbor,
            b = c.bottomNeighbor,
            l = c.leftNeighbor,
            tr = t?.rightNeighbor,
            br = b?.rightNeighbor,
            bl = b?.leftNeighbor,
            tl = t?.leftNeighbor;

        [c, t, r, b, l, tr, br, bl, tl].forEach(c => this.drawCell(c));
    }

    private drawOverlay() {
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                const style: ShapeStyle = {
                    line: {
                        color: GridHelper.defaultGridColor,
                        lineWidth: .01
                    }
                };

                if (x !== 1 || y !== 1) {
                    style.fillStyle = 'rgba(215,215,215,.75)';
                }

                this.drawer.rectangle({ x, y }, 1, 1, style);
            }
        }
    }

    private getCellShift(index: CellIndex) {
        return {
            x: index.column + 1 - this.cell.index.column,
            y: index.row + 1 - this.cell.index.row
        };
    }

    private getPoints() {
        const selected = this.selectedObject.value;

        if (selected === undefined) {
            this.points = [];
        } else {
            const content = this.contents.get(selected.type);

            this.points = content.points.get(selected);
        }
    }

    private getRelativePoint(point: ContentPoint) {
        return VectorMath.add(point.point, this.getCellShift(this.cell.index));
    }

    private mouseMoveHandler(pointerStatus: PointerStatus | undefined) {
        const object = this.selectedObject.value;

        if (object === undefined) {
            return
        }

        if (pointerStatus?.button !== PointerButtons.primary) {
            this.commitChanges(object);
            return;
        }

        const scale = this.scale * this.cell.pixels,
            position = VectorMath.divide(pointerStatus.position, scale);

        if (this.activePoint === undefined) {
            this.selectPoint(position);
        } else {
            this.updatePoint(object, this.activePoint, position);
        }
    }

    private commitChanges(object: MapObject) {
        if (this.activePoint !== undefined) {
            this.cell.update(object.id, this.points.map(p => p.point));
        }
        this.activePoint = undefined;
    }

    private selectPoint(position: Point) {
        const index = this.points
            .map(p => this.getRelativePoint(p))
            .findIndex(p =>
                p.x - this.radius < position.x &&
                p.x + this.radius > position.x &&
                p.y - this.radius < position.y &&
                p.y + this.radius > position.y
            );

        this.activePoint = index === -1 ? undefined : index;
    }

    private updatePoint(object: MapObject, index: number, position: Point) {
        const point = this.points[index],
            relativePoint = this.getRelativePoint(point);

        let change: Vector = VectorMath.subtract(position, relativePoint);

        point.constraints.forEach(c => {
            change = c.apply(object, index, change);
        });

        const newPoint = VectorMath.startOperation(point.point)
            .add(change)
            .round(2);

        point.point.x = newPoint.x;
        point.point.y = newPoint.y;

        point.effects.forEach(e => e.apply(object, index, change));

        this.draw();
    }
}