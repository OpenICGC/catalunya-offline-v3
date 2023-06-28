import {singletonHook} from 'react-singleton-hook';
import usePersistedState from '../usePersistedState';
import {DEFAULT_BASEMAP_ID} from '../../config';

type Type = string

const key = 'state.basemapId';
const defaultValue: Type = DEFAULT_BASEMAP_ID;

export default singletonHook(
  [defaultValue, () => undefined, false],
  () => usePersistedState<Type>(key, defaultValue)
);
