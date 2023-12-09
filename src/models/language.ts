export type LanguageLevelType = "Basic" | 'Intermediate' | 'Advanced' | 'Native'

export interface LanguageInterface {
    code: string;
    name: string;
    slug: string;
    level: LanguageLevelType;
}

export default class Language {
    code: string;
    name: string;
    slug: string;
    level: LanguageLevelType;

    constructor(data: LanguageInterface) {
        this.code = data.code;
        this.name = data.name;
        this.slug = data.slug;
        this.level = data.level;
    }
}