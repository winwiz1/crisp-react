import {
  createMemoryHistory,
  createBrowserHistory,
  History
}
from "history";

export const isServer = (): boolean => {
  return typeof window === "undefined";
}

// https://stackoverflow.com/a/51511967/12005425
export const getHistory = (url = "/"): History<unknown> => {
  const history = isServer() ?
    createMemoryHistory({
      initialEntries: [url]
    }) : createBrowserHistory();

  return history;
}

type PromiseCallback = () => void;

export class CallbackWrapper {
    constructor(readonly callback: PromiseCallback) {
    }
    readonly invoke = (): void => {
      this.callback();
    }
  }
