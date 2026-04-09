import { MenuEntry } from "./MenuEntry";

export class ButtonMenuEntry implements MenuEntry {

    protected button: HTMLButtonElement;

    constructor(private label: string, private action: () => void) {
        const button = document.createElement('button');

        button.innerText = this.label;
        button.onclick = () => this.action();

        this.button = button;
    }

    public build() {
        return this.button;
    }
}