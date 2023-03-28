import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import maplibregl from 'maplibre-gl';

//GEOCOMPONENTS
import GeocomponentMap from '@geomatico/geocomponents/Map/Map';

//CATOFFLINE
import AboutDialog from '../components/common/AboutDialog';
import FabButton, {LOCATION_STATUS} from '../components/buttons/FabButton';
import PositionEditor from '../components/map/PositionEditor';
import PointMarkers from '../components/map/PointMarkers';
import LocationMarker from '../components/map/LocationMarker';
import ScopeSelector from '../components/scope/ScopeSelector';
import TrackRecorder from '../components/map/TrackRecorder';
import TrackNavigationBottomSheet from '../components/map/TrackNavigationBottomSheet';
import SearchBoxAndMenu from '../components/common/SearchBoxAndMenu';
import SettingsView from './SettingsView';
import PointNavigationBottomSheet from '../components/map/PointNavigationBottomSheet';

//UTILS
import {MapboxMap, MapboxStyle, MapRef} from 'react-map-gl';
import {mbtiles} from '../utils/mbtiles';
import {GPS_POSITION_DEFAULT_COLOR, INITIAL_VIEWPORT, MAP_PROPS, MIN_TRACKING_ZOOM} from '../config';
import {useScopePoints, useScopes, useScopeTracks} from '../hooks/useStoredCollections';
import {AnyLayer, MapLayerMouseEvent, MapTouchEvent, Sources} from 'mapbox-gl';
import {Feature, Position} from 'geojson';
import {v4 as uuid} from 'uuid';
import {useTranslation} from 'react-i18next';
import {useViewport} from '../hooks/useViewport';
import useEditingPosition from '../hooks/useEditingPosition';
import useCompass from '../hooks/useCompass';
import useGeolocation, {Geolocation} from '../hooks/useGeolocation';
import usePointNavigation from '../hooks/usePointNavigation';
import useRecordingTrack from '../hooks/useRecordingTrack';
import useTrackNavigation from '../hooks/useTrackNavigation';
import {useSettings} from '../hooks/useSettings';
import {Manager, ScopePoint, UUID} from '../types/commonTypes';
/*import {useStatus} from '@capacitor-community/network-react';*/

mbtiles(maplibregl);

// This is a hack to apply the fix
// https://github.com/mapbox/mapbox-gl-js/pull/4852/files#diff-3209d9864922146ac92cd50a2993cb7274ea92ffb28544ed574fa54ebbc23ef5
// To raster-dem layers.
// See https://github.com/mapbox/mapbox-gl-js/issues/3893
maplibregl.RasterDEMTileSource.prototype.serialize = maplibregl.RasterTileSource.prototype.serialize;

const sources: Sources = {
  'geolocation': {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  },
  'recordingTrack': {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  },
  'navigateToPointLine': {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  },
  'trackList': {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  },
  'extraLayers': {
    type: 'geojson',
    data: 'extra-layers.json'
  }
};

const layers: Array<AnyLayer> = [{
  id: 'geolocation-precision',
  source: 'geolocation',
  type: 'circle',
  paint: {
    'circle-color': GPS_POSITION_DEFAULT_COLOR,
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
    'circle-stroke-color': GPS_POSITION_DEFAULT_COLOR,
    'circle-stroke-opacity': 0.67,
    'circle-stroke-width': 1,
    'circle-pitch-alignment': 'map'
  }
}, 
{
  id: 'recordingTrack',
  source: 'recordingTrack',
  type: 'line',
  paint: {
    'line-color': '#d32f2f',
    'line-width': 4
  }
}, 
{
  id: 'navigateToPointLine',
  source: 'navigateToPointLine',
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
}, 
{
  id: 'trackList',
  source: 'trackList',
  type: 'line',
  paint: {
    'line-color': ['get', 'color'],
    'line-width': 4
  }
},
{
  id: 'extraLayers',
  source: 'extraLayers',
  type: 'symbol',
  layout: {
    'text-font': ['pictos_25_icgc-Regular'],
    'text-size': 18,
    'text-anchor': 'center',
    'text-justify': 'center',
    'symbol-placement': 'point',
    'text-allow-overlap': true,
    'text-field': ['match', ['get', 't'], // Tipus
      0, '\u0055', // Refugi
      1, '\u0062', // Camping
      2, '\u002C', // Turisme Rural
      3, '\u003A', // Alberg
      '\u0020' // Default
    ]
  },
  paint: {
    'text-halo-width': 1,
    'text-halo-color': '#fff',
    'text-color': ['match', ['get', 't'], // Tipus
      0, '#D4121E', // 0, '#FE946C', // Refugi
      1, '#F1BE25', // 1, '#6FC6B5', // Camping
      2, '#4A8A63', // 2, '#8DA0CB', // Turisme Rural
      3, '#1FA1E2', // 3, '#E78AC3', // Alberg
      '#000000' // Default
    ]
  }
}];

export type MainContentProps = {
  mapStyle: string | MapboxStyle,
  manager: Manager,
  onManagerChanged: (newManager: Manager) => void,
  selectedScopeId?: UUID,
  onScopeSelected: (scopeId: UUID) => void,
  selectedPointId?: UUID,
  onPointSelected: (pointId: UUID) => void,
  onShowPointDetails: (pointId: UUID) => void,
  selectedTrackId?: UUID,
  //onTrackSelected: (trackId: UUID) => void,
  onShowTrackDetails: (trackId: UUID) => void,
  layerVisibility: Record<number, boolean>,
};

const Map: FC<MainContentProps> = ({
  mapStyle,
  manager,
  onManagerChanged,
  selectedScopeId,
  onScopeSelected,
  selectedPointId,
  onPointSelected,
  onShowPointDetails,
  selectedTrackId,
  //onTrackSelected, // TODO
  onShowTrackDetails,
  layerVisibility
}) => {
  const mapRef = useRef<MapRef>(null);
  const {viewport, setViewport} = useViewport();
  const {geolocation, error: geolocationError} = useGeolocation();
  const heading = useCompass();
  const [locationStatus, setLocationStatus] = useState(LOCATION_STATUS.DISABLED);
  const {t} = useTranslation();
  const pointNavigation = usePointNavigation();
  const trackNavigation = useTrackNavigation();

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
  const trackList = trackStore.list();

  const editingPosition = useEditingPosition();
  const [pointIntent, setPointIntent] = useState<Position>();

  const recordingTrack = useRecordingTrack();
  
  const [isFabOpen, setFabOpen] =useState<boolean>(false);
  const [isFabHidden, setFabHidden] =useState<boolean>(false);
  const [isSearchBoxHidden, setSearchBoxHidden] =useState<boolean>(false);
  const [isContextualMenuOpen, setContextualMenuOpen] = useState(false);
  const toggleFabOpen = () => setFabOpen(prevState => !prevState);

  
  const {isLargeSize, gpsPositionColor} = useSettings();
  // Set blue dot location on geolocation updates
  const setMapGeolocation = (map: MapboxMap | undefined, geolocation: Geolocation) => {
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
    setMapGeolocation(mapRef?.current?.getMap(), geolocation);
  }, [geolocation, mapRef.current]);

  useEffect(() => {
    mapRef.current?.once('styledata', () => {
      setMapGeolocation(mapRef.current?.getMap(), geolocation);
      addMapRecordingTrack();
      addMapTrackList();
    });
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
    setFabOpen(false);
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
  const handleClick = () => {
    setContextualMenuOpen(false);
    setSearchBoxHidden(!isSearchBoxHidden);
    setFabOpen(false);
    setFabHidden(!isFabHidden);
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

  const addMapRecordingTrack = () => {
    if (mapRef?.current && recordingTrack.coordinates.length) {
      const map = mapRef.current;
      const source = (map?.getSource('recordingTrack') as maplibregl.GeoJSONSource | undefined);
      source?.setData({
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: recordingTrack.coordinates
          }
        }]
      });
    }
  };

  useEffect(() => {
    addMapRecordingTrack();
  }, [recordingTrack.coordinates, mapRef.current]);

  const addMapTrackList = () => {
    if (mapRef?.current) {
      const map = mapRef.current;
      const source = (map?.getSource('trackList') as maplibregl.GeoJSONSource | undefined);
      source?.setData({
        type: 'FeatureCollection',
        features: trackList.filter(track =>
          track.geometry !== null &&
          track.properties.isVisible
        ).map(track => ({
          ...track,
          properties: {
            ...track.properties,
            color: track.properties.color || scopeColor
          }
        })) as Array<Feature>
      });
    }
  };

  useEffect(() => {
    addMapTrackList();
  }, [trackList, mapRef.current]);

  const addNavigateToPoint = () => {
    if (mapRef?.current) {
      const map = mapRef.current;
      const source = (map?.getSource('navigateToPointLine') as maplibregl.GeoJSONSource | undefined);
      source?.setData({
        type: 'FeatureCollection',
        features: pointNavigation.feature ? [pointNavigation.feature] : []
      });
    }
  };

  useEffect(() => {
    addNavigateToPoint();
  }, [pointNavigation.feature, mapRef.current]);

  const handlePointNavigationFitBounds = () => {
    const bbox = pointNavigation.getBounds();
    bbox && mapRef.current?.fitBounds(bbox, {padding: {top: 50, bottom: 50 + bottomMargin, left: 50, right: 50}});
  };

  useEffect(() => {
    if (pointNavigation.target) {
      const deferredFitBounds = async () => {
        await new Promise(r => setTimeout(r, 300));
        handlePointNavigationFitBounds();
        setFabOpen(false);
        setLocationStatus(LOCATION_STATUS.NOT_TRACKING);
      };
      deferredFitBounds().catch(console.error);
    }
  }, [pointNavigation.target]);

  const handlePointNavigationShowDetails = () => pointNavigation.target && onShowPointDetails(pointNavigation.target.id);

  const handleTrackNavigationFitBounds = () => {
    const bbox = trackNavigation.getBounds();
    bbox && mapRef.current?.fitBounds(bbox, {padding: {top: 50, bottom: 50 + bottomMargin, left: 50, right: 50}});
  };

  useEffect(() => {
    if (trackNavigation.target) {
      const deferredFitBounds = async () => {
        await new Promise(r => setTimeout(r, 300));
        handleTrackNavigationFitBounds();
        setFabOpen(false);
        setLocationStatus(LOCATION_STATUS.NOT_TRACKING);
      };
      deferredFitBounds().catch(console.error);
    }
  }, [trackNavigation.target]);

  const handleTrackNavigationShowDetails = () => trackNavigation.target && onShowTrackDetails(trackNavigation.target.id);

  const [isSettingsDialogOpen, setSettingsDialogOpen] =useState<boolean>(false);
  const [isAboutDialogOpen, setAboutDialogOpen] =useState<boolean>(false);
  const handleContextualMenu = (menuId: string) => {
    menuId === 'settings'
      ? setSettingsDialogOpen(true)
      : menuId === 'about' 
        ? setAboutDialogOpen(true)
        : undefined;
  };

  const [bottomMargin, setBottomMargin] = useState(0);
  const handleTopChanged = (height: number) => {
    setBottomMargin(height);
  };

  const handleEditingPositionAccept = () => {
    setBottomMargin(0);
    editingPosition.accept();
  };

  const handleEditingPositionCancel = () => {
    setBottomMargin(0);
    editingPosition.cancel();
  };

  const handleRecordingTrackStop = () => {
    setBottomMargin(0);
    recordingTrack.stop();
  };

  const dynamicLayers = useMemo(() => {
    const visibleLayerIds = Object.entries(layerVisibility)
      .filter(([, v]) => v)
      .map(([k, ]) => Number(k));
    return layers.map(layer =>
      layer.id === 'extraLayers' ? {
        ...layer,
        filter: ['in', ['get', 't'], ['literal', visibleLayerIds]]
      } : layer);
  }, [layerVisibility]);

  return <>
    <SearchBoxAndMenu 
      placeholder={t('actions.search')}
      onContextualMenuClick={handleContextualMenu}
      isHidden={isSearchBoxHidden}
      isContextualMenuOpen={isContextualMenuOpen}
      toggleContextualMenu={() => setContextualMenuOpen(!isContextualMenuOpen)}
      onSearchClick={() => setLocationStatus(LOCATION_STATUS.NOT_TRACKING)}
    />
    <GeocomponentMap
      styleDiffing={true}
      {...MAP_PROPS}
      //reuseMaps
      ref={mapRef}
      mapStyle={mapStyle}
      sources={sources}
      layers={dynamicLayers}
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
      onClick={handleClick}
      onDblClick={handleDoubleClick}
      doubleClickZoom={false}
      attributionControl={false}
    >
      <LocationMarker geolocation={geolocation} heading={heading} color={gpsPositionColor}/>
      <PointMarkers points={pointList} defaultColor={scopeColor} onClick={selectPoint}/>
      {!editingPosition.position && <FabButton
        isFabOpen={isFabOpen} onFabClick={toggleFabOpen} isFabHidden={isFabHidden}
        bearing={viewport.bearing} pitch={viewport.pitch}
        locationStatus={locationStatus}
        onOrientationClick={handleOrientationClick}
        onLocationClick={handleLocationClick}
        onLayersClick={() => changeManager('LAYERS')}
        onBaseMapsClick={() => changeManager('BASEMAPS')}
        onScopesClick={() => changeManager('SCOPES')}
      />}
    </GeocomponentMap>
    
    {!!editingPosition.position && <PositionEditor
      name={selectedPoint?.properties.name}
      bottomMargin={bottomMargin}
      color={pointColor}
      onAccept={handleEditingPositionAccept}
      onCancel={handleEditingPositionCancel}
    />}
    {recordingTrack.isRecording && <TrackRecorder
      name={selectedTrack?.properties.name}
      bottomMargin={bottomMargin}
      color={trackColor}
      elapsedTime={recordingTrack.elapsedTime}
      onPause={recordingTrack.pause}
      onResume={recordingTrack.resume}
      onStop={handleRecordingTrackStop}
    />}
    {!!pointIntent && <ScopeSelector
      isLargeSize={isLargeSize}
      scopes={scopeStore.list()}
      onScopeSelected={handleScopeSelected}
      onCancel={handleScopeSelectionCancelled}
    />}
    {pointNavigation.target && <PointNavigationBottomSheet
      name={pointNavigation.target.name}
      color={pointNavigation.target.color}
      bearing={pointNavigation.feature?.properties.bearing || 0}
      distance={pointNavigation.feature?.properties.distance || 0}
      onStop={pointNavigation.stop}
      onFitBounds={handlePointNavigationFitBounds}
      onShowDetails={handlePointNavigationShowDetails}
      onTopChanged={handleTopChanged}
    />}
    {trackNavigation.target && <TrackNavigationBottomSheet
      name={trackNavigation.target.name}
      color={trackNavigation.target.color}
      coordinates={trackNavigation.target.coordinates}
      currentPositionIndex={trackNavigation.currentPositionIndex}
      isOutOfTrack={trackNavigation.isOutOfTrack}
      isReverseDirection={trackNavigation.isReverseDirection}
      onReverseDirection={trackNavigation.toggleReverseDirection}
      onStop={trackNavigation.stop}
      onFitBounds={handleTrackNavigationFitBounds}
      onShowDetails={handleTrackNavigationShowDetails}
      onTopChanged={handleTopChanged}
    />}
    {isSettingsDialogOpen && <SettingsView
      onClose={() => setSettingsDialogOpen(false)}
    />}
    {isAboutDialogOpen && <AboutDialog
      onClose={() => setAboutDialogOpen(false)}
    />}
  </>;
};
export default Map;
