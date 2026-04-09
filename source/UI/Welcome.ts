import { NewMap } from "../Commands/NewMap";
import { OpenMap } from "../Commands/OpenMap";
import { Localizer } from "../Localization/Localizer";
import { UIElement } from "./UIElement";

export class Welcome implements UIElement {
    private readonly container: HTMLDivElement;

    constructor(
        openCommand: OpenMap,
        newCommand: NewMap,
        localizer: Localizer
    ) {
        const container = document.createElement('div'),
            message = document.createElement('p'),
            buttons = document.createElement('div'),
            openButton = document.createElement('button'),
            newButton = document.createElement('button');

        container.id = 'welcome';

        message.innerText = localizer['paragraph_about'];

        openButton.innerText = localizer['command_label_open_map'];
        openButton.onclick = () => openCommand.execute();

        newButton.innerText = localizer['command_label_new_map'];
        newButton.onclick = () => newCommand.execute();

        buttons.append(openButton, newButton);
        container.append(message, buttons);

        this.container = container;
    }

    public get html() {
        return this.container;
    }

}