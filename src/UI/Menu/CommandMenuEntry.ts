/// <reference path="../../Commands/Command.ts" />
/// <reference path="./ButtonMenuEntry.ts" />

class CommandMenuEntry extends ButtonMenuEntry {
    constructor(command: Command) {
        super(command.label, () => command.execute());
    }
}