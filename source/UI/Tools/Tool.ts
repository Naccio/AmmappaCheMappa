import { Point } from "../../Model/Point";
import { ToolConfiguration } from "./ToolConfiguration";

export interface Tool {
    readonly configuration: ToolConfiguration;

    start(position: Point): void;

    move(position?: Point): void;

    stop(position?: Point): void;
}