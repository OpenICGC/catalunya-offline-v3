import {useCallback, useEffect, useState} from 'react';
import {CatOfflineError} from '../../types/commonTypes';
import {singletonHook} from 'react-singleton-hook';
import {Geolocation} from './useGeolocation';
import fakeTrack from './fakeTrack.json';
import {LineString} from 'geojson';

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

type useGeolocationType = {
  geolocation: Geolocation,
  error: CatOfflineError | undefined,
  setWatchInBackground: (watchInBackground: boolean) => void
}

const useFakeGeolocation = (): useGeolocationType => {
  const [geolocation, setGeolocation] = useState<Geolocation>(nullGeolocation);

  const coordinates = (fakeTrack as GeoJSON.FeatureCollection<LineString>).features[0].geometry.coordinates;

  useEffect(() => {
    const t0 = coordinates[0][3];
    for (let i = 1; i < coordinates.length; i++) {
      const [x, y, z, t] = coordinates[i];
      //console.log('FakeGeolocation', x, y, z, t);
      setTimeout(function () {
        setGeolocation({
          accuracy: null,
          altitude: z,
          altitudeAccuracy: null,
          heading: null,
          latitude: y,
          longitude: x,
          speed: null,
          timestamp: t
        });
      }, 100 * (t-t0));
    }
  }, []);

  const error = undefined;
  const setWatchInBackground = useCallback(() => undefined, []);

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

export default singletonHook<useGeolocationType>(initialState, useFakeGeolocation);
