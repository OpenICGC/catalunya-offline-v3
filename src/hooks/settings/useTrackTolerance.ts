import {singletonHook} from 'react-singleton-hook';
import usePersistedState from '../usePersistedState';

type Type = number

const key = 'settings.trackTolerance';
const defaultValue: Type = 40;

export default singletonHook(
  [defaultValue, () => undefined, false],
  () => usePersistedState<Type>(key, defaultValue)
);
