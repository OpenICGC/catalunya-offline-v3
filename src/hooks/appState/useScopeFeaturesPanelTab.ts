import {singletonHook} from 'react-singleton-hook';
import usePersistedState from '../usePersistedState';
import {SCOPE_FEATURES_PANEL_TAB} from '../../types/commonTypes';

type Type = SCOPE_FEATURES_PANEL_TAB

const key = 'state.scopeFeaturesPanelTab';
const defaultValue: Type = SCOPE_FEATURES_PANEL_TAB.POINTS;

export default singletonHook(
  [defaultValue, () => undefined],
  () => usePersistedState<Type>(key, defaultValue)
);
