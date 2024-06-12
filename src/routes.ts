import { Application } from "express";
import { routesNames } from "./configs"
import { I18n4e } from "./interfaces";


export const clientRoutes = (app: Application, i18n4e:I18n4e) => {
    if (!i18n4e.enableClient) return;
    
    app.get(routesNames.getLangs.path, (req, res) => {
    res.json(Object.keys(i18n4e.langsFilesPath));
    });

   if (!i18n4e.useLangSession) return;

    app.post(routesNames.setLang.path, (req, res) => {
        let data = JSON.parse(req.headers.data as string);
        const lang = data.lang;
        req.session.lang = lang;
        res.json({ message: "ok" });
    })

    app.get(routesNames.unsetLang.path, (req, res) => {
        req.session.lang = undefined;
        res.json({ message: "ok" });
    })
    



};