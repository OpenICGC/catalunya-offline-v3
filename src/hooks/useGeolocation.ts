import {Capacitor, registerPlugin} from '@capacitor/core';
import {useEffect, useState} from 'react';
import {CatOfflineError} from '../types/commonTypes';
import {BackgroundGeolocationPlugin, CallbackError, Location} from '@capacitor-community/background-geolocation';
import useAppState, {AppState} from './useAppState';

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

const webConfig = {
  enableHighAccuracy: true,
  timeout: 10000, // Maximum time to wait for a position
  maximumAge: 5000, // Maximum age of cached position in ms
};

const handleCapacitorPermission = (error: CallbackError) => {
  if (error.code === 'NOT_AUTHORIZED') {
    if (error.message === 'Location services disabled.') {
      /*window.alert('El servei de localització del dispositiu està desactivat');*/
      // The other possible "NOT_AUTHORIZED" messages are: "Permission denied." and "User denied location permission".
    } else if (window.confirm(
      'Catalunya Offline necessita accedir a la geolocalització, ' +
      'però aquest permís ha estat denegat.\n\n' +
      'Voleu accedir a la configuració?'
    )) {
      BackgroundGeolocation.openSettings();
    }
  }
};

const nullGeolocation = () => ({
  accuracy: null,
  altitude: null,
  altitudeAccuracy: null,
  heading: null,
  latitude: null,
  longitude: null,
  speed: null,
  timestamp: Date.now()
});

const useGeolocation = (watchInBackground= false) => {
  const [watcherId, setWatcherId] = useState<string>();
  const [error, setError] = useState<CatOfflineError>();
  const [geolocation, setGeolocation] = useState<Geolocation>(nullGeolocation);
  const appState = useAppState();
  const isWeb = Capacitor.getPlatform() === 'web';

  const capacitorConfig = {
    // backgroundMessage is required to guarantee a background location
    backgroundMessage: watchInBackground ? 'La localització roman activa mentre es graven o segueixen traces' : undefined,
    backgroundTitle: watchInBackground ? 'Geolocalització activa en segon pla' : undefined,
    requestPermissions: true,
    stale: false,
    distanceFilter: 1
  };

  useEffect(() => {
    if (appState === AppState.BACKGROUND && !watchInBackground) {
      stopWatching(); // Going background and no need to watch.
    } else {
      startWatching(); // (Re)start watching in any other case.
    }
    return () => stopWatching();
  }, [appState, watchInBackground]);


  const [positionTimeout, setPositionTimeout] = useState<number>();
  useEffect( () => {
    positionTimeout && clearTimeout(positionTimeout);
    setPositionTimeout(window.setTimeout(() => {
      setError({code: 'NO_FRESH_LOCATION', message: 'No new location set in 10 seconds'});
      setGeolocation(nullGeolocation());
    }, 10000));
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
    console.debug('[Geolocation] Got Web Geolocation', geolocation);
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
    console.debug('[Geolocation] Got Capacitor Geolocation', location);
    setError(undefined);
    setGeolocation(geolocation);
  };

  const handleWebError = (webError: GeolocationPositionError) => {
    const errorCodes = [ // From https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError/code
      {code: 'GEOLOCATION_ERROR', message: 'Geolocation Error'},
      {code: 'GEOLOCATION_PERMISSION_DENIED', message: 'Geolocation Permission Denied'},
      {code: 'GEOLOCATION_POSITION_UNAVAILABLE', message: 'Geolocation Position Unavailable'},
      {code: 'GEOLOCATION_TIMEOUT', message: 'Geolocation Timeout'}
    ];
    const error: CatOfflineError = errorCodes[webError.code] || errorCodes[0];
    console.error('[Geolocation] Got Web error', error);
    setError(error);
    setGeolocation(nullGeolocation());
  };

  const handleCapacitorError = (capacitorError: CallbackError) => {
    const error: CatOfflineError = {message: capacitorError.message, code: capacitorError.code};
    console.error('[Geolocation] Got Capacitor error', error);
    setError(error);
    setGeolocation(nullGeolocation());
  };

  const startWatching = () => {
    stopWatching();
    if (isWeb) {
      navigator.geolocation.getCurrentPosition(handleWebGeolocation, handleWebError, webConfig);
      const id = navigator.geolocation.watchPosition(handleWebGeolocation, handleWebError, webConfig);
      setWatcherId(id.toString());
      console.debug('[Geolocation] Started Web watching', id);
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
        console.debug('[Geolocation] Started Capacitor watching', id);
      });
    }
  };

  const stopWatching = () => {
    if (watcherId) {
      if (isWeb) {
        navigator.geolocation.clearWatch(Number(watcherId));
        setWatcherId(undefined);
        console.debug('[Geolocation] Stopped Web watching', watcherId);
      } else {
        BackgroundGeolocation.removeWatcher({id: watcherId}).then(() => {
          setWatcherId(undefined);
          console.debug('[Geolocation] Stopped Capacitor watching', watcherId);
        });
      }
    }
  };

  return {geolocation, error};
};

export default useGeolocation;
