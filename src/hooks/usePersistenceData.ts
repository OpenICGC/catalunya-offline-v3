import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react';

import {useEventCallback, useEventListener} from 'usehooks-ts';
import {getPersistenceImpl, setPersistenceImpl} from '../utils/persistenceImpl';

declare global {
  interface WindowEventMap {
    'local-storage': CustomEvent;
  }
}

type SetValue<T> = Dispatch<SetStateAction<T>>

export enum PersistenceStatus {
  INITIAL,
  LOADING,
  READY
}

function usePersistenceData<T>(key: string, initialValue: T): [T, SetValue<T>, PersistenceStatus] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [status, setStatus] = useState<PersistenceStatus>(PersistenceStatus.INITIAL);

  // Get from local storage or capacitor preferences then
  // parse stored json or return initialValue
  const readValue = useCallback(async () => {
    // Prevent build error "window is undefined" but keeps working
    setStatus(PersistenceStatus.LOADING);
    if (typeof window === 'undefined') {
      setStoredValue(initialValue);
      setStatus(PersistenceStatus.READY);
    }

    try {
      const item = await getPersistenceImpl(key);
      setStoredValue(item ? (parseJSON(item) as T) : initialValue);
      setStatus(PersistenceStatus.READY);
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      setStoredValue(initialValue);
      setStatus(PersistenceStatus.READY);
    }
  }, [initialValue, key]);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage or capacitor preferences.
  const setValue: SetValue<T> = useEventCallback((value) => {
    // Prevent build error "window is undefined" but keeps working
    if (typeof window === 'undefined') {
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`
      );
    }

    try {
      setStatus(PersistenceStatus.LOADING);
      // Allow value to be a function, so we have the same API as useState
      const newValue = value instanceof Function ? value(storedValue) : value;

      // Save to local storage or capacitor preferences
      setPersistenceImpl(key, JSON.stringify(newValue))
        // Save state
        .then(() => {
          setStoredValue(newValue);
          setStatus(PersistenceStatus.READY);
        });
      // We dispatch a custom event so every useLocalStorage hook are notified
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
      setStatus(PersistenceStatus.READY);
    }
  });

  useEffect(() => {
    readValue();
  }, [key]);

  const handleStorageChange = useCallback(
    (event: StorageEvent | CustomEvent) => {
      if ((event as StorageEvent)?.key && (event as StorageEvent).key !== key) {
        return;
      }
      readValue();
    },
    [key, readValue]
  );

  // this only works for other documents, not the current one
  useEventListener('storage', handleStorageChange);

  // this is a custom event, triggered in writeValueToLocalStorage
  // See: useLocalStorage()
  useEventListener('local-storage', handleStorageChange);

  return [storedValue, setValue, status];
}

export default usePersistenceData;

// A wrapper for "JSON.parse()"" to support "undefined" value
function parseJSON<T>(value: string | null): T | undefined {
  try {
    return value === 'undefined' ? undefined : JSON.parse(value ?? '');
  } catch {
    console.error('ParseJSON error on', {value});
    return undefined;
  }
}