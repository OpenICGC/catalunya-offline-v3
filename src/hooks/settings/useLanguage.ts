import {singletonHook} from 'react-singleton-hook';
import usePersistedState from '../usePersistedState';
import {LANGUAGE} from '../../types/commonTypes';

type Type = LANGUAGE

const key = 'settings.language';
const defaultValue: Type = LANGUAGE.ca;
export default singletonHook(
  [defaultValue, () => undefined],
  () => usePersistedState<Type>(key, defaultValue)
);
