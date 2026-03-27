/// <reference path="DrawingLayer.ts" />

interface LayerAbstractFactory {
    get type(): string;
    createRenderer(id: string): LayerRenderer;
    createDrawing(id: string): DrawingLayer;
}