import {useCallback, useEffect, useState} from 'react';
import {Position} from 'geojson';
import useGeolocation from './useGeolocation';
import {singletonHook} from 'react-singleton-hook';
import {UUID} from '../../types/commonTypes';
import {useScopeTracks} from '../usePersistedCollections';

type startFn = (scopeId: UUID, trackId: UUID) => boolean;

const timeCoordinate = () => Math.round(new Date().getTime() / 1000); // timestamp in seconds as fourth coordinate

type useRecordingTrackType = {
  start: startFn,
  pause: () => void,
  resume: () => void,
  stop: () => void,
  isRecording: boolean,
  startTime?: number
}

const useRecordingTrack = (): useRecordingTrackType => {
  const [scopeId, setScopeId] = useState<UUID>();
  const [trackId, setTrackId] = useState<UUID>();
  const trackStore = useScopeTracks(scopeId);

  const [isRecording, setRecording] = useState<boolean>(false);
  const [isPaused, setPaused] = useState<boolean>(false);
  //const [coordinates, setCoordinates] = useState<Array<Position>>([]);
  const [startTime, setStartTime] = useState<number>();

  const {geolocation, setWatchInBackground} = useGeolocation();

  useEffect(() => {
    if (geolocation.latitude !== null && geolocation.longitude !== null && isRecording && !isPaused && trackId) {
      const prevTrack = trackStore.retrieve(trackId);
      if (prevTrack) {
        const newPosition: Position = [geolocation.longitude, geolocation.latitude, geolocation.altitude || 0, timeCoordinate()];
        trackStore.update({
          ...prevTrack,
          geometry: {
            type: 'LineString',
            coordinates: [...(prevTrack.geometry?.coordinates || []), newPosition]
          }
        });
      }
    }
  }, [geolocation.latitude, geolocation.longitude]);

  const start: startFn = useCallback((scopeId, trackId) => {
    if (isRecording) {
      console.info('Cannot record track. Another track is being recorded.');
      return false;
    } else {
      setWatchInBackground(true);
      const startTime = Date.now();
      setStartTime(startTime);
      setRecording(true);
      setScopeId(scopeId);
      setTrackId(trackId);
      return true;
    }
  }, [isRecording, setWatchInBackground]);

  const pause = useCallback(() => {
    setWatchInBackground(false);
    setPaused(true);
  }, [setWatchInBackground]);

  const resume = useCallback(() => {
    setWatchInBackground(true);
    setPaused(false);
  }, [setWatchInBackground]);

  const stop = useCallback(() => {
    // Reset all the internal state
    setWatchInBackground(false);
    setRecording(false);
    setPaused(false);
    setScopeId(undefined);
    setTrackId(undefined);
    setStartTime(undefined);
  }, [setWatchInBackground]);

  return {
    start,
    pause,
    resume,
    stop,
    isRecording,
    startTime
  };
};

const initialState: useRecordingTrackType = {
  start: () => false,
  pause: () => undefined,
  resume: () => undefined,
  stop: () => undefined,
  isRecording: false,
  startTime: undefined
};

export default singletonHook<useRecordingTrackType>(initialState, useRecordingTrack);
