/// <reference path="../Model/GridMap.ts" />
/// <reference path="../VectorMath.ts" />

class MapDrawer {

    private readonly parentShift: Vector
    private actualShift: Vector = VectorMath.zero;
    private currentShift: Vector = VectorMath.zero;

    constructor(public map: GridMap, private container: HTMLElement) {
        const parentShift = container.parentElement?.getBoundingClientRect(); 

        this.parentShift = parentShift === undefined
            ? VectorMath.zero
            : parentShift;
    }

    public center() {
        this.shift(VectorMath.multiply(this.currentShift, -1));
    }

    public getMapPoint(viewportPoint: Point) : Point {
        return VectorMath.subtract(viewportPoint, this.actualShift);
    }

    public resize(direction: number) {
        const map = this.map,
            min = 1,
            max = 5,
            currentZoom = map.zoom,
            newZoom = MathHelper.clamp(currentZoom + direction, min, max),
            multiplier = map.pixelsPerCell / newZoom;

        map.zoom = newZoom;

        this.container.style.width = map.columns * multiplier + 'px';
        this.container.style.height = map.rows * multiplier + 'px';

        //TODO: Adapt shift to zoom
        this.shift(VectorMath.zero);
    }

    public shift(vector: Vector) {
        this.currentShift = VectorMath.add(this.currentShift, vector);
        this.actualShift = this.computeActualShift();

        const containerShift = VectorMath.subtract(this.actualShift, this.parentShift);
        
        this.container.style.left = containerShift.x + 'px';
        this.container.style.top = containerShift.y + 'px';
    }

    private computeActualShift() {
        const shiftToCenter = {
                x: (window.innerWidth - this.container.clientWidth) / 2,
                y: (window.innerHeight - this.container.clientHeight) / 2
            };
            
        return VectorMath.add(this.currentShift, shiftToCenter);
    }
}