/// <reference path="../Model/EditorMap.ts" />
/// <reference path="../VectorMath.ts" />

class MapDrawer {
    private actualShift: Vector = VectorMath.zero;
    private currentShift: Vector = VectorMath.zero;

    constructor(public map: EditorMap, private container: HTMLElement) {
    }

    public center() {
        this.shift(VectorMath.multiply(this.currentShift, -1));
    }

    public getMapPoint(viewportPoint: Point): Point {
        return VectorMath.subtract(viewportPoint, this.actualShift);
    }

    public resize(direction: number) {
        const map = this.map,
            mapData = map.data,
            min = 1,
            max = 5,
            currentZoom = map.zoom,
            newZoom = MathHelper.clamp(currentZoom + direction, min, max),
            multiplier = mapData.pixelsPerCell / newZoom;

        map.zoom = newZoom;

        this.container.style.width = mapData.columns * multiplier + 'px';
        this.container.style.height = mapData.rows * multiplier + 'px';

        //TODO: Adapt shift to zoom
        this.shift(VectorMath.zero);
    }

    public shift(vector: Vector) {
        this.currentShift = VectorMath.add(this.currentShift, vector);
        this.actualShift = this.computeActualShift();

        this.container.style.left = this.actualShift.x + 'px';
        this.container.style.top = this.actualShift.y + 'px';
    }

    private computeActualShift() {
        const container = this.container,
            parent = container.parentElement ?? container;

        const shiftToCenter = {
            x: (parent.clientWidth - container.clientWidth) / 2,
            y: (parent.clientHeight - container.clientHeight) / 2
        };

        return VectorMath.add(this.currentShift, shiftToCenter);
    }
}