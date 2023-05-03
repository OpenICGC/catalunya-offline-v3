import {useCallback, useEffect, useState} from 'react';
import {Position} from 'geojson';
import useGeolocation from './useGeolocation';
import {singletonHook} from 'react-singleton-hook';

type stopFn = (finalTrack: Array<Position>) => void;

type startFn = (argument: {
  onStop?: stopFn
}) => boolean;

const timeCoordinate = () => Math.round(new Date().getTime() / 1000); // timestamp in seconds as fourth coordinate

type useRecordingTrackType = {
  start: startFn,
  pause: () => void,
  resume: () => void,
  stop: () => void,
  coordinates: Array<Position>,
  isRecording: boolean,
  elapsedTime: number
}

const useRecordingTrack = (): useRecordingTrackType => {
  const [isRecording, setRecording] = useState<boolean>(false);
  const [isPaused, setPaused] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<Array<Position>>([]);
  const [onStop, setOnStop] = useState<stopFn>();
  const [startTime, setStartTime] = useState<number>();
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const {geolocation, setWatchInBackground} = useGeolocation();

  useEffect(() => {
    if (geolocation.latitude !== null && geolocation.longitude !== null && isRecording && !isPaused) {
      const newPosition: Position = [geolocation.longitude, geolocation.latitude, geolocation.altitude || 0, timeCoordinate()];
      setCoordinates(prevCoordinates => ([...prevCoordinates, newPosition]));
    }
  }, [geolocation.latitude, geolocation.longitude, isRecording, isPaused]);

  useEffect(() => {
    if (isRecording && startTime) {
      const timer = setInterval(() => setElapsedTime(Math.round((Date.now() - startTime) / 1000)), 1000);
      return () => clearInterval(timer);
    }
  }, [isRecording, startTime]);

  const start: startFn = useCallback(({onStop}) => {
    if (isRecording) {
      console.info('Cannot record track. Another track is being recorded.');
      return false;
    } else {
      setWatchInBackground(true);
      const startTime = Date.now();
      setStartTime(startTime);
      setRecording(true);
      setOnStop(() => onStop);
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
    onStop && onStop(coordinates);
    // Reset all the internal state
    setWatchInBackground(false);
    setRecording(false);
    setPaused(false);
    setCoordinates([]);
    setOnStop(undefined);
    setStartTime(undefined);
  }, [onStop, coordinates, setWatchInBackground]);

  return {
    start,
    pause,
    resume,
    stop,
    coordinates,
    isRecording,
    elapsedTime
  };
};

const initialState: useRecordingTrackType = {
  start: () => false,
  pause: () => undefined,
  resume: () => undefined,
  stop: () => undefined,
  coordinates: [],
  isRecording: false,
  elapsedTime: 0
};

export default singletonHook<useRecordingTrackType>(initialState, useRecordingTrack);
