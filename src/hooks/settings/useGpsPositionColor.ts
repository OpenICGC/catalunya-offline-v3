import {singletonHook} from 'react-singleton-hook';
import usePersistedState from '../usePersistedState';
import {HEXColor} from '../../types/commonTypes';

type Type = HEXColor

const key = 'settings.gpsPositionColor';
const defaultValue: Type = '#4286f5';

export default singletonHook(
  [defaultValue, () => undefined, false],
  () => usePersistedState<Type>(key, defaultValue)
);
