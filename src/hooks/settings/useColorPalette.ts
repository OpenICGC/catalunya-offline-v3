import {singletonHook} from 'react-singleton-hook';
import usePersistedState from '../usePersistedState';

type Type = string

const key = 'settings.colorPalette';
const defaultValue = 'BrewerSet19';

export default singletonHook(
  [defaultValue, () => undefined],
  () => usePersistedState<Type>(key, defaultValue)
);
