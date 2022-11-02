import {Capacitor, registerPlugin} from '@capacitor/core';
import {useEffect, useState} from 'react';
const BackgroundGeolocation = registerPlugin('BackgroundGeolocation');

const config = {
  // Message & title are required to guarantee a background location
  backgroundMessage: 'Mentre l\'App Catalunya Offline roman en segon pla, és recomanable mantenir actiu el servei de geolocalització' +
    'per tal de no interrompre la gravació de traces, i per obtenir un posicionament ràpid en tornar a l\'aplicació.' +
    'Voleu mantenir la geolocalizació activa en segon plà?',
  backgroundTitle: 'Geolocalització en segon pla',
  requestPermissions: true,
  stale: false,
  distanceFilter: 2
};

const webConfig = {
  enableHighAccuracy: true,
  timeout: 5000, // Maximum time to wait for a position
  maximumAge: 5000, // Maximum age of cached position in ms
};

const handlePermission = error => {
  if (error.code === 'NOT_AUTHORIZED') {
    if (window.confirm(
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
          handlePermission(error);
        }
        if (location) {
          console.log('[BackgroundGeolocation] Got location', location);
        }
        setError(error);
        setGeolocation(location);
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
