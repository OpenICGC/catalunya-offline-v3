import {singletonHook} from 'react-singleton-hook';
import usePersistedState from '../usePersistedState';

type Type = Array<number>

const key = 'state.visibleLayers';
const defaultValue: Type = [];

export default singletonHook(
  [defaultValue, () => undefined, false],
  () => usePersistedState<Type>(key, defaultValue)
);
