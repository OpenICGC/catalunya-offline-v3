import {Capacitor, registerPlugin} from '@capacitor/core';
import {useEffect, useState} from 'react';
const BackgroundGeolocation = registerPlugin('BackgroundGeolocation');

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

const handlePermission = error => {
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
  const [watcherId, setWatcherId] = useState();
  const [error, setError] = useState();
  const [geolocation, setGeolocation] = useState({
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    bearing: null,
    latitude: null,
    longitude: null,
    speed: null,
    time:  Date.now()
  });

  const handleWebLocation = event => {
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
    setError();
    setGeolocation(location);
  };

  const handleWebError = error => {
    console.log('[WebGeolocation] Got error', error);
    setError(error);
  };

  useEffect(() => {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      // Web will use geolocation API
      navigator.geolocation.getCurrentPosition(handleWebLocation, handleWebError, webConfig);
      const id = navigator.geolocation.watchPosition(handleWebLocation, handleWebError, webConfig);
      return () => {
        navigator.geolocation.clearWatch(id);
      };
    } else {
      BackgroundGeolocation.addWatcher(config, (location, error) => {
        if (error) {
          console.log('[BackgroundGeolocation] Got error', error);
          setError(error);
          handlePermission(error);
        } else if (location) {
          console.log('[BackgroundGeolocation] Got location', location);
          setError();
          setGeolocation(location);
        }
      }).then(id => {
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
