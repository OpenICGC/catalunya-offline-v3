import React, {FC, useEffect, useRef, useState} from 'react';
import maplibregl from 'maplibre-gl';

import GeocomponentMap from '@geomatico/geocomponents/Map';

import {Manager, ScopePoint, UUID} from '../types/commonTypes';
import {downloadMbtiles, getDatabase, isMbtilesDownloaded, mbtiles} from '../utils/mbtiles';
import useGeolocation, {Geolocation} from '../hooks/useGeolocation';
import FabButton, {LOCATION_STATUS} from '../components/buttons/FabButton';
import useCompass from '../hooks/useCompass';
import {GPS_POSITION_COLOR, INITIAL_VIEWPORT, MAP_PROPS, MBTILES, MIN_TRACKING_ZOOM, OFF_CAT} from '../config';
import PrecisePositionEditor from '../components/map/PrecisePositionEditor';
import GeoJSON from 'geojson';
import {useScopePoints, useScopes} from '../hooks/useStoredCollections';
import PointMarkers from '../components/map/PointMarkers';
import {useViewport} from '../hooks/useViewport';
import LocationMarker from '../components/map/LocationMarker';

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

const CHECKING = 0,
  DOWNLOADING = 1,
  AVAILABLE = 2,
  OPENING = 3,
  READY = 4;

const mbtilesStatusMessages = [
  'Checking mbtiles availability...',
  'Downloading mbtiles...',
  'Mbtiles downloaded',
  'Opening mbtiles...',
  'mbtiles ready'
];

export type MainContentProps = {
  mapStyle: string,
  manager: Manager,
  onManagerChanged: (newManager: Manager) => void,
  selectedScope?: UUID,
  setSelectedPoint: (pointId: UUID) => void,
  precisePositionRequest?: boolean | GeoJSON.Position,
  onPrecisePositionAccepted: (position: GeoJSON.Position) => void
  onPrecisePositionCancelled: () => void
};

const Map: FC<MainContentProps> = ({
  mapStyle,
  manager,
  onManagerChanged,
  selectedScope,
  setSelectedPoint,
  precisePositionRequest = false,
  onPrecisePositionAccepted,
  onPrecisePositionCancelled
}) => {
  const mapRef = useRef<maplibregl.Map>();
  const [viewport, setViewport] = useViewport();
  const [mbtilesStatus, setMbtilesStatus] = useState(CHECKING);
  const {geolocation, error: geolocationError} = useGeolocation();
  const heading = useCompass();
  const [locationStatus, setLocationStatus] = useState(LOCATION_STATUS.DISABLED);

  const scopeStore = useScopes();
  const scopeColor = selectedScope ? scopeStore.retrieve(selectedScope)?.color : undefined;
  const pointStore = useScopePoints(selectedScope);
  const pointList = pointStore.list();

  // Effects on offline tileset downloading
  useEffect(() => {
    if (OFF_CAT) {
      setMbtilesStatus(READY);
      return;
    }
    isMbtilesDownloaded(MBTILES.dbName).then(isDownloaded => {
      if (isDownloaded) {
        setMbtilesStatus(AVAILABLE);
      } else {
        downloadMbtiles(MBTILES.downloadMbtilesUrl).then(() => setMbtilesStatus(AVAILABLE));
        setMbtilesStatus(DOWNLOADING);
      }
    });
  }, []);

  useEffect(() => {
    if (mbtilesStatus === AVAILABLE) {
      getDatabase(MBTILES.dbName).then(() => setMbtilesStatus(READY));
      setMbtilesStatus(OPENING);
    }
  }, [mbtilesStatus]);

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
    if(locationStatus === LOCATION_STATUS.TRACKING || locationStatus === LOCATION_STATUS.NAVIGATING) {
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

  useEffect( () => {
    const {latitude, longitude} = geolocation;
    if (latitude && longitude) {
      if (locationStatus === LOCATION_STATUS.TRACKING || locationStatus === LOCATION_STATUS.NAVIGATING) {
        setViewport({
          ...viewport,
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
          ...viewport,
          bearing: heading
        });
      }
    }
  }, [heading]);

  const changeManager = (clicked: Manager) => {
    onManagerChanged(clicked === manager ? undefined : clicked);
  };

  useEffect(() => {
    if (Array.isArray(precisePositionRequest)) {
      setViewport({
        ...viewport,
        longitude: precisePositionRequest[0],
        latitude: precisePositionRequest[1],
        zoom: MAP_PROPS.maxZoom
      });
    }
  }, [precisePositionRequest]);

  const handlePrecisePositionAccepted = () => {
    onPrecisePositionAccepted([viewport.longitude, viewport.latitude]);
  };

  const selectPoint = (point: ScopePoint) => {
    setViewport({
      ...viewport,
      longitude: point.geometry.coordinates[0],
      latitude: point.geometry.coordinates[1],
      zoom: MAP_PROPS.maxZoom
    });
    setSelectedPoint(point.id);
  };

  return (mbtilesStatus === READY || OFF_CAT) ?
    <>
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
        onTouchMove={disableTracking}
        onWheel={disableTracking}
      >
        <LocationMarker geolocation={geolocation} heading={heading}/>
        <PointMarkers isAccessibleSize={false} points={pointList} defaultColor={scopeColor} onClick={selectPoint}/>
        {!precisePositionRequest && <FabButton
          isLeftHanded={false} isAccessibleSize={false}
          bearing={viewport.bearing} pitch={viewport.pitch}
          locationStatus={locationStatus}
          onOrientationClick={handleOrientationClick}
          onLocationClick={handleLocationClick}
          onLayersClick={() => changeManager('LAYERS')}
          onBaseMapsClick={() => changeManager('BASEMAPS')}
          onScopesClick={() => changeManager('SCOPES')}
        />}
      </GeocomponentMap>
      {!!precisePositionRequest && <PrecisePositionEditor
        // name={} // TODO get selected point's name
        onAccept={handlePrecisePositionAccepted}
        onCancel={onPrecisePositionCancelled}
      />}
    </>: <div>
      {mbtilesStatusMessages[mbtilesStatus]}
    </div>;
};

export default Map;
