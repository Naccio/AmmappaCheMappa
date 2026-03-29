/// <reference path="../Localization/Localizer.ts" />
/// <reference path="../UI/ModalLauncher.ts" />
/// <reference path="SimpleCommand.ts" />

class About extends SimpleCommand {

    constructor(private modal: ModalLauncher, private localizer: Localizer) {
        super(localizer['command_label_about']);
    }

    public execute() {
        const quote = document.createElement('blockquote'),
            version = document.createElement('div'),
            versionLink = document.createElement('a');

        quote.innerText = this.localizer['paragraph_about'];

        versionLink.innerText = 'alpha.2';
        versionLink.href = 'https://github.com/Naccio/AmmappaCheMappa';
        versionLink.target = '_blank';

        version.innerText = 'v ';
        version.append(versionLink);

        this.modal.launch('Ammappa che mappa!', [quote, version]);
    }
}