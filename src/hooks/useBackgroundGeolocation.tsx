import {Capacitor, registerPlugin} from '@capacitor/core';
import {useEffect, useState} from 'react';
import {GenericError, Geolocation} from "../types/commonTypes";

const BackgroundGeolocation: any = registerPlugin('BackgroundGeolocation');

const config = {
  // backgroundMessage is required to guarantee a background location
  backgroundMessage: 'Actualitza la posició i permet gravar traces',
  backgroundTitle: 'Geolocalització activa en segon pla',
  requestPermissions: true,
  stale: false,
  distanceFilter: 1
};

const webConfig = {
  enableHighAccuracy: true,
  //timeout: 5000, // Maximum time to wait for a position
  maximumAge: 5000, // Maximum age of cached position in ms
};

const handlePermission = (error: GenericError) => {
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
  const [error, setError] = useState<GenericError>();
  const [geolocation, setGeolocation] = useState<Geolocation>({
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    bearing: null,
    latitude: null,
    longitude: null,
    speed: null,
    time: Date.now()
  });

  const handleWebLocation = (event: {coords: Geolocation, timestamp: number}) => {
    const location = {
      accuracy: event.coords.accuracy,
      altitude: event.coords.altitude,
      altitudeAccuracy: event.coords.altitudeAccuracy,
      bearing: event.coords.heading,
      latitude: event.coords.latitude,
      longitude: event.coords.longitude,
      speed: event.coords.speed,
      time: event.timestamp
    };
    console.log('[WebGeolocation] Got location', location);
    setError(undefined);
    setGeolocation(location);
  };

  const handleWebError = (error: GenericError) => {
    console.log('[WebGeolocation] Got error', error);
    setError(error);
  };

  useEffect(() => {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      // Web will use geolocation API
      // @ts-ignore
      navigator.geolocation.getCurrentPosition(handleWebLocation, handleWebError, webConfig);
      // @ts-ignore
      const id = navigator.geolocation.watchPosition(handleWebLocation, handleWebError, webConfig);
      return () => {
        navigator.geolocation.clearWatch(id);
      };
    } else {
      BackgroundGeolocation.addWatcher(config, (location: Geolocation, error: GenericError) => {
        if (error) {
          console.log('[BackgroundGeolocation] Got error', error);
          setError(error);
          handlePermission(error);
        } else if (location) {
          console.log('[BackgroundGeolocation] Got location', location);
          setError(undefined);
          setGeolocation(location);
        }
      }).then((id: string) => {
        console.log('[BackgroundGeolocation] Watcher set', id);
        setWatcherId(id);
      });
      return () => {
        console.log('[BackgroundGeolocation] Removing watcher', watcherId);
        watcherId && BackgroundGeolocation.removeWatcher({id: watcherId});
      };
    }
  }, []);

  return {geolocation, error};
};

export default useBackgroundGeolocation;
