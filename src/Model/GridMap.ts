interface GridMap {
    columns: number,
    rows: number,
    zoom: number,
    pixelsPerCell: number,
    objects: { [index: string]: MapObject[] }
}