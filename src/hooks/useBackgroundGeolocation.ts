import {Capacitor, registerPlugin} from '@capacitor/core';
import {useEffect, useState} from 'react';
import {CatOfflineError} from '../types/commonTypes';
import {BackgroundGeolocationPlugin, CallbackError, Location} from '@capacitor-community/background-geolocation';

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
  //timeout: 5000, // Maximum time to wait for a position
  maximumAge: 5000, // Maximum age of cached position in ms
};

const bgConfig = {
  // backgroundMessage is required to guarantee a background location
  backgroundMessage: 'Actualitza la posició i permet gravar traces',
  backgroundTitle: 'Geolocalització activa en segon pla',
  requestPermissions: true,
  stale: false,
  distanceFilter: 1
};

const handleBgPermission = (error: CallbackError) => {
  if (error.code === 'NOT_AUTHORIZED') {
    if (error.message === 'Location services disabled.') {
      window.alert(
        'El servei de localització del dispositiu està deactivat.' +
        'Activeu-lo i torneu a entrar a l\'app.'
      );
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

const useBackgroundGeolocation = () => {
  const [watcherId, setWatcherId] = useState<string>();
  const [error, setError] = useState<CatOfflineError | CallbackError>();
  const [geolocation, setGeolocation] = useState<Geolocation>({
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    timestamp: Date.now()
  });

  const handleWebLocation = (position: GeolocationPosition) => {
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
    console.debug('[WebGeolocation] Got Geolocation', geolocation);
    setError(undefined);
    setGeolocation(geolocation);
  };

  const handleBgLocation = (location: Location) => {
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
    console.debug('[BackgroundGeolocation] Got Geolocation', location);
    setError(undefined);
    setGeolocation(geolocation);
  };

  const handleWebError = (webError: GeolocationPositionError) => {
    const errorCodes = [ // From https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError/code
      {code: 'WEB_GEOLOCATION_ERROR', message: 'Web Geolocation Error'},
      {code: 'WEB_GEOLOCATION_PERMISSION_DENIED', message: 'Web Geolocation Permission Denied'},
      {code: 'WEB_GEOLOCATION_POSITION_UNAVAILABLE', message: 'Web Geolocation Position Unavailable'},
      {code: 'WEB_GEOLOCATION_TIMEOUT', message: 'Web Geolocation Timeout'}
    ];
    const error: CatOfflineError = errorCodes[webError.code] || errorCodes[0];
    console.error('[WebGeolocation] Got error', error);
    setError(error);
  };

  const handleBgError = (bgError: CallbackError) => {
    const error: CatOfflineError = {message: bgError.message, code: bgError.code};
    console.error('[BackgroundGeolocation] Got error', error);
    setError(error);
  };

  useEffect(() => {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      navigator.geolocation.getCurrentPosition(handleWebLocation, handleWebError, webConfig);
      const id = navigator.geolocation.watchPosition(handleWebLocation, handleWebError, webConfig);
      return () => {
        navigator.geolocation.clearWatch(id);
      };
    } else {
      BackgroundGeolocation.addWatcher(bgConfig, (bgLocation?: Location, bgError?: CallbackError) => {
        if (bgError) {
          handleBgError(bgError);
          handleBgPermission(bgError);
        } else if (bgLocation) {
          handleBgLocation(bgLocation);
        }
      }).then((id: string) => {
        console.debug('[BackgroundGeolocation] Watcher set', id);
        setWatcherId(id);
      });
      return () => {
        console.debug('[BackgroundGeolocation] Removing watcher', watcherId);
        watcherId && BackgroundGeolocation.removeWatcher({id: watcherId});
      };
    }
  }, []);

  return {geolocation, error};
};

export default useBackgroundGeolocation;
