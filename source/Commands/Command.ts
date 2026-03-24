/// <reference path="../Events/ApplicationEvent.ts" />

interface Command {
    get disabled(): boolean;
    get label(): string;
    execute(): void;
    onChange(handler: EventHandler<boolean>): void;
}