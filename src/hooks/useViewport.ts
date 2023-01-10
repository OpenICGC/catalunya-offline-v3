import {INITIAL_VIEWPORT} from '../config';
import {useCallback, useState} from 'react';
import { singletonHook } from 'react-singleton-hook';

export type ViewportType = {
  latitude: number,
  longitude: number,
  zoom: number,
  bearing: number,
  pitch: number
};

const useViewportImpl = () => {
  const [viewport, setViewport] = useState<ViewportType>(INITIAL_VIEWPORT);

  const updateViewport = useCallback(
    (newViewport: Partial<ViewportType>) => setViewport(
      prevViewport => ({
        ...prevViewport,
        ...newViewport
      })
    ), []);

  return {
    viewport,
    setViewport: updateViewport
  };
};

const initialState = {
  viewport: INITIAL_VIEWPORT,
  setViewport: () => undefined
};

export const useViewport = singletonHook(initialState, useViewportImpl);
