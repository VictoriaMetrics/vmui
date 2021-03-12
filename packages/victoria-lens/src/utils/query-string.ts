import qs, {ParsedQs} from "qs";

export const setQueryStringWithoutPageReload = (qsValue: string): void => {
  const w = window;
  if (w) {
    const newurl = w.location.protocol +
        "//" +
        w.location.host +
        w.location.pathname +
        "?" +
        qsValue;
    w.history.pushState({ path: newurl }, "", newurl);
  }
};

export const setQueryStringValue = (
  newValue: Record<string, unknown>,
  queryString = window.location.search
): void => {
  const values = qs.parse(queryString, { ignoreQueryPrefix: true });
  const newQsValue = qs.stringify({ ...values, ...newValue }, { encode: false });
  setQueryStringWithoutPageReload(newQsValue);
};

export const getQueryStringValue = (
  key: string,
  queryString = window.location.search
): string | ParsedQs | string[] | ParsedQs[] | undefined => {
  const values = qs.parse(queryString, { ignoreQueryPrefix: true });
  return values[key];
};