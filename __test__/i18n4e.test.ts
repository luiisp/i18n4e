import {i18n4e} from "../src/index";
import * as path from "path";
import fs from "fs";
import express from "express";

jest.mock("../config/supportedLanguages.json")

describe('i18n4e -> (SST)', () =>{

    const app = express();


    it('should init i18n4e', () => {

        const sstInit = i18n4e.init(app, {
            serverSideTranslation:true
        });

        sstInit.then((result) => {
            expect(result).toBe(true);
        }).catch((error) => {
            expect(error).toBe(false);
        });



    });



});