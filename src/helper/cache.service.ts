// cacheService.ts

type CacheObject = Record<string, any>;
const cacheServiceKey = 'cacheService';

function createCacheService() {
  function getCacheKey() {
    const communityId = localStorage.getItem('selected_community') || '';
    const userStr = localStorage.getItem('user');
    const userId = userStr ? JSON.parse(userStr)?.userId : '';
    if (!userId || !communityId) {
      return cacheServiceKey;
    }
    return `${cacheServiceKey}-${userId}-${communityId}`;
  }
  function setInLocalStorage(value: any) {
    localStorage.setItem(getCacheKey(), JSON.stringify(value));
  }

  function getInLocalStorage() {
    return JSON.parse(localStorage.getItem(getCacheKey()) || '{}');
  }

  function setItem(key: string, value: any): void {
    const cacheObject = getInLocalStorage();
    cacheObject[key] = value;
    setInLocalStorage(cacheObject);
  }

  function getItem(key: string): any | undefined {
    const cacheObject = getInLocalStorage();
    return cacheObject[key];
  }

  function removeItem(key: string): void {
    const cacheObject = getInLocalStorage();
    delete cacheObject[key];
    setInLocalStorage(cacheObject);
  }

  function clearCache(): void {
    setInLocalStorage({});
  }
  function getCacheObject(): CacheObject {
    const cacheObject = getInLocalStorage();
    return cacheObject;
  }

  return {
    setItem,
    getItem,
    removeItem,
    clearCache,
    getCacheObject,
  };
}

const cacheService = createCacheService();
export default cacheService;
