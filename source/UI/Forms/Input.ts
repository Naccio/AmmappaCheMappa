/// <reference path="../../Utilities.ts" />
/// <reference path="../UIElement.ts" />

class Input implements UIElement {
    private readonly container: HTMLDivElement;

    public constructor(protected readonly input: HTMLInputElement | HTMLSelectElement, label: string) {
        const container = document.createElement('div'),
            labelElement = document.createElement('label');

        if (input.id === '') {
            input.id = Utilities.generateId('input');
        }

        labelElement.htmlFor = input.id;
        labelElement.innerText = label;

        container.append(label, input);

        this.container = container;
    }

    public get disabled() {
        return this.input.disabled;
    }

    public set disabled(value: boolean) {
        this.input.disabled = value;
    }

    public get html(): HTMLElement {
        return this.container;
    }

    public get required() {
        return this.input.required;
    }

    public set required(value: boolean) {
        this.input.required = value;
    }

    public get value() {
        return this.input.value;
    }

    public set value(value: string) {
        this.input.value = value;
    }
}