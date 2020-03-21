import { createMemoryHistory, createBrowserHistory } from "history";

export const isServer = () => {
  return typeof window === 'undefined'
}

// https://stackoverflow.com/a/51511967/12005425
export const getHistory = (url = '/') => {
  const history = isServer() ?
    createMemoryHistory({
      initialEntries: [url]
    }) : createBrowserHistory();

  return history;
}