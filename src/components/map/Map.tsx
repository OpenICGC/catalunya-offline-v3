import React, {forwardRef, ReactNode, Ref, useCallback} from 'react';
import ReactMapGL, {
  MapboxStyle,
  MapRef,
  ViewState,
  ViewStateChangeEvent,
  MapProps as ReacMapGlProps
} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import {MAP_PROPS} from '../../config';

import 'maplibre-gl/dist/maplibre-gl.css';

export type Viewport = Partial<ViewState>;

const cssStyle = {
  width: '100%',
  height: '100%'
};

export interface MapProps extends ReacMapGlProps {
  mapStyle: MapboxStyle,
  viewport: Viewport,
  onViewportChange?: (viewState: ViewState) => void,
  children?: ReactNode
}

const Map = forwardRef((props: MapProps, ref: Ref<MapRef>) => {
  const {
    mapStyle,
    viewport,
    onViewportChange,
    children,
    ...reactMapGlProps
  } = props;

  const handleMapMove = useCallback((value: ViewStateChangeEvent) =>
    onViewportChange && onViewportChange(value.viewState)
  , [onViewportChange]);

  return <ReactMapGL
    {...reactMapGlProps}
    mapLib={maplibregl}
    ref={ref}
    style={cssStyle}
    fog={undefined}
    terrain={undefined}
    mapStyle={mapStyle}
    {...viewport}
    onMove={handleMapMove}
    styleDiffing={true}
    reuseMaps={true}
    doubleClickZoom={false}
    attributionControl={false}
    RTLTextPlugin={''}
    {...MAP_PROPS}
  >
    {children}
  </ReactMapGL>;
});

Map.displayName = 'Map';

export default React.memo(Map);
