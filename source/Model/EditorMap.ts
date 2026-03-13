/// <reference path="MapData.ts" />
/// <reference path="Point.ts" />

interface EditorMap {
    data: MapData,
    zoom: number,
    position: Point,
    activeLayer: string
}