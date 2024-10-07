import {SetStateAction, useCallback, useEffect, useState} from 'react';
import {useEventListener} from 'usehooks-ts';
import capacitorPersistence from '../utils/persistence/capacitorPersistence';
import cachedPersistence from '../utils/persistence/cachedPersistence';

type PersistedStateUpdateEvent<T> = CustomEvent<{key: string, value: T}>;

declare global {
  interface WindowEventMap {
    'persistedStateUpdate': PersistedStateUpdateEvent<unknown>;
  }
}

type usePersistedStateReturnType<T> = [
  getValue: T,
  setValue: (newValue: T | SetStateAction<T>) => void,
  isLoaded: boolean
]

const {load, save} = cachedPersistence(capacitorPersistence);

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
    load<T>(key).then(value => {
      if (value !== undefined) {
        setValue(value);
      }
      setLoaded(true);
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
      save(key, val);
      return val;
    });
    setDispatchEvent(true);
  }, [key]);

  return [getValue, setWithPersistence, isLoaded];
};

export const clear = (key: string) => {
  save(key, undefined);
  window.dispatchEvent(new CustomEvent('persistedStateUpdate', {
    detail: {key, value: undefined}
  }));
};

export default usePersistedState;
