interface options {
    defaultLang?: string;
    langsFolder?: string;
    mainFile?: string;
    extraFiles?: string;
    previousLocalsMiddleware?: boolean;
    path?: string;
}
interface I18n4e {
    languages: any;
    defaultLang: string;
    path: string;
    init: (app: any, // You might want to replace `any` with a specific type
    options?: options, renderWithDocument?: boolean) => Promise<any>;
}
declare const i18n4e: I18n4e;
export default i18n4e;
//# sourceMappingURL=i18n4e.main.d.ts.map