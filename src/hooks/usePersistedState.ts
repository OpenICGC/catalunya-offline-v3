import {PERSISTENCE_NAMESPACE} from '../config';
import {SetStateAction, useCallback, useEffect, useState} from 'react';
import {Preferences} from '@capacitor/preferences';
import {useEventListener} from 'usehooks-ts';

type PersistedStateUpdateEvent<T> = CustomEvent<{key: string, value: T}>;

declare global {
  interface WindowEventMap {
    'persistedStateUpdate': PersistedStateUpdateEvent<unknown>;
  }
}

const configureNamespace = Preferences.configure({group: PERSISTENCE_NAMESPACE});

const load = <T> (key: string): Promise<T | undefined> => Preferences.get({key}).then(({value}) => value === null ? undefined : JSON.parse(value));
const save = <T> (key: string, value: T) => value === undefined ? Preferences.remove({key}) : Preferences.set({key, value: JSON.stringify(value)});

type usePersistedStateReturnType<T> = [
  getValue: T,
  setValue: (newValue: T | SetStateAction<T>) => void,
  isLoaded: boolean
]

const usePersistedState = <T> (key: string, defaultValue: T): usePersistedStateReturnType<T> => {
  const [getValue, setValue] = useState<T>(defaultValue);
  const [dispatchEvent, setDispatchEvent] = useState<boolean>(false);
  const [isLoaded, setLoaded] = useState<boolean>(false);

  useEventListener('persistedStateUpdate', (event) => {
    if (event.detail.key === key) {
      setValue(event.detail.value as (T | SetStateAction<T>));
    }
  });

  // Read from persisted settings on mount
  useEffect(() => {
    setLoaded(false);
    setValue(defaultValue);
    configureNamespace.then(() => {
      load<T>(key).then(value => {
        value !== undefined && setValue(value);
        setLoaded(true);
      });
    });
  }, [key]);

  useEffect(() => {
    if (dispatchEvent) {
      window.dispatchEvent(new CustomEvent('persistedStateUpdate', {
        detail: {key, value: getValue}
      }));
      setDispatchEvent(false);
    }
  }, [dispatchEvent]);

  const setWithPersistence = useCallback((newValue: T | SetStateAction<T>) => {
    setValue(prevValue => {
      const val = newValue instanceof Function ? newValue(prevValue) : newValue;
      configureNamespace.then(() => {
        save(key, val);
      });
      return val;
    });
    setDispatchEvent(true);
  }, [key]);

  return [getValue, setWithPersistence, isLoaded];
};

export default usePersistedState;
