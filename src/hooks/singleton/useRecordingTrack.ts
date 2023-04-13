import {useCallback, useEffect, useState} from 'react';
import {Position} from 'geojson';
import useGeolocation from './useGeolocation';
import {singletonHook} from 'react-singleton-hook';
import useStopWatch from '../useStopWatch';

type stopFn = (finalTrack: Array<Position>) => void;

type startFn = (argument: {
  onStop?: stopFn
}) => boolean;

type recordingState = {
  isRecording: boolean,
  isPaused: boolean,
  coordinates: Array<Position>,
  onStop?: stopFn
};

const initialRecordingState = {
  isRecording: false,
  isPaused: false,
  coordinates: []
};

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
  const [state, setState] = useState<recordingState>(initialRecordingState);
  const {geolocation, setWatchInBackground} = useGeolocation();
  const stopWatch = useStopWatch();

  useEffect(() => {
    if (geolocation.latitude !== null && geolocation.longitude !== null) {
      const newPosition: Position = [geolocation.longitude, geolocation.latitude, geolocation.altitude || 0, timeCoordinate()];
      setState(prevState => {
        if (prevState.isRecording && !prevState.isPaused) {
          return {
            ...prevState,
            coordinates: [...prevState.coordinates, newPosition]
          };
        } else {
          return prevState;
        }
      });
    }
  }, [geolocation.latitude, geolocation.longitude]);

  const start: startFn = useCallback(({onStop}) => {
    if (state.isRecording) {
      console.info('Cannot record track. Another track is being recorded.');
      return false;
    } else {
      setWatchInBackground(true);
      stopWatch.start();
      setState({
        ...initialRecordingState,
        isRecording: true,
        onStop
      });
      return true;
    }
  }, [state.isRecording, setWatchInBackground, stopWatch.start]);

  const pause = useCallback(() => {
    setWatchInBackground(false);
    stopWatch.pause();
    setState(
      prevState => ({
        ...prevState,
        isPaused: true
      })
    );
  }, [setWatchInBackground, stopWatch.pause]);

  const resume = useCallback(() => {
    setWatchInBackground(true);
    stopWatch.resume();
    setState(
      prevState => ({
        ...prevState,
        isPaused: false
      })
    );
  }, [setWatchInBackground, stopWatch.resume]);

  const stop = useCallback(() => {
    setWatchInBackground(false);
    stopWatch.stop();
    state.onStop && state.onStop(state.coordinates);
    setState(initialRecordingState);
  }, [setWatchInBackground, stopWatch.stop, state.onStop]);

  return {
    start,
    pause,
    resume,
    stop,
    coordinates: state.coordinates,
    isRecording: state.isRecording,
    elapsedTime: stopWatch.time
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
