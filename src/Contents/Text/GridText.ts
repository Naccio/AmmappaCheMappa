/// <reference path="../../Model/GridObject.ts" />
/// <reference path="../../Model/Point.ts" />

interface GridText extends GridObject {
    position: Point,
    value: string,
    fontSize: number
}