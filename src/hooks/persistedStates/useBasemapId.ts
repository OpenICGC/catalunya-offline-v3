import {singletonHook} from 'react-singleton-hook';
import usePersistedState from '../usePersistedState';
import {BASEMAPS} from '../../config';

type Type = string

const key = 'state.basemapId';
const defaultValue: Type = BASEMAPS[0].id;

export default singletonHook(
  [defaultValue, () => undefined, false],
  () => usePersistedState<Type>(key, defaultValue)
);
