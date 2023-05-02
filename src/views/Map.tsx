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
import {MapRef} from 'react-map-gl';
import {mbtiles} from '../utils/mbtiles';
import {DEFAULT_VIEWPORT, FIT_BOUNDS_PADDING, MAP_PROPS, MIN_TRACKING_ZOOM} from '../config';
import {useScopePoints, useScopes, useScopeTracks} from '../hooks/useStoredCollections';
import {AnyLayer, MapLayerMouseEvent, MapTouchEvent, Sources} from 'mapbox-gl';
import {Feature, Position} from 'geojson';
import {v4 as uuid} from 'uuid';
import {useTranslation} from 'react-i18next';
import useViewport from '../hooks/singleton/useViewport';
import useEditingPosition from '../hooks/singleton/useEditingPosition';
import useCompass from '../hooks/singleton/useCompass';
import useGeolocation from '../hooks/singleton/useGeolocation';
import usePointNavigation from '../hooks/singleton/usePointNavigation';
import useRecordingTrack from '../hooks/singleton/useRecordingTrack';
import useTrackNavigation from '../hooks/singleton/useTrackNavigation';
import {ContextMapsResult, Manager, ScopePoint, UUID} from '../types/commonTypes';
import useGpsPositionColor from '../hooks/settings/useGpsPositionColor';
import useIsLargeSize from '../hooks/settings/useIsLargeSize';
import useMapStyle from '../hooks/useMapStyle';
import useIsActive from '../hooks/singleton/useIsActive';

const HEADER_HEIGHT = 48;
const SEARCHBOX_HEIGHT = 64;
const POINT_NAVIGATION_BOTTOM_SHEET_HEIGHT= 144;
const TRACK_NAVIGATION_BOTTOM_SHEET_HEIGHT = 283;

mbtiles(maplibregl);

// This is a hack to apply the fix
// https://github.com/mapbox/mapbox-gl-js/pull/4852/files#diff-3209d9864922146ac92cd50a2993cb7274ea92ffb28544ed574fa54ebbc23ef5
// To raster-dem layers.
// See https://github.com/mapbox/mapbox-gl-js/issues/3893
maplibregl.RasterDEMTileSource.prototype.serialize = maplibregl.RasterTileSource.prototype.serialize;

export type MainContentProps = {
  baseMapId: string,
  onManagerChanged: (newManager: Manager) => void,
  selectedScopeId?: UUID,
  onScopeSelected: (scopeId: UUID) => void,
  selectedPointId?: UUID,
  onPointSelected: (pointId: UUID) => void,
  selectedTrackId?: UUID,
  onTrackSelected: (trackId: UUID) => void,
  visibleLayers: Array<number>,
};

const Map: FC<MainContentProps> = ({
  baseMapId,
  onManagerChanged,
  selectedScopeId,
  onScopeSelected,
  selectedPointId,
  onPointSelected,
  selectedTrackId,
  onTrackSelected,
  visibleLayers
}) => {
  const mapRef = useRef<MapRef>(null);
  const isActive = useIsActive();
  const {viewport, setViewport, fitBounds: viewportFitBounds} = useViewport();
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

  const [isFabOpen, setFabOpen] = useState<boolean>(false);
  const [isFabHidden, setFabHidden] = useState<boolean>(false);
  const [isSearchBoxHidden, setSearchBoxHidden] = useState<boolean>(false);
  const [isContextualMenuOpen, setContextualMenuOpen] = useState(false);

  const [bottomMargin, setBottomMargin] = useState(0);
  const [topMargin, setTopMargin] = useState(SEARCHBOX_HEIGHT);

  const mapStyle = useMapStyle(baseMapId);

  const toggleFabOpen = useCallback(() => setFabOpen(prevState => !prevState), []);

  const [isLargeSize] = useIsLargeSize();
  const [gpsPositionColor] = useGpsPositionColor();

  const fitBounds = useCallback((bounds) => {
    const width = mapRef.current?.getContainer().offsetWidth;
    const height = mapRef.current?.getContainer().offsetHeight;
    width && height && viewportFitBounds(width, height, bounds, {
      padding: {
        top: FIT_BOUNDS_PADDING + topMargin,
        bottom: FIT_BOUNDS_PADDING + bottomMargin,
        left: FIT_BOUNDS_PADDING,
        right: FIT_BOUNDS_PADDING
      }
    });
  }, [topMargin, bottomMargin, viewportFitBounds]);

  const scopeDependantSources: Sources = useMemo(() => ({
    'trackList': {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: trackList?.filter(track =>
          track.geometry !== null &&
          track.properties.isVisible
        ).map(track => ({
          ...track,
          properties: {
            ...track.properties,
            color: track.properties.color || scopeColor
          }
        }) as Feature) ?? []
      }
    }
  }), [trackList]);

  const navigationDependantSources: Sources = useMemo(() => {
    const {latitude, longitude} = geolocation;

    return {
      'geolocation': {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: latitude && longitude ? [{
            type: 'Feature',
            properties: {...geolocation},
            geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            }
          }] : []
        }
      },
      'recordingTrack': {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: recordingTrack.coordinates.length ? [{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: recordingTrack.coordinates
            }
          }] : []
        }
      },
      'navigateToPointLine': {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: pointNavigation.feature ? [pointNavigation.feature] : []
        }
      }
    };
  }, [geolocation.latitude, geolocation.longitude, recordingTrack.coordinates, pointNavigation.feature]);

  const sources: Sources = useMemo(() => ({
    ...scopeDependantSources,
    ...navigationDependantSources,
    'extraLayers': {
      type: 'geojson',
      data: 'extra-layers.json'
    }
  }), [scopeDependantSources, navigationDependantSources]);

  const layers: Array<AnyLayer> = useMemo(() => {
    return [{
      id: 'extraLayers',
      source: 'extraLayers',
      type: 'symbol',
      filter: ['in', ['get', 't'], ['literal', visibleLayers]],
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
    },{
      id: 'trackList',
      source: 'trackList',
      type: 'line',
      paint: {
        'line-color': ['get', 'color'],
        'line-width': 4
      }
    },{
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
    },{
      id: 'recordingTrack',
      source: 'recordingTrack',
      type: 'line',
      paint: {
        'line-color': '#d32f2f',
        'line-width': 4
      }
    },{
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
    }];
  }, [gpsPositionColor, visibleLayers]);

  ////// Handle orientation & navigation state transitions
  const handleOrientationClick = useCallback(() => {
    if (locationStatus === LOCATION_STATUS.NAVIGATING) {
      setLocationStatus(LOCATION_STATUS.TRACKING);
    } else {
      mapRef.current?.easeTo({
        bearing: 0,
        pitch: 0
      });
    }
  }, [locationStatus, mapRef]);

  const handleLocationClick = useCallback(() => {
    if (locationStatus === LOCATION_STATUS.NOT_TRACKING) {
      setLocationStatus(LOCATION_STATUS.TRACKING);
    } else if (locationStatus === LOCATION_STATUS.TRACKING) {
      setLocationStatus(LOCATION_STATUS.NAVIGATING);
    } else if (locationStatus === LOCATION_STATUS.NAVIGATING) {
      setLocationStatus(LOCATION_STATUS.TRACKING);
    }
  }, [locationStatus]);

  const disableTracking = useCallback(() => {
    if (locationStatus === LOCATION_STATUS.TRACKING || locationStatus === LOCATION_STATUS.NAVIGATING) {
      setLocationStatus(LOCATION_STATUS.NOT_TRACKING);
    }
  }, [locationStatus]);

  useEffect(() => {
    if (geolocationError) {
      setLocationStatus(LOCATION_STATUS.DISABLED);
    }
  }, [geolocationError]);

  useEffect(() => {
    if (geolocation?.latitude && geolocation?.longitude) {
      if (locationStatus === LOCATION_STATUS.TRACKING || locationStatus === LOCATION_STATUS.NAVIGATING) {
        setViewport({
          longitude: geolocation.longitude,
          latitude: geolocation.latitude,
          zoom: Math.max(MIN_TRACKING_ZOOM, viewport.zoom),
          bearing: locationStatus === LOCATION_STATUS.NAVIGATING && heading ? heading : 0,
          pitch: locationStatus === LOCATION_STATUS.NAVIGATING ? MAP_PROPS.maxPitch : 0
        });
      } else if (locationStatus === LOCATION_STATUS.DISABLED) {
        setLocationStatus(LOCATION_STATUS.NOT_TRACKING);
      }
    }
  }, [locationStatus, geolocation.latitude, geolocation.longitude, viewport.zoom, setViewport, heading]);

  const handleLayersClick = useCallback(() => {
    onManagerChanged('LAYERS');
    setFabOpen(false);
  }, [onManagerChanged]);

  const handleBaseMapsClick = useCallback(() => {
    onManagerChanged('BASEMAPS');
    setFabOpen(false);
  }, [onManagerChanged]);

  const handleScopesClick = useCallback(() => {
    onManagerChanged('SCOPES');
    setFabOpen(false);
  }, [onManagerChanged]);

  const selectPoint = useCallback((point: ScopePoint) => {
    setViewport({
      longitude: point.geometry.coordinates[0],
      latitude: point.geometry.coordinates[1],
      zoom: MAP_PROPS.maxZoom
    });
    onPointSelected(point.id);
  }, [onPointSelected, setViewport]);

  const createNewPoint = useCallback((coordinates: Position) => {
    const id = uuid();
    pointStore.create({
      type: 'Feature',
      id: id,
      geometry: {
        type: 'Point',
        coordinates: coordinates
      },
      properties: {
        name: `${t('point')} ${(pointStore.list()?.length ?? 0) + 1}`,
        timestamp: Date.now(),
        description: '',
        images: [],
        isVisible: true
      }
    });
    setPointIntent(undefined);
    onPointSelected(id);
    return id;
  }, [pointStore.create, pointStore.list, t, onPointSelected]);

  const [acceptPoint, setAcceptPoint] = useState(false);

  useEffect(() => {
    if (acceptPoint) {
      const newPosition = [viewport.longitude, viewport.latitude];
      if (selectedScopeId) {
        createNewPoint(newPosition);
      } else {
        setPointIntent(newPosition);
      }
      setAcceptPoint(false);
    }
  }, [acceptPoint, viewport.longitude, viewport.latitude, selectedScopeId, createNewPoint, pointList]);

  const onLongTap = useCallback((position: Position) => {
    setViewport({longitude: position[0], latitude: position[1], zoom: MAP_PROPS.maxZoom});
    editingPosition.start({
      initialPosition: position,
      onAccept: () => setAcceptPoint(true)
    });
  }, [editingPosition.start, setViewport]);

  const longTouchTimer = useRef<number>();

  const clearLongTouchTimer = useCallback(() => {
    if (longTouchTimer.current) {
      window.clearTimeout(longTouchTimer.current);
      longTouchTimer.current = undefined;
    }
  }, [longTouchTimer]);

  const handleTouchMove = useCallback(() => {
    disableTracking();
    clearLongTouchTimer();
  }, [disableTracking, clearLongTouchTimer]);

  const handleTouchStart = useCallback((e: MapTouchEvent) => {
    if (e.originalEvent.touches.length > 1) {
      return;
    }
    clearLongTouchTimer();
    longTouchTimer.current = window.setTimeout(() => {
      onLongTap([e.lngLat.lng, e.lngLat.lat]);
    }, 500);
  }, [clearLongTouchTimer, longTouchTimer, onLongTap]);

  const handleMapClick = useCallback(() => {
    setContextualMenuOpen(false);
    setSearchBoxHidden(!isSearchBoxHidden);
    setFabOpen(false);
    setFabHidden(!isFabHidden);
  }, [isSearchBoxHidden, isFabHidden]);

  const handleDoubleClick = useCallback((e: MapLayerMouseEvent) => {
    onLongTap([e.lngLat.lng, e.lngLat.lat]);
  }, [onLongTap]);

  const handleScopeSelected = useCallback((scopeId: UUID) => {
    onScopeSelected(scopeId);
  }, [onScopeSelected]);

  useEffect(() => {
    pointIntent && pointList && createNewPoint(pointIntent);
  }, [pointIntent, pointList, createNewPoint]);

  const handleScopeSelectionCancelled = useCallback(() => {
    setPointIntent(undefined);
  }, []);

  const handlePointNavigationFitBounds = useCallback(() => {
    fitBounds(pointNavigation.getBounds());
  }, [fitBounds, pointNavigation.getBounds]);

  useEffect(() => {
    if (recordingTrack.isRecording) {
      setTopMargin(SEARCHBOX_HEIGHT + HEADER_HEIGHT);
    } else {
      setTopMargin(SEARCHBOX_HEIGHT);
    }
  }, [recordingTrack.isRecording]);

  useEffect(() => {
    if (pointNavigation.isNavigating) {
      trackNavigation?.stop();
      setBottomMargin(POINT_NAVIGATION_BOTTOM_SHEET_HEIGHT);
    } else {
      setBottomMargin(0);
    }
  }, [pointNavigation.isNavigating, trackNavigation.stop]);

  const handlePointNavigationShowDetails = useCallback(() => {
    pointNavigation.target && onPointSelected(pointNavigation.target.id);
  }, [pointNavigation.target, onPointSelected]);

  const handleTrackNavigationFitBounds = useCallback(() => {
    fitBounds(trackNavigation.getBounds());
  }, [fitBounds, trackNavigation.getBounds]);

  useEffect(() => {
    if (trackNavigation.isNavigating) {
      pointNavigation?.stop();
      setBottomMargin(TRACK_NAVIGATION_BOTTOM_SHEET_HEIGHT);
    } else {
      setBottomMargin(0);
    }
  }, [trackNavigation.isNavigating, pointNavigation.stop]);

  const handleTrackNavigationShowDetails = useCallback(() => {
    trackNavigation.target && onTrackSelected(trackNavigation.target.id);
  }, [trackNavigation.target, onTrackSelected]);

  const [isSettingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);
  const [isAboutDialogOpen, setAboutDialogOpen] = useState<boolean>(false);

  const handleContextualMenu = useCallback((menuId: string) => {
    menuId === 'settings'
      ? setSettingsDialogOpen(true)
      : menuId === 'about' 
        ? setAboutDialogOpen(true)
        : undefined;
  }, []);

  const handleToggleContextualMenu = useCallback(() => {
    setContextualMenuOpen(prevValue => !prevValue);
  }, []);

  const handleResultClick = useCallback((result: ContextMapsResult) => {
    const coords = result.coordenades.split(',');
    setViewport({
      latitude: parseFloat(coords[1]),
      longitude: parseFloat(coords[0]),
      zoom: 14
    });
    setLocationStatus(LOCATION_STATUS.NOT_TRACKING);
  }, [setViewport]);

  const handleTopChanged = useCallback((height: number) => {
    setBottomMargin(height);
  }, []);

  const handleEditingPositionAccept = useCallback(() => {
    setBottomMargin(0);
    editingPosition.accept();
  }, [editingPosition.accept]);

  const handleEditingPositionCancel = useCallback(() => {
    setBottomMargin(0);
    editingPosition.cancel();
  }, [editingPosition.cancel]);

  const handleRecordingTrackStop = useCallback(() => {
    setBottomMargin(0);
    recordingTrack.stop();
  }, [recordingTrack.stop]);

  return <>
    {isActive && <SearchBoxAndMenu
      onContextualMenuClick={handleContextualMenu}
      isHidden={isSearchBoxHidden}
      isContextualMenuOpen={isContextualMenuOpen}
      onToggleContextualMenu={handleToggleContextualMenu}
      onResultClick={handleResultClick}
    />}
    {mapStyle && <GeocomponentMap
      styleDiffing={true}
      reuseMaps={true}
      RTLTextPlugin={''}
      {...MAP_PROPS}
      mapLib={maplibregl}
      //reuseMaps
      ref={mapRef}
      mapStyle={mapStyle}
      sources={isActive ? sources : undefined}
      layers={isActive ? layers : undefined}
      viewport={viewport}
      onViewportChange={setViewport}
      onDrag={disableTracking}
      onTouchMove={handleTouchMove}
      onWheel={disableTracking}
      onTouchStart={handleTouchStart}
      onTouchEnd={clearLongTouchTimer}
      onTouchCancel={clearLongTouchTimer}
      onClick={handleMapClick}
      onDblClick={handleDoubleClick}
      doubleClickZoom={false}
      attributionControl={false}
    >
      <LocationMarker geolocation={geolocation} heading={heading} color={gpsPositionColor}/>
      <PointMarkers points={pointList} defaultColor={scopeColor} onClick={selectPoint}/>

      {!editingPosition.isEditing && <FabButton
        isFabOpen={isFabOpen}
        onFabClick={toggleFabOpen}
        isFabHidden={isFabHidden}
        bearing={viewport.bearing}
        pitch={viewport.pitch}
        locationStatus={locationStatus}
        onOrientationClick={handleOrientationClick}
        onLocationClick={handleLocationClick}
        onLayersClick={handleLayersClick}
        onBaseMapsClick={handleBaseMapsClick}
        onScopesClick={handleScopesClick}
      />}
    </GeocomponentMap>}

    {editingPosition.isEditing && <PositionEditor
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
      scopes={scopeStore?.list() ?? []}
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
export default React.memo(Map);
