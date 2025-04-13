/// <reference path='GridObject.ts'/>

interface GridMap {
    columns: number,
    rows: number,
    zoom: number,
    pixelsPerCell: number,
    objects: { [index: string]: GridObject[] }
}