/// <reference path="MapLayer.ts" />

interface MapData {
    id: string,
    columns: number,
    rows: number,
    pixelsPerCell: number,
    objects: { [index: string]: MapObject[] },
    layers: MapLayer[]
}