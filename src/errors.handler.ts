export const throwError = (consoleMsg: string, throwMsg: string | undefined ): never => {
    console.error(`\x1b[1m\x1b[31mE \x1b[0m \x1b[34mi18n4e\x1b[37m \x1b[1m->\x1b[0m ${consoleMsg}`);
    console.error(`\x1b[1m\x1b[31m%s\x1b[0m Msg Error: ${throwMsg}`)
    throw new Error(throwMsg);
};