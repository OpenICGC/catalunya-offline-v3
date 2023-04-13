import {DEFAULT_VIEWPORT} from '../../config';
import {useCallback} from 'react';
import {singletonHook} from 'react-singleton-hook';
import {WebMercatorViewport} from '@math.gl/web-mercator';
import usePersistedState from '../usePersistedState';

export type ViewportType = {
  latitude: number,
  longitude: number,
  zoom: number,
  bearing: number,
  pitch: number,
  width?: number,
  height?: number
};

export type FitBoundsOptions = {
  minExtent?: number; // 0.01 would be about 1000 meters (degree is ~110KM)
  maxZoom?: number; // ~x4,000,000 => About 10 meter extents
  // options
  padding?: number | {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  offset?: number[];
};

type useViewportType = {
  viewport: ViewportType,
  setViewport: (newViewport: Partial<ViewportType>) => void,
  fitBounds: (width: number, height: number, bbox?: [xmin: number, ymin: number, xmax: number, ymax: number], options?: FitBoundsOptions) => void,
}

const useViewport = (): useViewportType => {
  const [viewport, setViewport] = usePersistedState<ViewportType>('state.viewport', DEFAULT_VIEWPORT);

  const updateViewport = useCallback((newViewport: Partial<ViewportType>) => {
    setViewport(prevViewport => ({...prevViewport, ...newViewport}));
  }, []);

  const fitBounds = useCallback(
    (width: number, height:  number, bbox?: [xmin: number, ymin: number, xmax: number, ymax: number], options?: FitBoundsOptions) => {
      if (bbox) {
        const targetViewport = new WebMercatorViewport({width, height})
          .fitBounds(
            [[bbox[0], bbox[1]], [bbox[2], bbox[3]]],
            options
          );
        updateViewport(targetViewport);
      }

    }, []);

  return {
    viewport,
    setViewport: updateViewport,
    fitBounds
  };
};

const initialState: useViewportType = {
  viewport: DEFAULT_VIEWPORT,
  setViewport: () => undefined,
  fitBounds: () => undefined
};

export default singletonHook<useViewportType>(initialState, useViewport);
