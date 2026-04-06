import { AxiosRequestConfig } from "axios";
import api from "@/lib/axios";

type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

const DEFAULT_TTL_MS = 20000;
const responseCache = new Map<string, CacheEntry<unknown>>();
const inflightRequests = new Map<string, Promise<unknown>>();

function buildCacheKey(url: string, params?: AxiosRequestConfig["params"]) {
  return `${url}::${JSON.stringify(params ?? {})}`;
}

export async function getWithCache<T>(
  url: string,
  config?: AxiosRequestConfig,
  ttlMs: number = DEFAULT_TTL_MS
): Promise<T> {
  const key = buildCacheKey(url, config?.params);
  const now = Date.now();

  //* Verificar si hay una respuesta en caché válida
  const cached = responseCache.get(key) as CacheEntry<T> | undefined;
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  //* Verificar si ya hay una solicitud en curso para esta clave
  const inflight = inflightRequests.get(key) as Promise<T> | undefined;
  if (inflight) {
    return inflight;
  }

  const request = api
    .get<T>(url, config)
    .then((response) => {
      responseCache.set(key, {
        data: response.data,
        expiresAt: Date.now() + ttlMs,
      });
      return response.data;
    })
    .finally(() => {
      inflightRequests.delete(key);
    });

  inflightRequests.set(key, request as Promise<unknown>);
  return request;
}

export function invalidateCacheByPrefix(prefix: string) {
  for (const key of responseCache.keys()) {
    if (key.startsWith(prefix)) {
      responseCache.delete(key);
    }
  }
}

export function clearApiCache() {
  responseCache.clear();
  inflightRequests.clear();
}
