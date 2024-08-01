import {registerPlugin} from '@capacitor/core';
import {useEffect, useState} from 'react';
import {CatOfflineError} from '../../types/commonTypes';
import {BackgroundGeolocationPlugin, CallbackError, Location} from '@capacitor-community/background-geolocation';
import useIsActive from './useIsActive';
import {IS_WEB} from '../../config';
import {useTranslation} from 'react-i18next';
import {singletonHook} from 'react-singleton-hook';
//import useFakeGeolocation from './useFakeGeolocation';

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>('BackgroundGeolocation');

export interface Geolocation {
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number | null;
  longitude: number | null;
  speed: number | null;
  timestamp: EpochTimeStamp | null; // In milliseconds https://w3c.github.io/hr-time/#the-epochtimestamp-typedef
}

type useGeolocationType = {
  geolocation: Geolocation,
  error: CatOfflineError | undefined,
  setWatchInBackground: (watchInBackground: boolean) => void
}

const webConfig = {
  enableHighAccuracy: true,
  timeout: 10000, // Maximum time to wait for a position
  maximumAge: 10000, // Maximum age of cached position in ms
};

const POSITION_TIMEOUT = 300; // Seconds

const nullGeolocation = () => ({
  accuracy: null,
  altitude: null,
  altitudeAccuracy: null,
  heading: null,
  latitude: null,
  longitude: null,
  speed: null,
  timestamp: Date.now() // milliseconds
});

const useGeolocation = (): useGeolocationType => {
  const [watcherId, setWatcherId] = useState<string>();
  const [watchInBackground, setWatchInBackground] = useState<boolean>(false);
  const [error, setError] = useState<CatOfflineError>();
  const [geolocation, setGeolocation] = useState<Geolocation>(nullGeolocation);
  const isActive = useIsActive();
  const {t} = useTranslation();

  const capacitorConfig = {
    // backgroundMessage is required to guarantee a background location
    backgroundTitle: watchInBackground ? t('geolocation.backgroundTitle') : undefined,
    backgroundMessage: watchInBackground ? t('geolocation.backgroundMessage') : undefined,
    requestPermissions: true,
    stale: false,
    distanceFilter: 1
  };

  const handleCapacitorPermission = (backgroundGeolocationError: CallbackError) => {
    if (
      backgroundGeolocationError.code === 'NOT_AUTHORIZED' &&
      backgroundGeolocationError.message !== 'Location services disabled.' &&
      window.confirm(t('geolocation.requestPermission'))
    ) {
      BackgroundGeolocation.openSettings();
    }
  };

  useEffect(() => {
    if (!isActive && !watchInBackground) {
      stopWatching(); // Going background and no need to watch.
    } else {
      startWatching(); // (Re)start watching in any other case.
    }
    return () => stopWatching();
  }, [isActive, watchInBackground]);


  const [positionTimeout, setPositionTimeout] = useState<number>();
  useEffect( () => {
    positionTimeout && clearTimeout(positionTimeout);
    setPositionTimeout(window.setTimeout(() => {
      setError({code: 'errors.geolocation.timeout'});
      setGeolocation(nullGeolocation());
    }, POSITION_TIMEOUT * 1000));
    return () => window.clearTimeout(positionTimeout);
  }, [geolocation]);

  const handleWebGeolocation = (position: GeolocationPosition) => {
    const geolocation: Geolocation = {
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      speed: position.coords.speed,
      timestamp: position.timestamp // milliseconds
    };
    //console.debug('[Geolocation] Got Web Geolocation', geolocation);
    setError(undefined);
    setGeolocation(geolocation);
  };

  const handleCapacitorGeolocation = (location: Location) => {
    const geolocation: Geolocation = {
      accuracy: location.accuracy,
      altitude: location.altitude,
      altitudeAccuracy: location.altitudeAccuracy,
      heading: location.bearing,
      latitude: location.latitude,
      longitude: location.longitude,
      speed: location.speed,
      timestamp: location.time // milliseconds
    };
    //console.debug('[Geolocation] Got Capacitor Geolocation', location);
    setError(undefined);
    setGeolocation(geolocation);
  };

  const handleWebError = (webError: GeolocationPositionError) => {
    const errorCodes: Record<string, string> = {
      // From https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError/code
      'GEOLOCATION_ERROR': 'errors.geolocation.default',
      'GEOLOCATION_PERMISSION_DENIED': 'errors.geolocation.permissionDenied',
      'GEOLOCATION_POSITION_UNAVAILABLE': 'errors.geolocation.unavailable',
      'GEOLOCATION_TIMEOUT': 'errors.geolocation.timeout'
    };
    const error: CatOfflineError = {code: errorCodes[webError.code] || errorCodes['GEOLOCATION_ERROR']};
    console.error('[Geolocation] Got Web error', webError);
    setError(error);
    setGeolocation(nullGeolocation());
  };

  const handleCapacitorError = (capacitorError: CallbackError) => {
    // TODO list possible capacitorError values, convert to catoffline error code and i18n.
    const error: CatOfflineError = {code: capacitorError.code ?? capacitorError.message};
    console.error('[Geolocation] Got Capacitor error', capacitorError);
    setError(error);
    setGeolocation(nullGeolocation());
  };

  const startWatching = () => {
    stopWatching();
    if (IS_WEB) {
      navigator.geolocation.getCurrentPosition(handleWebGeolocation, handleWebError, webConfig);
      const id = navigator.geolocation.watchPosition(handleWebGeolocation, handleWebError, webConfig);
      setWatcherId(id.toString());
      //console.debug('[Geolocation] Started Web watching', id);
    } else {
      BackgroundGeolocation.addWatcher(capacitorConfig, (capacitorGeolocation?: Location, capacitorError?: CallbackError) => {
        if (capacitorError) {
          handleCapacitorError(capacitorError);
          handleCapacitorPermission(capacitorError);
        } else if (capacitorGeolocation) {
          handleCapacitorGeolocation(capacitorGeolocation);
        }
      }).then((id: string) => {
        setWatcherId(id);
        //console.debug('[Geolocation] Started Capacitor watching', id);
      });
    }
  };

  const stopWatching = () => {
    if (watcherId) {
      if (IS_WEB) {
        navigator.geolocation.clearWatch(Number(watcherId));
        setWatcherId(undefined);
        setGeolocation(nullGeolocation());
        //console.debug('[Geolocation] Stopped Web watching', watcherId);
      } else {
        BackgroundGeolocation.removeWatcher({id: watcherId}).then(() => {
          setWatcherId(undefined);
          setGeolocation(nullGeolocation());
          //console.debug('[Geolocation] Stopped Capacitor watching', watcherId);
        });
      }
    }
  };

  return {geolocation, error, setWatchInBackground};
};

const initialState: useGeolocationType = {
  geolocation: {
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    timestamp: null
  },
  error: undefined,
  setWatchInBackground: () => undefined
};

export default singletonHook<useGeolocationType>(initialState, useGeolocation);
//export default useFakeGeolocation;
