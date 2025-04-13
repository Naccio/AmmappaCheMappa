/// <reference path="../../Model/GridObject.ts" />

interface Tree extends GridObject {
    position: Point,
    crownWidth: number,
    crownHeight: number
    trunkHeight: number
}