/// <reference path="CanvasDrawer.ts" />

class CellDrawer {
    constructor(private cellIndex: CellIndex, private mapAccessor: MapAccessor, private drawer: CanvasDrawer) {
    }

    public get cell() {
        return this.mapAccessor.getCell(this.index);
    }

    public get index() : CellIndex {
        return this.cellIndex;
    }

    public get map() {
        return this.mapAccessor.map;
    }

    public get pixelsPerCell() {
        return this.map.pixelsPerCell;
    }

    public bezier(from: Point, to: Point, control1: Point, control2: Point, style: LineStyle) {
        const ignoreBorders = style.ignoreBorders ?? false,
            padding = ignoreBorders ? undefined : style.lineWidth ?? 1;

        from = this.cellPointToMapPoint(from, padding);
        to = this.cellPointToMapPoint(to, padding);
        control1 = this.cellPointToMapPoint(control1, padding);
        control2 = this.cellPointToMapPoint(control2, padding);

        this.drawer.bezier(from, to, control1, control2, style);
    }

    public clear() {
        const pixels = this.pixelsPerCell,
            cell = this.cellIndex,
            point = {
                x: cell.column * pixels,
                y: cell.row * pixels,
            };

        this.drawer.clear(point, pixels, pixels);
    }

    public circle(point: Point, radius: number, style: ShapeStyle) {
        radius *= this.pixelsPerCell;

        point = this.cellPointToMapPoint(point, radius + 2);

        this.drawer.circle(point, radius, style);
    }

    public ellipse(point: Point, radiusX: number, radiusY: number, rotation: number, style: ShapeStyle) {
        radiusX *= this.pixelsPerCell;
        radiusY *= this.pixelsPerCell;

        const padding = {
            x: radiusX + 2,
            y: radiusY + 2
        };

        point = this.cellPointToMapPoint(point, padding);

        this.drawer.ellipse(point, radiusX, radiusY, rotation, style);
    }

    public line(points: readonly [Point, Point, ...Point[]], style: LineStyle) {
        const ignoreBorders = style.ignoreBorders ?? false,
            padding = ignoreBorders ? undefined : style.lineWidth ?? 1,
            mapPoints = points.map(p => this.cellPointToMapPoint(p, padding));

        this.drawer.line(mapPoints, style);
    }

    public text(point: Point, text: string, fontSize: number) {
        point = this.cellPointToMapPoint(point, undefined);
        fontSize *= this.pixelsPerCell;
        
        this.drawer.text(point, text, fontSize);
    }


    // PRIVATE

    private cellPointToMapPoint = (point: Point, padding?: number | Vector) => {
        const pixels = this.pixelsPerCell,
            cellShift = this.mapAccessor.getPosition(this.index);
            
        point = VectorMath.multiply(point, pixels);

        if (padding !== undefined) {
            let paddingX = 0,
                paddingY = 0;

            if (typeof padding === 'number') {
                paddingX = padding;
                paddingY = padding
            } else {
                paddingX = padding.x;
                paddingY = padding.y
            }

            point = {
                x: MathHelper.clamp(point.x, paddingX, pixels - paddingX),
                y: MathHelper.clamp(point.y, paddingY, pixels - paddingY)
            };
        }

        return VectorMath.add(point, cellShift);
    }
}