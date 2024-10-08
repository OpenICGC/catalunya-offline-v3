import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import maplibregl from 'maplibre-gl';

//GEOCOMPONENTS
import MapComponent from '../components/map/Map';

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
import {mbtiles} from '../utils/mbtiles';
import {BASEMAPS, DEFAULT_MAX_ZOOM, FIT_BOUNDS_PADDING, MAP_PROPS, MIN_TRACKING_ZOOM} from '../config';
import {useScopePoints, useScopes, useScopeTracks} from '../hooks/usePersistedCollections';
import {MapLayerMouseEvent, MapTouchEvent} from 'mapbox-gl';
import {Position} from 'geojson';
import {v4 as uuid} from 'uuid';
import {useTranslation} from 'react-i18next';
import useViewport from '../hooks/singleton/useViewport';
import useEditingPosition from '../hooks/singleton/useEditingPosition';
import useCompass from '../hooks/singleton/useCompass';
import useGeolocation from '../hooks/singleton/useGeolocation';
import usePointNavigation from '../hooks/singleton/usePointNavigation';
import useRecordingTrack from '../hooks/singleton/useRecordingTrack';
import useTrackNavigation from '../hooks/singleton/useTrackNavigation';
import {ContextMapsResult, Manager, ScopePoint, ScopeTrack, UUID} from '../types/commonTypes';
import useGpsPositionColor from '../hooks/settings/useGpsPositionColor';
import useIsLargeSize from '../hooks/settings/useIsLargeSize';
import useMapStyle from '../hooks/useMapStyle';
import useIsActive from '../hooks/singleton/useIsActive';
import Overlays from '../components/map/Overlays';
import GpsDisabledAlert from '../components/common/GpsDisabledAlert';

const HEADER_HEIGHT = 48;
const SEARCHBOX_HEIGHT = 64;
const POINT_NAVIGATION_BOTTOM_SHEET_HEIGHT= 144;
const TRACK_NAVIGATION_BOTTOM_SHEET_HEIGHT = 283;

const interactiveLayerIds = ['trackList'];

mbtiles(maplibregl);

// This is a hack to apply the fix
// https://github.com/mapbox/mapbox-gl-js/pull/4852/files#diff-3209d9864922146ac92cd50a2993cb7274ea92ffb28544ed574fa54ebbc23ef5
// To raster-dem layers.
// See https://github.com/mapbox/mapbox-gl-js/issues/3893
maplibregl.RasterDEMTileSource.prototype.serialize = maplibregl.RasterTileSource.prototype.serialize;

export type MapViewProps = {
  baseMapId: string,
  onManagerChanged: (newManager: Manager) => void,
  locationStatus: LOCATION_STATUS,
  onLocationStatusChanged: (newLocationStatus: LOCATION_STATUS) => void,
  selectedScopeId?: UUID,
  onScopeSelected: (scopeId: UUID) => void,
  selectedPointId?: UUID,
  onPointSelected: (pointId: UUID) => void,
  selectedTrackId?: UUID,
  onTrackSelected: (trackId: UUID) => void
};

const MapView: FC<MapViewProps> = ({
  baseMapId,
  onManagerChanged,
  locationStatus,
  onLocationStatusChanged,
  selectedScopeId,
  onScopeSelected,
  selectedPointId,
  onPointSelected,
  selectedTrackId,
  onTrackSelected
}) => {
  const isActive = useIsActive();
  const {viewport, setViewport, mapRef, fitBounds: viewportFitBounds} = useViewport();

  const {geolocation, error: geolocationError} = useGeolocation();
  const heading = useCompass();
  const {t} = useTranslation();
  const pointNavigation = usePointNavigation();
  const trackNavigation = useTrackNavigation();

  const scopeStore = useScopes();
  const pointStore = useScopePoints(selectedScopeId);
  const trackStore = useScopeTracks(selectedScopeId);

  const scopeList = scopeStore.list();
  const pointList = pointStore.list();
  const trackList = trackStore.list();

  const selectedScope = selectedScopeId ? scopeStore.retrieve(selectedScopeId) : undefined;
  const selectedPoint = selectedPointId ? pointStore.retrieve(selectedPointId) : undefined;
  const selectedTrack = selectedTrackId ? trackStore.retrieve(selectedTrackId) : undefined;

  const scopeColor = selectedScope?.color;
  const pointColor = selectedPoint?.properties.color || scopeColor;
  const trackColor = selectedTrack?.properties.color || scopeColor;

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

  const maxZoom = useMemo(() => BASEMAPS.find(({id}) => id === baseMapId)?.maxZoom ?? DEFAULT_MAX_ZOOM, [baseMapId]);

  const fitBounds = useCallback((bounds, extraBottom = 0) => {
    viewportFitBounds(bounds, {
      padding: {
        top: FIT_BOUNDS_PADDING + topMargin,
        bottom: FIT_BOUNDS_PADDING + bottomMargin + extraBottom,
        left: FIT_BOUNDS_PADDING,
        right: FIT_BOUNDS_PADDING
      }
    });
  }, [topMargin, bottomMargin, viewportFitBounds]);

  ////// Handle orientation & navigation state transitions
  const handleOrientationClick = useCallback(() => {
    if (locationStatus === LOCATION_STATUS.NAVIGATING) {
      onLocationStatusChanged(LOCATION_STATUS.TRACKING);
    } else {
      mapRef.current?.easeTo({
        bearing: 0,
        pitch: 0
      });
    }
  }, [locationStatus, mapRef]);

  const handleLocationClick = useCallback(() => {
    if (locationStatus === LOCATION_STATUS.NOT_TRACKING) {
      onLocationStatusChanged(LOCATION_STATUS.TRACKING);
    } else if (locationStatus === LOCATION_STATUS.TRACKING) {
      onLocationStatusChanged(LOCATION_STATUS.NAVIGATING);
    } else if (locationStatus === LOCATION_STATUS.NAVIGATING) {
      onLocationStatusChanged(LOCATION_STATUS.TRACKING);
    }
  }, [locationStatus]);

  const disableTracking = useCallback(() => {
    if (locationStatus === LOCATION_STATUS.TRACKING || locationStatus === LOCATION_STATUS.NAVIGATING) {
      onLocationStatusChanged(LOCATION_STATUS.NOT_TRACKING);
    }
  }, [locationStatus]);

  useEffect(() => {
    if (geolocationError) {
      onLocationStatusChanged(LOCATION_STATUS.DISABLED);
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
        onLocationStatusChanged(LOCATION_STATUS.NOT_TRACKING);
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
      zoom: maxZoom
    });
    onPointSelected(point.id);
  }, [onPointSelected, setViewport, maxZoom]);

  const selectTrack = useCallback((track: ScopeTrack) => {
    const bounds = track?.geometry?.coordinates.reduce<[number, number, number, number]>((bbox, position) => ([
      Math.min(bbox[0], position[0]), // xMin
      Math.min(bbox[1], position[1]), // yMin
      Math.max(bbox[2], position[0]), // xMax
      Math.max(bbox[3], position[1])  // yMax
    ]), [180, 90, -180, -90]);
    if (bounds) {
      fitBounds(bounds);
    }
    onTrackSelected(track.id);
  }, [fitBounds, onTrackSelected]);

  const [acceptPoint, setAcceptPoint] = useState(false);

  const onLongTap = useCallback((position: Position) => {
    setViewport({longitude: position[0], latitude: position[1], zoom: maxZoom});
    editingPosition.start({
      initialPosition: position,
      onAccept: () => setAcceptPoint(true)
    });
  }, [setViewport, editingPosition.start, maxZoom]);

  const longTouchTimer = useRef<number>();

  const clearLongTouchTimer = useCallback(() => {
    if (longTouchTimer.current) {
      window.clearTimeout(longTouchTimer.current);
      longTouchTimer.current = undefined;
    }
  }, [longTouchTimer]);

  useEffect(() => {
    if (acceptPoint) {
      setAcceptPoint(false);
      const newPosition = [viewport.longitude, viewport.latitude];
      if (selectedScopeId) {
        createNewPoint(newPosition);
      } else {
        setPointIntent(newPosition);
      }
    }
  }, [acceptPoint]);

  const createNewPoint = useCallback((coordinates: Position) => {
    setPointIntent(undefined);
    const id = uuid();
    pointStore.create({
      type: 'Feature',
      id: id,
      geometry: {
        type: 'Point',
        coordinates: coordinates
      },
      properties: {
        name: `${t('point')} ${(pointList?.length ?? 0) + 1}`,
        timestamp: Date.now(),
        description: '',
        images: [],
        isVisible: true
      }
    });
    onPointSelected(id);
  }, [pointStore.create, pointList, t, onPointSelected]);

  useEffect(() => {
    if (pointIntent && selectedScope && pointList) {
      createNewPoint(pointIntent);
    }
  }, [pointIntent, selectedScope, pointList, createNewPoint]);

  const handleScopeSelected = useCallback((scopeId: UUID) => {
    onScopeSelected(scopeId);
  }, [onScopeSelected]);

  const handleScopeSelectionCancelled = useCallback(() => {
    setPointIntent(undefined);
  }, []);

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

  const handleMapClick = useCallback(({features}) => {
    setContextualMenuOpen(false);
    setSearchBoxHidden(!isSearchBoxHidden);
    setFabOpen(false);
    setFabHidden(!isFabHidden);
    if (features.length) { // A feature was clicked. It can only be from trackList, as it's de only interactiveLayer.
      // Build a proper ScopeFeature from the information we obtained on the onClick event.
      const {id, ...properties} = features[0].properties;
      const scopeFeature = {
        type: 'Feature',
        id,
        properties,
        geometry: features[0].geometry
      } as ScopeTrack;
      selectTrack(scopeFeature);
    }
  }, [isSearchBoxHidden, isFabHidden, selectTrack]);

  const handleDoubleClick = useCallback((e: MapLayerMouseEvent) => {
    onLongTap([e.lngLat.lng, e.lngLat.lat]);
  }, [onLongTap]);

  const handlePointNavigationFitBounds = useCallback((bottomMargin = 0) => {
    fitBounds(pointNavigation.getBounds(), bottomMargin);
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
      handlePointNavigationFitBounds(POINT_NAVIGATION_BOTTOM_SHEET_HEIGHT);
    } else {
      setBottomMargin(0);
    }
  }, [pointNavigation.isNavigating, trackNavigation.stop]);

  const handlePointNavigationShowDetails = useCallback(() => {
    if (pointNavigation.target) {
      onPointSelected(pointNavigation.target.id);
    }
  }, [pointNavigation.target, onPointSelected]);

  const handleTrackNavigationFitBounds = useCallback((bottomMargin = 0) => {
    fitBounds(trackNavigation.getBounds(), bottomMargin);
  }, [fitBounds, trackNavigation.getBounds]);

  useEffect(() => {
    if (trackNavigation.isNavigating) {
      pointNavigation?.stop();
      setBottomMargin(TRACK_NAVIGATION_BOTTOM_SHEET_HEIGHT);
      handleTrackNavigationFitBounds(TRACK_NAVIGATION_BOTTOM_SHEET_HEIGHT);
    } else {
      setBottomMargin(0);
    }
  }, [trackNavigation.isNavigating, pointNavigation.stop]);

  const handleTrackNavigationShowDetails = useCallback(() => {
    if (trackNavigation.target) {
      onTrackSelected(trackNavigation.target.id);
    }
  }, [trackNavigation.target, onTrackSelected]);

  const [isSettingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);
  const [isAboutDialogOpen, setAboutDialogOpen] = useState<boolean>(false);

  const handleContextualMenu = useCallback((menuId: string) => {
    if (menuId === 'settings') {
      setSettingsDialogOpen(true);
    } else if (menuId === 'about') {
      setAboutDialogOpen(true);
    }
  }, []);

  const handleToggleContextualMenu = useCallback(() => {
    setContextualMenuOpen(prevValue => !prevValue);
  }, []);

  const handleResultClick = useCallback((result: ContextMapsResult) => {
    const coords = result.coordenades.split(',');
    if (result.origen === 'Nominatim') {
      coords.reverse();
    }
    setViewport({
      latitude: parseFloat(coords[1]),
      longitude: parseFloat(coords[0]),
      zoom: 14
    });
    onLocationStatusChanged(LOCATION_STATUS.NOT_TRACKING);
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

  const navigateToFeature = useMemo(() => {
    if (pointNavigation.isNavigating) return pointNavigation.navigateToFeature;
    if (trackNavigation.isNavigating) return trackNavigation.navigateToFeature;
  }, [pointNavigation.isNavigating, trackNavigation.isNavigating, pointNavigation.navigateToFeature, trackNavigation.navigateToFeature]);

  return <>
    {isActive && <SearchBoxAndMenu
      onContextualMenuClick={handleContextualMenu}
      isHidden={isSearchBoxHidden}
      isContextualMenuOpen={isContextualMenuOpen}
      onToggleContextualMenu={handleToggleContextualMenu}
      onResultClick={handleResultClick}
      isHeaderVisible={editingPosition.isEditing || recordingTrack.isRecording}
    />}
    {mapStyle && <MapComponent
      ref={mapRef}
      mapStyle={mapStyle}
      maxZoom={maxZoom}
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
      interactiveLayerIds={interactiveLayerIds}
    >
      {!editingPosition.isEditing && isActive && <FabButton
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
      <Overlays
        isActive={isActive}
        trackList={trackList}
        scopeColor={scopeColor}
        geolocation={geolocation}
        navigateToLine={navigateToFeature}
        gpsPositionColor={gpsPositionColor}/>
      {isActive && <LocationMarker geolocation={geolocation} heading={heading} color={gpsPositionColor}/>}
      <PointMarkers points={pointList} defaultColor={scopeColor} onClick={selectPoint}/>
    </MapComponent>}

    {editingPosition.isEditing && <PositionEditor
      name={selectedPoint?.properties.name}
      bottomMargin={bottomMargin}
      color={pointColor}
      onAccept={handleEditingPositionAccept}
      onCancel={handleEditingPositionCancel}
    />}
    {recordingTrack.isRecording && !editingPosition.isEditing && <TrackRecorder
      name={selectedTrack?.properties.name}
      bottomMargin={bottomMargin}
      color={trackColor}
      startTime={recordingTrack.startTime}
      onPause={recordingTrack.pause}
      onResume={recordingTrack.resume}
      onStop={handleRecordingTrackStop}
    />}
    {!!pointIntent && <ScopeSelector
      isLargeSize={isLargeSize}
      scopes={scopeList ?? []}
      onScopeSelected={handleScopeSelected}
      onCancel={handleScopeSelectionCancelled}
    />}
    {pointNavigation.target && <PointNavigationBottomSheet
      name={pointNavigation.target.name}
      color={pointNavigation.target.color}
      bearing={pointNavigation.navigateToFeature?.properties.bearing || 0}
      distance={pointNavigation.navigateToFeature?.properties.distance || 0}
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
    <GpsDisabledAlert
      isNavigatingToTrack={trackNavigation.target !== undefined}
      isNavigatingToPoint={pointNavigation.target !== undefined}
      isRecordingTrack={recordingTrack.isRecording}
      isGeolocationAvailable={geolocation.latitude !== null && geolocation.longitude !== null}
    />
    {isSettingsDialogOpen && <SettingsView
      onClose={() => setSettingsDialogOpen(false)}
    />}
    {isAboutDialogOpen && <AboutDialog
      onClose={() => setAboutDialogOpen(false)}
    />}
  </>;
};
export default React.memo(MapView);
