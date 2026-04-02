/// <reference path="../../Commands/Command.ts" />
/// <reference path="CommandMenuEntry.ts" />
/// <reference path="MenuEntry.ts" />
/// <reference path="SubmenuMenuEntry.ts" />

class SubmenuBuilder {
    private readonly entries: MenuEntry[] = [];
    private readonly settings: SubmenuMenuSettings = {};

    constructor(private label: string) {
    }

    public addCommand(command: Command) {
        return this.addCustomEntry(new CommandMenuEntry(command));
    }

    public addCustomEntry(entry: MenuEntry) {
        this.entries.push(entry);
        return this;
    }

    public alignRight() {
        this.settings.align = 'right';
        return this;
    }

    public alwaysVisible() {
        this.settings.alwaysVisible = true;
        return this;
    }

    public build() {
        return new SubmenuMenuEntry(this.label, this.entries, this.settings);
    }
}