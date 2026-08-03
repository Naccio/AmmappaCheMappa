import { ToolConfiguration } from "./ToolConfiguration";
import { ToolContext } from "./ToolContext";

export interface Tool {
    readonly configuration: ToolConfiguration;

    start(context: ToolContext): void;

    move(context: ToolContext): void;

    stop(context: ToolContext): void;
}