
import * as fs from 'fs';
import { Application } from 'express';
import { routesNames } from './configs';
import { I18n4e, SupportedLanguage } from './interfaces';
import { LangObj } from './types';
import supportedLanguagesData from '../config/supportedLanguages.json';


export const clientRoutes = (app: Application, i18n4e: I18n4e) => {
  if (!i18n4e.enableClient) return;



  app.get(routesNames.getLangs.path, (req, res) => {
    let userLang: string = i18n4e.defaultLang;
    if (req.session){
      if (req.session.lang) {
        userLang = req.session.lang;
      }
    }
    const obj: LangObj = {};
    const data: { suportedLanguages: SupportedLanguage[] } = supportedLanguagesData;
    
    const i18n4eMainLangName = data.suportedLanguages.find(lang => lang.code === userLang)?.name;
    obj[userLang] = i18n4eMainLangName ? i18n4eMainLangName : userLang;

    Object.keys(i18n4e.langsFilesPath).forEach((code) => {
      if (code == userLang) return;
      const language = data.suportedLanguages.find(lang => lang.code === code);
      obj[code] = language ? language.name : code;
    });

    res.json(obj);
  });

  if (!i18n4e.useLangSession) return;

  app.post(routesNames.setLang.path, (req, res) => {
    let data = JSON.parse(req.headers.data as string);
    const lang = data.lang;
    req.session.lang = lang;
    res.json({ message: 'ok' });
  });

  app.get(routesNames.unsetLang.path, (req, res) => {
    req.session.lang = undefined;
    res.json({ message: 'ok' });
  });
};
