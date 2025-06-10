/// <reference path="../../Commands/Command.ts" />
/// <reference path="./MenuEntry.ts" />

class ButtonMenuEntry implements MenuEntry {
    
    constructor(private label: string, private action: () => void) {
    }

    public build() {
        const button = document.createElement('button');

        button.innerText = this.label;
        button.onclick = () => this.action();

        return button;
    }
}