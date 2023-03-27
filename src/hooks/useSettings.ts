import {LANGUAGE, HEXColor, Settings} from '../types/commonTypes';
import {DEFAULT_SETTINGS, PERSISTENCE_NAMESPACE} from '../config';
import {singletonHook} from 'react-singleton-hook';
import {useEffect, useState} from 'react';
import {Preferences} from '@capacitor/preferences';

const configure = () => Preferences.configure({group: PERSISTENCE_NAMESPACE});
const load = (key: string) => Preferences.get({key: 'settings:'+key}).then(({value}) => value ? JSON.parse(value) : DEFAULT_SETTINGS[key as keyof Settings]);
const save = (key: string, value: unknown) => Preferences.set({key: 'settings:'+key, value: JSON.stringify(value)});

const useSettingsImpl = () => {
  const [gpsPositionColor, setGpsPositionColor] = useState<HEXColor>(DEFAULT_SETTINGS.gpsPositionColor);
  const [trackTolerance, setTrackTolerance] = useState<number>(DEFAULT_SETTINGS.trackTolerance);
  const [isLeftHanded, setLeftHanded] = useState<boolean>(DEFAULT_SETTINGS.isLeftHanded);
  const [isLargeSize, setLargeSize] = useState<boolean>(DEFAULT_SETTINGS.isLargeSize);
  const [colorPalette, setColorPalette] = useState<string>(DEFAULT_SETTINGS.colorPalette);
  const [language, setLanguage] = useState<LANGUAGE>(DEFAULT_SETTINGS.language);

  // Read from persisted settings on mount
  useEffect(() => {
    configure().then(() => {
      load('gpsPositionColor').then(setGpsPositionColor);
      load('trackTolerance').then(setTrackTolerance);
      load('isLeftHanded').then(setLeftHanded);
      load('isLargeSize').then(setLargeSize);
      load('colorPalette').then(setColorPalette);
      load('language').then(setLanguage);
    });
  }, []);

  return {
    gpsPositionColor,
    setGpsPositionColor: (gpsPositionColor: HEXColor) => {
      setGpsPositionColor(gpsPositionColor);
      save('gpsPositionColor', gpsPositionColor);
    },
    trackTolerance,
    setTrackTolerance: (trackTolerance: number) => {
      setTrackTolerance(trackTolerance);
      save('trackTolerance', trackTolerance);
    },
    isLeftHanded,
    setLeftHanded: (isLeftHanded: boolean) => {
      setLeftHanded(isLeftHanded);
      save('isLeftHanded', isLeftHanded);
    },
    isLargeSize,
    setLargeSize: (isLargeSize: boolean) => {
      setLargeSize(isLargeSize);
      save('isLargeSize', isLargeSize);
    },
    colorPalette,
    setColorPalette: (colorPalette: string) => {
      setColorPalette(colorPalette);
      save('colorPalette', colorPalette);
    },
    language,
    setLanguage: (language: LANGUAGE) => {
      setLanguage(language);
      save('language', language);
    }
  };
};

const trivialImpl = {
  ...DEFAULT_SETTINGS,
  setGpsPositionColor: () => undefined,
  setTrackTolerance: () => undefined,
  setLeftHanded: () => undefined,
  setLargeSize: () => undefined,
  setColorPalette: () => undefined,
  setLanguage: () => undefined
};

export const useSettings = singletonHook(trivialImpl, useSettingsImpl);
