import { HttpEvent, HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../services/busy-service';
import { delay, finalize, of, tap } from 'rxjs';

const cache = new Map<string, HttpEvent<unknown>>(); // Simple in-memory cache for GET requests 11/11/2025

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // Inject BusyService here to avoid circular dependency issues
  const busyService = inject(BusyService);

  const generateCacheKey = (url: string, params: HttpParams): string => {
    const paramString = params
      .keys()
      .map((key) => `${key}=${params.get(key)}`)
      .join('&');
    return paramString ? `${url}?${paramString}` : url;
  };

  const invalidateCache = (urlPattern: string) => {
    for (const key of cache.keys()) {
      if (key.includes(urlPattern)) {
        cache.delete(key);
      }
    }
  };

  const cacheKey = generateCacheKey(req.url, req.params);

  if (req.method.includes('POST') && req.url.includes('/likes')) {
    invalidateCache('/likes');
  }

  if (req.method.includes('POST') && req.url.includes('/messages')) {
    invalidateCache('/messages');
  }

  if (req.method.includes('POST') && req.url.includes('/add-photo')) {
    invalidateCache('/photos');
  }

  if (req.method.includes('POST') && req.url.includes('/logout')) {
    cache.clear();
  }

  // Simple caching for GET requests (optional) 11/11/2025 =====================
  if (req.method === 'GET') {
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }
  }
  // ===========================================================================

  busyService.busy();

  // return next(req).pipe(
  //   delay(500),
  //   finalize(() => {
  //     busyService.idle();
  //   })
  // );

  // add caching for GET requests (optional) =====================
  return next(req).pipe(
    delay(500),
    tap((response) => {
      cache.set(cacheKey, response);
    }),
    finalize(() => {
      busyService.idle();
    })
  );
  // ===============================================================
};
