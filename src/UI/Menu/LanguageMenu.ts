/// <reference path="LanguageMenuEntry.ts" />
/// <reference path="SubmenuMenuEntry.ts" />

class LanguageMenu extends SubmenuMenuEntry {

    public constructor(localizer: Localizer) {
        const entries: LanguageMenuEntry[] = [];

        for (let language of LocalizationHelper.languages) {
            entries.push(new LanguageMenuEntry(language));
        }

        super(localizer['menu_label_language'], entries, { align: 'right' });
    }
}