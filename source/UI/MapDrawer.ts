/// <reference path="../Model/EditorMap.ts" />
/// <reference path="../VectorMath.ts" />

class MapDrawer {
    private actualShift: Vector = VectorMath.zero;
    private readonly _container: HTMLDivElement;

    constructor(private map: EditorMap, private store: Store) {
        const container = document.createElement('div');

        container.style.position = 'absolute';

        this._container = container;

        this.computeSize();
    }

    public get container() {
        return this._container;
    }

    private get currentShift() {
        return this.map.position;
    }

    public center() {
        this.shift(VectorMath.multiply(this.currentShift, -1));
    }

    public getMapPoint(viewportPoint: Point): Point {
        return VectorMath.subtract(viewportPoint, this.actualShift);
    }

    public resize(direction: number) {
        const map = this.map,
            min = 1,
            max = 5,
            currentZoom = map.zoom,
            newZoom = MathHelper.clamp(currentZoom + direction, min, max);

        map.zoom = newZoom;

        this.computeSize();
        this.store.saveMap(map);
    }

    public shift(vector: Vector) {
        this.map.position = VectorMath.add(this.currentShift, vector);
        this.actualShift = this.computeActualShift();

        this.container.style.left = this.actualShift.x + 'px';
        this.container.style.top = this.actualShift.y + 'px';

        this.store.saveMap(this.map);
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

    private computeSize() {
        const map = this.map,
            mapData = map.data,
            multiplier = mapData.pixelsPerCell / map.zoom;

        this.container.style.width = mapData.columns * multiplier + 'px';
        this.container.style.height = mapData.rows * multiplier + 'px';

        //TODO: Adapt shift to zoom
        this.shift(VectorMath.zero);
    }
}