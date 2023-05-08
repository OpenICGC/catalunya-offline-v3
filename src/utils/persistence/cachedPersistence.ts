import {persistence} from './types';

const cache: Record<string, unknown> = {};

const cachedPersistence = (base: persistence): persistence => ({
  load: <T>(key: string): Promise<T | undefined> => {
    if (cache[key]) {
      return Promise.resolve(cache[key] as T);
    } else {
      return base.load<T>(key).then(value => {
        cache[key] = value;
        return value;
      });
    }
  },
  save: base.save // TODO we may introduce some throttling here if it helps performance
});

export default cachedPersistence;
