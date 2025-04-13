/// <reference path="../../Rendering/GenericObjectRenderer.ts" />

class MountainsRenderer extends GenericObjectRenderer<Mountain> {
    private readonly lineWidth = 4;

    protected is(object: GridObject) : object is Mountain {
        return MountainsHelper.isMountain(object);
    }

    protected draw(mountain: Mountain, drawer: CellDrawer) {
        const halfWidth = mountain.width / 2,
            height = mountain.height,
            position = mountain.position,
            p1 = {
                x: position.x - halfWidth,
                y: position.y
            },
            p2 = {
                x: position.x,
                y: position.y - height,
            },
            p3 = {
                x: position.x + halfWidth,
                y: position.y
            };

        drawer.line([p1, p2, p3], {
            lineCap: 'round',
            lineJoin: 'round',
            lineWidth: this.lineWidth
        });
    }
}