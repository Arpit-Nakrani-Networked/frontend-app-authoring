import axios, { AxiosRequestConfig, CancelToken } from 'axios';
import Cookies from 'universal-cookie';
import cacheService from './cache.service';
import { NETWORKED_BACKEND_URL, NETWORKED_FRONTEND_URL } from './constants';

// --- ENUMS & INTERFACES ---

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface HttpOptions {
  headers?: Record<string, string>;
  cancelToken?: CancelToken;
  customBaseURL?: string;
  noCache?: boolean;
  cacheKey?: string;
  onSuccess?: (res: any) => void;
  onError?: (err: any) => void;
}

// --- AXIOS INSTANCE WITH INTERCEPTORS ---
const BASE_URL = `${NETWORKED_BACKEND_URL}/api/v1`;
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config) =>
  // Attach auth tokens or log requests here
  config);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

// --- HTTP WRAPPER CLASS ---

export function handleStatusCatch(status?: number) {
  if (Boolean(status === 401 || status === 552 || status === 405) && !window.location.hostname.includes('local')) {
    localStorage.removeItem('communityName');
    localStorage.removeItem('user');
    localStorage.removeItem('communityImage');
    window.location.href = `${NETWORKED_FRONTEND_URL}/login`;
  }
}


export class HttpWrapper {
  private static getDefaultHeader() {
    const cookies = new Cookies();
    return {
      sessionToken: cookies.get('openedxSessionToken'),
      openedxCommunityId: cookies.get('openedxCommunityId'),
    };
  }

  static async call<T>(
    method: HttpMethod,
    url: string,
    data?: any,
    options?: HttpOptions,
    custom?: boolean,
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      method,
      url,
      headers: options?.headers || {},
      cancelToken: options?.cancelToken,
      baseURL: custom ? 'http://localhost:3002/api/v1' : axiosInstance.defaults.baseURL,
    };

    // For GET/DELETE, use `params`; for POST/PUT, use `data`
    if (method === HttpMethod.GET || method === HttpMethod.DELETE) {
      config.params = data;
    } else {
      config.data = data;
    }

    // In-memory GET cache
    if (method === HttpMethod.GET && options?.cacheKey && !options?.noCache) {
      const cached = cacheService.getItem(options.cacheKey);
      if (cached) {
        options.onSuccess?.(cached);
        return Promise.resolve(cached);
      }
    }

    try {
      const headers = { ...HttpWrapper.getDefaultHeader(), ...config.headers };
      const fH = {};
      for (const i in headers) {
        if (headers[i] !== undefined) { fH[i] = headers[i]; }
      }
      config.headers = fH;
      const response = await axiosInstance(config);
      options?.onSuccess?.(response.data);

      // Set cache if applicable
      if (method === HttpMethod.GET && options?.cacheKey && !options?.noCache) {
        cacheService.setItem(options.cacheKey, response.data);
      }

      return response.data?.data;
    } catch (error: any) {
      const processedError = HttpWrapper.processError(error);
      options?.onError?.(processedError);
      throw processedError;
    }
  }

  private static processError(error: any) {
    if (axios.isCancel(error)) {
      return { message: 'Request cancelled', status: 499 };
    }

    if (!error.response) {
      return { message: 'Network error', status: 503 };
    }

    const { status } = error;
    const message = error.response.data?.message || error.response.statusText || 'Something went wrong';

    handleStatusCatch(status)


    return {
      message,
      status,
      data: error.response.data,
    };
  }
}

