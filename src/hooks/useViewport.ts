import {DEFAULT_VIEWPORT} from '../config';
import {useCallback} from 'react';
import {singletonHook} from 'react-singleton-hook';
import {WebMercatorViewport} from '@math.gl/web-mercator';
import usePersistedState from './usePersistedState';

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

const useViewportImpl = () => {
  const [viewport, setViewport] = usePersistedState<ViewportType>('state.viewport', DEFAULT_VIEWPORT);

  const updateViewport = (newViewport: Partial<ViewportType>) => setViewport({...viewport, ...newViewport});

  const fitBounds = useCallback(
    (bbox?: [xmin: number, ymin: number, xmax: number, ymax: number], options?: FitBoundsOptions) => {
      const {width, height} = viewport;
      if (width && height && bbox) {
        updateViewport(new WebMercatorViewport({width, height})
          .fitBounds(
            [[bbox[0], bbox[2]], [bbox[1], bbox[3]]],
            options
          )
        );
      }

    }, [viewport.width, viewport.height]);

  return {
    viewport,
    setViewport: updateViewport,
    fitBounds
  };
};

const trivialImpl = {
  viewport: DEFAULT_VIEWPORT,
  setViewport: () => undefined,
  fitBounds: () => undefined
};

export const useViewport = singletonHook(trivialImpl, useViewportImpl);
