/// <reference path="../Commands/New.ts" />
/// <reference path="../Commands/Open.ts" />
/// <reference path="../Localization/Localizer.ts" />
/// <reference path="UIElement.ts" />

class Welcome implements UIElement {
    private readonly container: HTMLDivElement;

    constructor (
        openCommand: Open,
        newCommand: New,
        localizer: Localizer
    ) {
        const container = document.createElement('div'),
            message = document.createElement('p'),
            buttons = document.createElement('div'),
            openButton = document.createElement('button'),
            newButton = document.createElement('button');

        container.id = 'welcome';

        message.innerText = localizer['paragraph_about'];

        openButton.innerText = localizer['command_label_open'];
        openButton.onclick = () => openCommand.execute();

        newButton.innerText = localizer['command_label_new'];
        newButton.onclick = () => newCommand.execute();

        buttons.append(openButton, newButton);
        container.append(message, buttons);

        this.container = container;
    }

    build() {
        return this.container;
    }

}