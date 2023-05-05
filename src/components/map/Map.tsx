import React, {forwardRef, ReactNode, Ref, useCallback, useEffect, useMemo, useRef} from 'react';
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
import {AnyLayer, Sources} from 'mapbox-gl';

export type Viewport = Partial<ViewState>;

const cssStyle = {
  width: '100%',
  height: '100%'
};

export interface MapProps extends ReacMapGlProps {
  mapStyle: MapboxStyle,
  //sprite?: string,
  //glyphs?: string,
  //terrain?: TerrainSpecification,
  sources: Sources,
  layers: Array<AnyLayer>,
  viewport: Viewport,
  onViewportChange?: (viewState: ViewState) => void,
  children?: ReactNode
}

const Map = forwardRef((props: MapProps, ref: Ref<MapRef>) => {
  const {
    mapStyle,
    //sprite,
    //glyphs,
    //terrain,
    sources,
    layers,
    viewport,
    onViewportChange,
    children,
    ...reactMapGlProps
  } = props;

  const fullStyle: MapboxStyle = useMemo(() => {
    return {
      ...mapStyle,
      sources: {
        ...(mapStyle.sources ? {...mapStyle.sources} : {}),
        ...(sources ? {...sources} : {})
      },
      layers: [
        ...(mapStyle.layers ? mapStyle.layers : []),
        ...(layers ? layers : [])
      ]
    };
  }, [mapStyle/*, sprite, glyphs, terrain*/, sources, layers]);

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
    mapStyle={fullStyle}
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
