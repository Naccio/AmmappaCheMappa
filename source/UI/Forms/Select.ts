/// <reference path="Input.ts" />

class Select extends Input {
    public constructor(label: string, options: { value: string, label: string }[]) {
        const select = document.createElement('select');

        options.forEach(o => {
            const option = document.createElement('option');

            option.value = o.value,
                option.innerText = o.label;

            select.append(option);
        });

        super(select, label);
    }
}