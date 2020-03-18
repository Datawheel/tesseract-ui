export const CLIENT_BUILDURLS     = "explorer/CLIENT/BUILDURLS";
export const CLIENT_HYDRATEQUERY  = "explorer/CLIENT/HYDRATEQUERY";
export const CLIENT_LOADMEMBERS   = "explorer/CLIENT/LOADMEMBERS";
export const CLIENT_QUERY         = "explorer/CLIENT/QUERY";
export const CLIENT_SETCUBE       = "explorer/CLIENT/SETCUBE";
export const CLIENT_SETLOCALE     = "explorer/CLIENT/LOCALE";
export const CLIENT_SETUP         = "explorer/CLIENT/SETUP";

export const buildQueryUrls = () => ({type: CLIENT_BUILDURLS});
export const fetchMembers = cut => ({type: CLIENT_LOADMEMBERS, payload: cut});
export const runQuery = () => ({type: CLIENT_QUERY});
export const setCube = cubeName => ({type: CLIENT_SETCUBE, payload: cubeName});
export const setLocale = locale => ({type: CLIENT_SETLOCALE, payload: locale});
export const setupClient = serverUrl => ({type: CLIENT_SETUP, payload: serverUrl});