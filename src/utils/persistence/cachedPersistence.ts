import {persistence} from './types';

const cache: Record<string, Promise<unknown>> = {};

const cachedPersistence = (base: persistence): persistence => ({
  load: <T>(key: string): Promise<T | undefined> => {
    if (cache[key] === undefined) {
      cache[key] = base.load<T>(key);
    }
    return cache[key] as Promise<T>;
  },
  save: <T>(key: string, value: T): Promise<void> => {
    cache[key] = Promise.resolve(value);
    return base.save(key, value); // TODO we may introduce some throttling here if it helps performance
  }
});

export default cachedPersistence;
