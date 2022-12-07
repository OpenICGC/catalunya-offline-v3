import {INITIAL_VIEWPORT} from '../config';
import {useState} from 'react';
import { singletonHook } from 'react-singleton-hook';

export type ViewportType = {
  latitude: number,
  longitude: number,
  zoom: number,
  bearing: number,
  pitch: number
};

const useViewportImpl = () => {
  return useState(INITIAL_VIEWPORT);
};

export const useViewport = singletonHook([INITIAL_VIEWPORT, () => undefined], useViewportImpl);
