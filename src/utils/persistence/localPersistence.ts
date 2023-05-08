import {persistence} from './types';
import {PERSISTENCE_NAMESPACE} from '../../config';

const localPersistence: persistence = ({
  load: <T>(key: string): Promise<T | undefined> => {
    const item = localStorage.getItem(PERSISTENCE_NAMESPACE + '.'+ key);
    return Promise.resolve(item ? JSON.parse(item) : undefined);
  },
  save: <T>(key: string, value: T) => {
    value === undefined ? localStorage.removeItem(PERSISTENCE_NAMESPACE + '.'+ key) : localStorage.setItem(PERSISTENCE_NAMESPACE + '.'+ key, JSON.stringify(value));
    return Promise.resolve();
  }
});

export default localPersistence;
