import {useEffect, useState} from 'react';
import {Position} from 'geojson';
import useGeolocation from './useGeolocation';
import {singletonHook} from 'react-singleton-hook';
import useStopWatch from './useStopwatch';

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

const initialState = {
  isRecording: false,
  isPaused: false,
  coordinates: []
};

const useRecordingTrackImpl = () => {
  const [state, setState] = useState<recordingState>(initialState);
  const {geolocation} = useGeolocation(true);
  const stopWatch = useStopWatch();

  useEffect(() => {
    if (geolocation.latitude !== null && geolocation.longitude !== null) {
      const newPosition: Position = [geolocation.longitude, geolocation.latitude, geolocation.altitude || 0, stopWatch.time];
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

  const start: startFn = ({onStop}) => {
    if (state.isRecording) {
      console.info('Cannot record track. Another track is being recorded.');
      return false;
    } else {
      stopWatch.start();
      setState({
        ...initialState,
        isRecording: true,
        onStop,
        coordinates: geolocation.longitude && geolocation.latitude ?
          [[geolocation.longitude, geolocation.latitude, geolocation.altitude || 0, 0]] :
          []
      });
      return true;
    }
  };

  const pause = () => {
    stopWatch.pause();
    setState(
      prevState => ({
        ...prevState,
        isPaused: true
      })
    );
  };

  const resume = () => {
    stopWatch.resume();
    setState(
      prevState => ({
        ...prevState,
        isPaused: false
      })
    );
  };

  const stop = () => {
    stopWatch.stop();
    state.onStop && state.onStop(state.coordinates);
    setState(initialState);
  };

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

const trivialImpl = () => ({
  start: () => false,
  pause: () => undefined,
  resume: () => undefined,
  stop: () => undefined,
  coordinates: [],
  isRecording: false,
  elapsedTime: 0
});

const useRecordingTrack = singletonHook(trivialImpl, useRecordingTrackImpl);

export default useRecordingTrack;
