/// <reference path="DrawingLayer.ts" />

interface LayerAbstractFactory {
    type: string;
    createRenderer(id: string): LayerRenderer;
    createDrawing(id: string): DrawingLayer;
}