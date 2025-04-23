/// <reference path="DrawingLayer.ts" />

interface LayerAbstractFactory {
    type: string;
    create(): DrawingLayer;
}