import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import maplibregl, {StyleSpecification} from 'maplibre-gl';

import GeocomponentMap from '@geomatico/geocomponents/Map';

import {Manager, ScopePoint, UUID} from '../types/commonTypes';
import useGeolocation, {Geolocation} from '../hooks/useGeolocation';
import FabButton, {LOCATION_STATUS} from '../components/buttons/FabButton';
import {mbtiles} from '../utils/mbtiles';
import useCompass from '../hooks/useCompass';
import {GPS_POSITION_COLOR, INITIAL_VIEWPORT, MAP_PROPS, MIN_TRACKING_ZOOM} from '../config';
import PositionEditor from '../components/map/PositionEditor';
import {useScopePoints, useScopes, useScopeTracks} from '../hooks/useStoredCollections';
import PointMarkers from '../components/map/PointMarkers';
import {useViewport} from '../hooks/useViewport';
import LocationMarker from '../components/map/LocationMarker';
import useEditingPosition from '../hooks/useEditingPosition';
import {LineLayer, MapLayerMouseEvent, MapTouchEvent} from 'mapbox-gl';
import {Position} from 'geojson';
import {v4 as uuid} from 'uuid';
import {useTranslation} from 'react-i18next';
import ScopeSelector from '../components/scope/ScopeSelector';
import useRecordingTrack from '../hooks/useRecordingTrack';
import TrackRecorder from '../components/map/TrackRecorder';
import {Source, Layer} from 'react-map-gl';

mbtiles(maplibregl);

const sources = {
  'geolocation': {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  }
};

const layers = [{
  id: 'geolocation-precision',
  source: 'geolocation',
  type: 'circle',
  paint: {
    'circle-color': GPS_POSITION_COLOR,
    'circle-opacity': 0.33,
    'circle-radius': [
      'interpolate',
      ['exponential', 2],
      ['zoom'],
      7, // Beware: this formula works only for latitudes around initial viewport's latitude
      ['/', ['*', ['get', 'accuracy'], ['^', 2, 7]], 156543.03 * Math.cos(INITIAL_VIEWPORT.latitude * (Math.PI / 180))],
      15,
      ['/', ['*', ['get', 'accuracy'], ['^', 2, 15]], 156543.03 * Math.cos(INITIAL_VIEWPORT.latitude * (Math.PI / 180))]
    ],
    'circle-stroke-color': GPS_POSITION_COLOR,
    'circle-stroke-opacity': 0.67,
    'circle-stroke-width': 1,
    'circle-pitch-alignment': 'map'
  }
}];


export type MainContentProps = {
  mapStyle: string | StyleSpecification,
  manager: Manager,
  onManagerChanged: (newManager: Manager) => void,
  selectedScopeId?: UUID,
  onScopeSelected: (scopeId: UUID) => void,
  selectedPointId?: UUID,
  onPointSelected: (scopeId: UUID) => void,
  selectedTrackId?: UUID,
  /*onTrackSelected: (pointId: UUID) => void*/
};

const Map: FC<MainContentProps> = ({
  mapStyle,
  manager,
  onManagerChanged,
  selectedScopeId,
  onScopeSelected,
  selectedPointId,
  onPointSelected,
  selectedTrackId,
  /*onTrackSelected*/
}) => {
  const mapRef = useRef<maplibregl.Map>();
  const {viewport, setViewport} = useViewport();
  const {geolocation, error: geolocationError} = useGeolocation();
  const heading = useCompass();
  const [locationStatus, setLocationStatus] = useState(LOCATION_STATUS.DISABLED);
  const {t} = useTranslation();

  const scopeStore = useScopes();
  const pointStore = useScopePoints(selectedScopeId);
  const trackStore = useScopeTracks(selectedScopeId);

  const selectedScope = selectedScopeId ? scopeStore.retrieve(selectedScopeId) : undefined;
  const selectedPoint = selectedPointId ? pointStore.retrieve(selectedPointId) : undefined;
  const selectedTrack = selectedTrackId ? trackStore.retrieve(selectedTrackId) : undefined;

  const scopeColor = selectedScope?.color;
  const pointColor = selectedPoint?.properties.color || scopeColor;
  const trackColor = selectedTrack?.properties.color || scopeColor;
  const pointList = pointStore.list();

  const editingPosition = useEditingPosition();
  const [pointIntent, setPointIntent] = useState<Position>();

  const recordingTrack = useRecordingTrack();

  // Set blue dot location on geolocation updates
  const setMapGeolocation = (map: maplibregl.Map | undefined, geolocation: Geolocation) => {
    const {latitude, longitude} = geolocation;
    const source = (map?.getSource('geolocation') as maplibregl.GeoJSONSource | undefined);
    source?.setData({
      type: 'FeatureCollection',
      features: latitude && longitude ? [{
        type: 'Feature',
        properties: {...geolocation},
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        }
      }] : []
    });
  };

  useEffect(() => {
    setMapGeolocation(mapRef?.current, geolocation);
  }, [geolocation, mapRef.current]);

  useEffect(() => {
    mapRef.current?.once('styledata', () => setMapGeolocation(mapRef.current, geolocation));
  }, [mapStyle]);

  ////// Handle orientation & navigation state transitions
  const handleOrientationClick = () => {
    if (locationStatus === LOCATION_STATUS.NAVIGATING) {
      setLocationStatus(LOCATION_STATUS.TRACKING);
    } else {
      mapRef.current?.easeTo({
        bearing: 0,
        pitch: 0
      });
    }
  };

  const handleLocationClick = () => {
    if (locationStatus === LOCATION_STATUS.NOT_TRACKING) {
      setLocationStatus(LOCATION_STATUS.TRACKING);
    } else if (locationStatus === LOCATION_STATUS.TRACKING) {
      setLocationStatus(LOCATION_STATUS.NAVIGATING);
    } else if (locationStatus === LOCATION_STATUS.NAVIGATING) {
      setLocationStatus(LOCATION_STATUS.TRACKING);
    }
  };

  const disableTracking = () => {
    if (locationStatus === LOCATION_STATUS.TRACKING || locationStatus === LOCATION_STATUS.NAVIGATING) {
      setLocationStatus(LOCATION_STATUS.NOT_TRACKING);
    }
  };

  useEffect(() => {
    if (geolocationError) {
      setLocationStatus(LOCATION_STATUS.DISABLED);
    }
  }, [geolocationError]);


  useEffect(() => {
    if (locationStatus === LOCATION_STATUS.TRACKING) {
      if (geolocation?.latitude && geolocation?.longitude) {
        mapRef.current?.easeTo({
          bearing: 0,
          pitch: 0,
          center: [geolocation.longitude, geolocation.latitude],
          zoom: Math.max(MIN_TRACKING_ZOOM, viewport.zoom)
        });
      }
    } else if (locationStatus === LOCATION_STATUS.NAVIGATING) {
      mapRef.current?.easeTo({
        pitch: 60,
        bearing: heading || 0
      });
    }
  }, [locationStatus]);

  useEffect(() => {
    const {latitude, longitude} = geolocation;
    if (latitude && longitude) {
      if (locationStatus === LOCATION_STATUS.TRACKING || locationStatus === LOCATION_STATUS.NAVIGATING) {
        setViewport({
          latitude,
          longitude,
          zoom: Math.max(MIN_TRACKING_ZOOM, viewport.zoom)
        });
      } else if (locationStatus === LOCATION_STATUS.DISABLED) {
        setLocationStatus(LOCATION_STATUS.NOT_TRACKING);
      }
    }
  }, [geolocation]);

  useEffect(() => {
    if (locationStatus === LOCATION_STATUS.NAVIGATING) {
      if (heading !== undefined) {
        setViewport({
          bearing: heading
        });
      }
    }
  }, [heading]);

  const changeManager = (clicked: Manager) => {
    onManagerChanged(clicked === manager ? undefined : clicked);
  };

  const selectPoint = (point: ScopePoint) => {
    setViewport({
      longitude: point.geometry.coordinates[0],
      latitude: point.geometry.coordinates[1],
      zoom: MAP_PROPS.maxZoom
    });
    onPointSelected(point.id);
  };

  const createNewPoint = (coordinates: Position) => {
    const id = uuid();
    pointStore.create({
      type: 'Feature',
      id: id,
      geometry: {
        type: 'Point',
        coordinates: coordinates
      },
      properties: {
        name: `${t('point')} ${pointStore.list().length + 1}`,
        timestamp: Date.now(),
        description: '',
        images: [],
        isVisible: true
      }
    });
    setPointIntent(undefined);
    onPointSelected(id);
    return id;
  };

  const onLongTap = useCallback((position: Position) => {
    editingPosition.start({
      initialPosition: position,
      onAccept: (newPosition) => {
        if (selectedScopeId) {
          createNewPoint(newPosition);
        } else {
          setPointIntent(newPosition);
        }
      }
    });
  }, [editingPosition, selectedScopeId, pointStore]);

  const longTouchTimer = useRef<number>();

  const handleTouchStart = (e: MapTouchEvent) => {
    if (e.originalEvent.touches.length > 1) {
      return;
    }
    clearLongTouchTimer();
    longTouchTimer.current = window.setTimeout(() => {
      onLongTap([e.lngLat.lng, e.lngLat.lat]);
    }, 500);
  };

  const clearLongTouchTimer = () => {
    if (longTouchTimer.current) {
      window.clearTimeout(longTouchTimer.current);
      longTouchTimer.current = undefined;
    }
  };

  const handleDoubleClick = (e: MapLayerMouseEvent) => {
    onLongTap([e.lngLat.lng, e.lngLat.lat]);
  };

  const handleScopeSelected = (scopeId: UUID) => {
    onScopeSelected(scopeId);
  };

  useEffect(() => {
    pointIntent && selectedScopeId && createNewPoint(pointIntent);
  }, [pointIntent, selectedScopeId]);

  const handleScopeSelectionCancelled = () => {
    // TODO cancel the point intent
    setPointIntent(undefined);
  };

  const recordingTrackSource: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: recordingTrack.coordinates
      }
    }]
  };

  const recordingTrackLayer: LineLayer = {
    id: 'recordingTrack',
    type: 'line',
    paint: {
      'line-color': '#FF0000',
      'line-width': 2
    }
  };

  return <>
    <GeocomponentMap
      {...MAP_PROPS}
      reuseMaps
      ref={mapRef}
      mapStyle={mapStyle}
      sources={sources}
      layers={layers}
      viewport={viewport}
      onViewportChange={setViewport}
      onDrag={disableTracking}
      onTouchMove={() => {
        disableTracking();
        clearLongTouchTimer();
      }}
      onWheel={disableTracking}
      onTouchStart={handleTouchStart}
      onTouchEnd={clearLongTouchTimer}
      onTouchCancel={clearLongTouchTimer}
      onDblClick={handleDoubleClick}
      doubleClickZoom={false}
    >
      <LocationMarker geolocation={geolocation} heading={heading}/>
      <PointMarkers isAccessibleSize={false} points={pointList} defaultColor={scopeColor} onClick={selectPoint}/>
      {!editingPosition.position && <FabButton
        isLeftHanded={false} isAccessibleSize={false}
        bearing={viewport.bearing} pitch={viewport.pitch}
        locationStatus={locationStatus}
        onOrientationClick={handleOrientationClick}
        onLocationClick={handleLocationClick}
        onLayersClick={() => changeManager('LAYERS')}
        onBaseMapsClick={() => changeManager('BASEMAPS')}
        onScopesClick={() => changeManager('SCOPES')}
      />}
      <Source type="geojson" data={recordingTrackSource}>
        <Layer {...recordingTrackLayer} />
      </Source>
    </GeocomponentMap>
    {!!editingPosition.position && <PositionEditor
      name={selectedPoint?.properties.name}
      color={pointColor}
      onAccept={editingPosition.accept}
      onCancel={editingPosition.cancel}
    />}
    {recordingTrack.isRecording && <TrackRecorder
      isAccessibleSize={false}
      name={selectedTrack?.properties.name}
      color={trackColor}
      elapsedTime={recordingTrack.elapsedTime}
      onPause={recordingTrack.pause}
      onResume={recordingTrack.resume}
      onStop={recordingTrack.stop}
    />}
    {!!pointIntent && <ScopeSelector
      isAccesibleSize={false}
      scopes={scopeStore.list()}
      onScopeSelected={handleScopeSelected}
      onCancel={handleScopeSelectionCancelled}
    />}
  </>;
};

export default Map;
