import { Point } from "../Model/Point";
import { Vector } from "../Model/Vector";
import { VectorMath } from "../Utilities/VectorMath";
import { MapDrawer } from "./MapDrawer";
import { ClickEvent, PointerButtons, PointerStatus, PointerTarget, ZoomEvent } from "./PointerTarget";
import { ToolActivator } from "./Tools/ToolActivator";
import { UIElement } from "./UIElement";

export class DrawingArea implements UIElement {
    private readonly pointerTarget: PointerTarget;

    private started: boolean = false;
    private lastShift?: Point;

    constructor(
        private tool: ToolActivator,
        private drawer: MapDrawer
    ) {
        const target = new PointerTarget();

        target.html.className = 'drawing-area';
        target.html.append(drawer.html);

        target.status.subscribe(this.mouseMoveHandler);
        target.onClick(this.clickHandler);
        target.onZoom(this.zoomHandler);

        window.addEventListener('resize', this.resizeHandler);

        this.pointerTarget = target;
    }

    public get html() {
        return this.pointerTarget.html;
    }

    public setup() {
        this.drawer.resize(0);
    }


    // PRIVATE

    private getMapPoint(pointerPoint: Point) {
        return this.drawer.getMapPoint(pointerPoint);
    }

    private stop(position?: Point) {
        if (this.started) {
            this.tool.stop(position);
        }
        this.started = false;
        this.lastShift = undefined;
    }

    private updateShift(coordinates: Vector) {
        if (this.lastShift === undefined) {
            this.lastShift = coordinates;
            return;
        }

        const shift = VectorMath.subtract(coordinates, this.lastShift);

        this.lastShift = coordinates;
        this.drawer.shift(shift);
    }

    public zoom(direction: number) {
        this.drawer.resize(direction);
    }


    // HANDLERS

    private clickHandler = (e: ClickEvent) => {
        if (e.clicks === 1 && e.status.button === PointerButtons.primary && !this.started) {
            const position = this.getMapPoint(e.status.position);

            this.tool.start(position);
            this.tool.stop(position);
        }

        if (e.clicks === 2 && e.status.button === PointerButtons.auxiliary) {
            this.drawer.center();
        }
    }

    private mouseMoveHandler = (s?: PointerStatus) => {

        switch (s?.button) {
            case PointerButtons.auxiliary:
                this.updateShift(s.position);
                break;

            case PointerButtons.primary:
                const mapCoordinates = this.getMapPoint(s.position);

                if (this.started) {
                    this.tool.move(mapCoordinates);
                } else {
                    this.tool.start(mapCoordinates);
                    this.started = true;
                }
                break;

            case undefined:
                const position = s?.position
                    ? this.getMapPoint(s.position)
                    : undefined;

                this.stop(position);
                break;
        }
    }

    private resizeHandler = () => {
        this.setup();
    }

    private zoomHandler = (e: ZoomEvent) => {
        this.zoom(e.direction);
    }
}