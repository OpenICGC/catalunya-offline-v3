import React, {FC, useEffect, useMemo, useState} from 'react';
import {Source, Layer} from 'react-map-gl';
import {CircleLayer, LineLayer} from 'mapbox-gl';
import {Feature, FeatureCollection, LineString, Point} from 'geojson';

import {HEXColor, ScopeTrack} from '../../types/commonTypes';
import {Geolocation} from '../../hooks/singleton/useGeolocation';
import {DEFAULT_VIEWPORT} from '../../config';

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

  // TODO COF-291 Add sources & layers for each of the userLayers

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

  return <>
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
