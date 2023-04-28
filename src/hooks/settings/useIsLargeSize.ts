import {singletonHook} from 'react-singleton-hook';
import usePersistedState from '../usePersistedState';

type Type = boolean

const key = 'settings.isLargeSize';
const defaultValue: Type = false;

export default singletonHook(
  [defaultValue, () => undefined, false],
  () => usePersistedState<Type>(key, defaultValue)
);
