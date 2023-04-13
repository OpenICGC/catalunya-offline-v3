import {PERSISTENCE_NAMESPACE} from '../config';
import {SetStateAction, useCallback, useEffect, useState} from 'react';
import {Preferences} from '@capacitor/preferences';
import { debounce } from 'throttle-debounce';

const configureNamespace = Preferences.configure({group: PERSISTENCE_NAMESPACE});
const load = <T> (key: string): Promise<T | undefined> => Preferences.get({key}).then(({value}) => value === null ? undefined : JSON.parse(value));
const save = debounce(1000, <T> (key: string, value: T) => value === undefined ? Preferences.remove({key}) : Preferences.set({key, value: JSON.stringify(value)}));

const usePersistedState = <T> (key: string, defaultValue: T): [T, (newValue: T | SetStateAction<T>) => void] => {
  const [getValue, setValue] = useState<T>(defaultValue);

  // Read from persisted settings on mount
  useEffect(() => {
    configureNamespace.then(() => {
      load<T>(key).then(value => value !== undefined && setValue(value));
    });
  }, []);

  const setWithPersistence = useCallback((newValue: T | SetStateAction<T>) => {
    setValue(prevValue => {
      const val = newValue instanceof Function ? newValue(prevValue) : newValue;
      save(key, val);
      return val;
    });
  }, [key]);

  return [getValue, setWithPersistence];
};

export default usePersistedState;
