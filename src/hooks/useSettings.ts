import {LANGUAGE, HEXColor} from '../types/commonTypes';
import {DEFAULT_SETTINGS} from '../config';
import usePersistenceData from './usePersistenceData';
import {singletonHook} from 'react-singleton-hook';

const useSettingsImpl = () => {
  const [gpsPositionColor, setGpsPositionColor] = usePersistenceData<HEXColor>('settings:gpsPositionColor', DEFAULT_SETTINGS.gpsPositionColor);
  const [trackTolerance, setTrackTolerance] = usePersistenceData<number>('settings:trackTolerance', DEFAULT_SETTINGS.trackTolerance);
  const [isLeftHanded, setLeftHanded] = usePersistenceData<boolean>('settings:isLeftHanded', DEFAULT_SETTINGS.isLeftHanded);
  const [isAccessibleSize, setIsAccessibleSize] = usePersistenceData<boolean>('settings:isAccessibleSize', DEFAULT_SETTINGS.isAccessibleSize);
  const [colorPalette, setColorPalette] = usePersistenceData<string>('settings:colorPalette', DEFAULT_SETTINGS.colorPalette);
  const [language, setLanguage] = usePersistenceData<LANGUAGE>('settings:language', DEFAULT_SETTINGS.language);

  return {
    gpsPositionColor, setGpsPositionColor,
    trackTolerance, setTrackTolerance,
    isLeftHanded, setLeftHanded,
    isAccessibleSize, setIsAccessibleSize,
    colorPalette, setColorPalette,
    language, setLanguage
  };
};

const trivialImpl = {
  ...DEFAULT_SETTINGS,
  setGpsPositionColor: () => undefined,
  setTrackTolerance: () => undefined,
  setLeftHanded: () => undefined,
  setIsAccessibleSize: () => undefined,
  setColorPalette: () => undefined,
  setLanguage: () => undefined
};

export const useSettings = singletonHook(trivialImpl, useSettingsImpl);
