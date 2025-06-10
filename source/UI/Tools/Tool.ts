/// <reference path="../../Model/Point.ts" />
/// <reference path="ToolConfiguration.ts" />

interface Tool {
    readonly configuration: ToolConfiguration;

    start(position: Point): void;

    move(position?: Point): void;

    stop(position?: Point): void;
}