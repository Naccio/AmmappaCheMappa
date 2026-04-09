import { EventHandler } from "../Events/ApplicationEvent";

export interface Command {
    get disabled(): boolean;
    get label(): string;
    execute(): void;
    onChange(handler: EventHandler<boolean>): void;
}