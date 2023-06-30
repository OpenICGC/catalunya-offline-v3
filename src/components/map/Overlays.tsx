import React, {FC, useEffect, useMemo, useState} from 'react';
import {Source, Layer} from 'react-map-gl';
import {CircleLayer, FillLayer, LineLayer} from 'mapbox-gl';
import {Feature, FeatureCollection, LineString, Point} from 'geojson';

import {HEXColor, ScopeTrack, UUID} from '../../types/commonTypes';
import {Geolocation} from '../../hooks/singleton/useGeolocation';
import {DEFAULT_VIEWPORT} from '../../config';
import {useUserLayers} from '../../hooks/usePersistedCollections';

const pointStyle = (id: UUID, color: HEXColor): CircleLayer => ({
  id: `user-${id}-point`,
  filter: ['==', ['geometry-type'], 'Point'],
  type: 'circle',
  paint: {
    'circle-color': color,
    'circle-opacity': 0.33,
    'circle-radius': 7,
    'circle-stroke-color': color,
    'circle-stroke-opacity': 0.67,
    'circle-stroke-width': 1
  }
});
const lineStyle = (id: UUID, color: HEXColor): LineLayer => ({
  id: `user-${id}-line`,
  filter: ['==', ['geometry-type'], 'LineString'],
  type: 'line',
  paint: {
    'line-color': color,
    'line-width': 4
  }
});

const polygonOutlineStyle = (id: UUID, color: HEXColor): LineLayer => ({
  id: `user-${id}-polygon-outline`,
  filter: ['==', ['geometry-type'], 'Polygon'],
  type: 'line',
  paint: {
    'line-color': color,
    'line-width': 2
  }
});

const polygonStyle = (id: UUID, color: HEXColor): FillLayer => ({
  id: `user-${id}-polygon`,
  filter: ['==', ['geometry-type'], 'Polygon'],
  type: 'fill',
  paint: {
    'fill-color': color,
    'fill-opacity': 0.33
  }
});

export interface OverlaysProps {
  isActive: boolean,
  trackList?: Array<ScopeTrack>,
  scopeColor?: HEXColor,
  geolocation: Geolocation,
  navigateToLine?: Feature<LineString>,
  gpsPositionColor: HEXColor
}

const Overlays: FC<OverlaysProps> = ({isActive, trackList, scopeColor, geolocation, navigateToLine, gpsPositionColor}) => {
  const [trackListData, setTrackListData] = useState<FeatureCollection<LineString>>();
  const [geolocationData, setGeolocationData] = useState<FeatureCollection<Point>>();
  const [navigateToLineData, setNavigateToLineData] = useState<FeatureCollection<LineString>>();

  const userLayersStore = useUserLayers();
  const userLayers = userLayersStore.list();

  const trackListLayer = useMemo(() => {
    const props: LineLayer = {
      id: 'trackList',
      source: 'trackList',
      type: 'line',
      paint: {
        'line-color': ['get', 'color'],
        'line-width': 4
      }
    };
    return <Layer {...props}/>;
  }, []);

  const navigateToLineLayer = useMemo(() => {
    const props: LineLayer = {
      id: 'navigateToLine',
      source: 'navigateToLine',
      type: 'line',
      paint: {
        'line-color': '#000000',
        'line-width': 4,
        'line-opacity': 0.67,
        'line-dasharray': [2, 2]
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      }
    };
    return <Layer {...props}/>;
  }, []);

  const geolocationLayer = useMemo(() => {
    const props: CircleLayer = {
      id: 'geolocation-precision',
      source: 'geolocation',
      type: 'circle',
      paint: {
        'circle-color': gpsPositionColor,
        'circle-opacity': 0.33,
        'circle-radius': [
          'interpolate',
          ['exponential', 2],
          ['zoom'],
          7, // Beware: this formula works only for latitudes around initial viewport's latitude
          ['/', ['*', ['get', 'accuracy'], ['^', 2, 7]], 156543.03 * Math.cos(DEFAULT_VIEWPORT.latitude * (Math.PI / 180))],
          15,
          ['/', ['*', ['get', 'accuracy'], ['^', 2, 15]], 156543.03 * Math.cos(DEFAULT_VIEWPORT.latitude * (Math.PI / 180))]
        ],
        'circle-stroke-color': gpsPositionColor,
        'circle-stroke-opacity': 0.67,
        'circle-stroke-width': 1,
        'circle-pitch-alignment': 'map'
      }
    };
    return <Layer {...props}/>;
  }, [gpsPositionColor]);

  useEffect(() => {
    if (isActive) {
      const features: Array<Feature<LineString>> = trackList?.filter(track =>
        track.geometry !== null &&
        track.properties.isVisible
      ).map(track => ({
        ...track,
        properties: {
          ...track.properties,
          color: track.properties.color || scopeColor
        }
      }) as Feature<LineString>) ?? [];

      setTrackListData({
        type: 'FeatureCollection',
        features: features.map(feature => ({
          ...feature,
          properties: {
            ...feature.properties,
            id: feature.id // Hacking id into feature properties so it can be recovered on an "onClick" event
          }
        }))
      });
    }
  }, [isActive, trackList, scopeColor]);

  useEffect(() => {
    if (isActive) {
      setNavigateToLineData({
        type: 'FeatureCollection',
        features: navigateToLine ? [navigateToLine] : []
      });
    }
  }, [isActive, navigateToLine]);

  useEffect(() => {
    if (isActive) {
      const features: Array<Feature<Point>> = geolocation.latitude && geolocation.longitude ? [{
        type: 'Feature',
        properties: {...geolocation},
        geometry: {
          type: 'Point',
          coordinates: [geolocation.longitude, geolocation.latitude]
        }
      }] : [];

      setGeolocationData({
        type: 'FeatureCollection',
        features: features
      });
    }
  }, [isActive, geolocation.longitude, geolocation.latitude]);

  const userLayerSources = useMemo(() => userLayers
    ?.filter(userLayer => userLayer.isVisible)
    .map(userLayer =>
      <Source key={userLayer.id} id={userLayer.id} type='geojson' data={userLayer.data}>
        <Layer {...pointStyle(userLayer.id, userLayer.color)}/>
        <Layer {...lineStyle(userLayer.id, userLayer.color)}/>
        <Layer {...polygonOutlineStyle(userLayer.id, userLayer.color)}/>
        <Layer {...polygonStyle(userLayer.id, userLayer.color)}/>
      </Source>),
  [userLayers]);


  return <>
    {userLayerSources}
    <Source id='trackList' type='geojson' data={trackListData}>
      {trackListLayer}
    </Source>
    <Source id='navigateToLine' type='geojson' data={navigateToLineData}>
      {navigateToLineLayer}
    </Source>
    <Source id='geolocation' type='geojson' data={geolocationData}>
      {geolocationLayer}
    </Source>
  </>;
};

export default React.memo(Overlays);
