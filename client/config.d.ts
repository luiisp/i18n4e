export declare const i18n4eMainRouteName = "/i18n4e/client/d/main";
export declare const routesNames: {
    getLangs: string;
    setLang: string;
    unsetLang: string;
};
type SyncType = 'setLang' | 'unsetLang';
export declare const syncWithServerTypes: Record<SyncType, {
    path: string;
    method: string;
}>;
export type i18n4e = {
    userLang: string;
    getLangs: () => Promise<any>;
    setLang: (lang: string) => void;
    unsetLang: () => void;
};
export {};
//# sourceMappingURL=config.d.ts.map