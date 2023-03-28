import {PERSISTENCE_NAMESPACE} from '../config';
import {useCallback, useEffect, useState} from 'react';
import {Preferences} from '@capacitor/preferences';

const configureNamespace = Preferences.configure({group: PERSISTENCE_NAMESPACE});
const load = <T> (key: string): Promise<T | undefined> => Preferences.get({key}).then(({value}) => value === null ? undefined : JSON.parse(value));
const save = <T> (key: string, value: T) => value === undefined ? Preferences.remove({key}) : Preferences.set({key, value: JSON.stringify(value)});

const usePersistedState = <T> (key: string, defaultValue: T): [T, (newValue: T) => void] => {
  const [getValue, setValue] = useState<T>(defaultValue);

  // Read from persisted settings on mount
  useEffect(() => {
    configureNamespace.then(() => {
      load<T>(key).then(value => value !== undefined && setValue(value));
    });
  }, []);

  const setWithPersistence = useCallback((newValue: T) => {
    setValue(newValue);
    save<T>(key, newValue);
  }, [key]);

  return [getValue, setWithPersistence];
};

export default usePersistedState;
