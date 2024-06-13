export type CallSite = {
	getFileName: () => string | null;
	getLineNumber: () => number | null;
	getColumnNumber: () => number | null;
	getFunctionName: () => string | null;
	getTypeName: () => string | null;
};

export type LangObj = {
	[key: string]: string;
  };


export type Route = {
	path: string;
	method: string;
};
