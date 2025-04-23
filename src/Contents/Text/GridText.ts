/// <reference path="../../Model/MapObject.ts" />
/// <reference path="../../Model/Point.ts" />

interface GridText extends MapObject {
    position: Point,
    value: string,
    fontSize: number
}