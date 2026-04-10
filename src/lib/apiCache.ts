import { AxiosRequestConfig } from "axios";
import api from "./axios";

type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};
// TTL es el tiempo que un dato permanece en cache antes de ser considerado obsoleto (en milisegundos)
const DEFAULT_TTL_MS = 20000;
// responseCache almacena las respuestas de las solicitudes GET
const responseCache = new Map<string, CacheEntry<unknown>>();
// inflightRequests rastrea las solicitudes GET que están en curso para evitar duplicados
const inflightRequests = new Map<string, Promise<unknown>>();

//* Construye una clave unica para la cache basada en la URL y los parámetros de la solicitud
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

  const cached = responseCache.get(key) as CacheEntry<T> | undefined;
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const inflight = inflightRequests.get(key) as Promise<T> | undefined;
  if (inflight) {
    return inflight;
  }

  const request = api.get<T>(url, config).then((response) => {responseCache.set(key, {
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
  responseCache.forEach((_, key) => {
    if (key.startsWith(prefix)) {
      responseCache.delete(key);
    }
  });
}

export function clearApiCache() {
  responseCache.clear();
  inflightRequests.clear();
}
