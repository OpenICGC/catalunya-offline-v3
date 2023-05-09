import {Preferences} from '@capacitor/preferences';
import {persistence} from './types';
import {PERSISTENCE_NAMESPACE} from '../../config';

const configureNamespace = Preferences.configure({group: PERSISTENCE_NAMESPACE});

const capacitorPersistence: persistence = ({
  load: <T>(key: string): Promise<T | undefined> => configureNamespace.then(() =>
    Preferences.get({key}).then(({value}) => value === null ? undefined : JSON.parse(value))
  ),
  save: <T>(key: string, value: T) => configureNamespace.then(() =>
    value === undefined ? Preferences.remove({key}) : Preferences.set({key, value: JSON.stringify(value)})
  )
});

export default capacitorPersistence;
