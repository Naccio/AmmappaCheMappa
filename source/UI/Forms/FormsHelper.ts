/// <reference path="Input.ts" />

class FormsHelper {

    public static createNumberInput(label: string, min: number, max: number) {
        const input = document.createElement('input');

        input.type = 'number';
        input.min = min.toString();
        input.max = max.toString();

        return new Input(input, label);
    }

    public static createSelect(label: string, options: { value: string, label: string }[]) {
        const select = document.createElement('select');

        options.forEach(o => {
            const option = document.createElement('option');

            option.value = o.value;
            option.innerText = o.label;

            select.append(option);
        });

        return new Input(select, label);
    }

    public static createTextInput(label: string) {
        const input = document.createElement('input');

        return new Input(input, label);
    }
}