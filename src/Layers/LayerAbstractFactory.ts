/// <reference path="DrawingLayer.ts" />

interface LayerAbstractFactory {
    type: string;
    createRenderer(): LayerRenderer;
    createDrawing(): DrawingLayer;
}