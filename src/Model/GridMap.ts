/// <reference path="MapLayer.ts" />

interface GridMap {
    id: string,
    columns: number,
    rows: number,
    zoom: number,
    pixelsPerCell: number,
    objects: { [index: string]: MapObject[] },
    layers: MapLayer[]
}