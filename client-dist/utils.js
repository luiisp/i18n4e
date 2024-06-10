"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncWithServer = void 0;
const config_1 = require("../client/config");
const syncWithServer = (syncType, data) => __awaiter(void 0, void 0, void 0, function* () {
    const syncTypeParams = config_1.syncWithServerTypes[syncType];
    if (!syncTypeParams)
        return console.error("i18n4e Invalid syncType");
    try {
        const response = yield fetch(syncTypeParams.path, {
            method: syncTypeParams.method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            if (response.status === 404) {
                console.error("The i18n4e was unable to complete the action. You need to enable enableClient=true on your server -->", response.statusText);
            }
            return response;
        }
        const responseData = yield response.json();
        return true;
    }
    catch (error) {
        console.error("i18n4e -> An error occurred while syncing with the server:", error);
        return error;
    }
});
exports.syncWithServer = syncWithServer;
