class Utilities {

    public static download(filename: string, content: string) {
        const element = document.createElement('a');

        element.href = content;
        element.download = filename;
      
        element.click();
    }

    public static hasFlag(value: number, flag: number) {
        return (value & flag) === flag;
    }

    public static loadFile(callback: (file: string) => void) {
        const input = document.createElement("input");

        input.type = 'file';
        input.style.display = 'none';
        input.onchange = (e) => this.readFile(e, (f) => {
            callback(f);
            input.remove();
        });
        input.oncancel = () => input.remove();

        document.body.appendChild(input)

        input.click();
    }

    public static parseMap(input: string) {
        const data = JSON.parse(input);

        //TODO: Validate input
        return data as GridMap;
    }

    public static readFile(e: Event, callback: (file: string) => void) {
        const input = e.target;

        if (!(input instanceof HTMLInputElement) || input.files === null) {
            throw new Error('Event must be triggered from file input.');
        }

        const file = input.files[0],
            reader = new FileReader();

        reader.onload = function(e) {
            const contents = e.target?.result;

            if (typeof contents === 'string') {
                callback(contents);
            } else {
                throw new Error('File must be text');
            }
        }
        reader.readAsText(file);
    }
}