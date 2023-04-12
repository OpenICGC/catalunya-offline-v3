import {Preferences} from '@capacitor/preferences';
import {PERSISTENCE_NAMESPACE} from '../config';

const configureNamespace = Preferences.configure({group: PERSISTENCE_NAMESPACE});

export const getPersistenceImpl = async (key: string): Promise<string | null> => {
  await configureNamespace;
  const {value} = await Preferences.get({ key });
  return value;
};

export const setPersistenceImpl = async (key: string, value: string) => {
  await configureNamespace;
  await Preferences.set({key, value});
};

export const removePersistenceImpl = async (key: string) => {
  await Preferences.remove({key});
};