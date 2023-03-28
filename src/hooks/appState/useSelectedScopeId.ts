import {singletonHook} from 'react-singleton-hook';
import usePersistedState from '../usePersistedState';
import {UUID} from '../../types/commonTypes';

type Type = UUID | undefined

const key = 'state.selectedScopeId';
const defaultValue: Type = undefined;

export default singletonHook(
  [defaultValue, () => undefined],
  () => usePersistedState<Type>(key, defaultValue)
);
