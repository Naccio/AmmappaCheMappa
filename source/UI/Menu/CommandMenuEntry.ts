import { Command } from "../../Commands/Command";
import { ButtonMenuEntry } from "./ButtonMenuEntry";

export class CommandMenuEntry extends ButtonMenuEntry {
    constructor(command: Command) {
        super(command.label, () => command.execute());

        command.onChange(disabled => {
            this.button.disabled = disabled;
        })
    }
}