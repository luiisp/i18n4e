import { Application } from "express";

import { routesNames } from "./configs"
import { I18n4e } from "./interfaces";


export const clientRoutes = (app: Application, i18n4e:I18n4e) => {
    if (!i18n4e.enableClient) return;
    

   app.get(routesNames.getLangs.path, (req, res) => {
        res.json(i18n4e.langsFilesPath)
   })

    app.post(routesNames.setLang.path, (req, res) => {
       const { lang } = req.body;
 //       req.session.lang = lang;
        res.json({ message: "Lang setted" });
    })

    app.get(routesNames.unsetLang.path, (req, res) => {
   //     req.session.lang = i18n4e.defaultLang;
        res.json({ message: "Lang unsetted" });
    })
    



};