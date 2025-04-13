/// <reference path="../../Rendering/GenericObjectRenderer.ts" />
/// <reference path="Road.ts" />

class RoadRenderer extends GenericObjectRenderer<Road> {
    private readonly lineWidth = 2;

    protected is(object: GridObject) : object is Road {
        return object.type === 'road';
    }

    protected draw(road: Road, drawer: CellDrawer) {
        const from = road.from,
            to = road.to,
            direction = VectorMath.direction(from, to),
            shift1 = direction.multiply(.025).rotate(Math.PI / 2),
            from1 = shift1.add(from),
            to1 = shift1.add(to),
            shift2 = shift1.invert(),
            from2 = shift2.add(from),
            to2 = shift2.add(to),
            style : LineStyle = {
                lineWidth: this.lineWidth,
                ignoreBorders: true
            };

        drawer.line([from1, to1], style);
        drawer.line([from2, to2], style);
    }
}