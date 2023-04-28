import {Preferences} from '@capacitor/preferences';
import {PERSISTENCE_NAMESPACE} from '../config';

const configureNamespace = Preferences.configure({group: PERSISTENCE_NAMESPACE});

export const removePersistenceImpl = async (key: string) => {
  await configureNamespace;
  await Preferences.remove({key});
};
