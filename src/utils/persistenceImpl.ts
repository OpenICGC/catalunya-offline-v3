import {Preferences} from '@capacitor/preferences';
import {PERSISTENCE_NAMESPACE} from '../config';

const configurePersistence = async () => {
  await Preferences.configure({group: PERSISTENCE_NAMESPACE});
};

export const getPersistenceImpl = async (key: string): Promise<string | null> => {
  await configurePersistence();
  const {value} = await Preferences.get({ key });
  return value;
};

export const setPersistenceImpl = async (key: string, value: string) => {
  await configurePersistence();
  await Preferences.set({key, value});
};

export const removePersistenceImpl = async (key: string) => {
  await Preferences.remove({key});
};