import { AxiosError, type AxiosAdapter, type AxiosResponse } from "axios";

export function createMemoryStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key) => store.get(key) ?? null,
    key: (index) => Array.from(store.keys())[index] ?? null,
    removeItem: (key) => {
      store.delete(key);
    },
    setItem: (key, value) => {
      store.set(key, value);
    },
  };
}

export function createAxiosErrorResponse(
  status: number,
  data: unknown,
  config: Parameters<AxiosAdapter>[0]
): AxiosError {
  const response: AxiosResponse = {
    status,
    statusText: String(status),
    headers: {},
    config,
    data,
  };
  return new AxiosError("Request failed", "ERR_BAD_REQUEST", config, null, response);
}
