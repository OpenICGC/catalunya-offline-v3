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
import {MapboxStyle, MapRef} from 'react-map-gl';
import {mbtiles} from '../utils/mbtiles';
import {DEFAULT_VIEWPORT, MAP_PROPS, MIN_TRACKING_ZOOM} from '../config';
import {useScopePoints, useScopes, useScopeTracks} from '../hooks/useStoredCollections';
import {AnyLayer, MapLayerMouseEvent, MapTouchEvent, Sources} from 'mapbox-gl';
import {Feature, Position} from 'geojson';
import {v4 as uuid} from 'uuid';
import {useTranslation} from 'react-i18next';
import {useViewport} from '../hooks/useViewport';
import useEditingPosition from '../hooks/useEditingPosition';
import useCompass from '../hooks/useCompass';
import useGeolocation from '../hooks/useGeolocation';
import usePointNavigation from '../hooks/usePointNavigation';
import useRecordingTrack from '../hooks/useRecordingTrack';
import useTrackNavigation from '../hooks/useTrackNavigation';
import {Manager, ScopePoint, UUID} from '../types/commonTypes';
import useGpsPositionColor from '../hooks/settings/useGpsPositionColor';
import useIsLargeSize from '../hooks/settings/useIsLargeSize';
/*import {useStatus} from '@capacitor-community/network-react';*/

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
  visibleLayers: Array<number>,
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
  visibleLayers
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

  const [bottomMargin, setBottomMargin] = useState(0);
  const [topMargin, setTopMargin] = useState(SEARCHBOX_HEIGHT);
  const [fitBounds, setFitBounds] = useState<[number, number, number, number]>();

  const toggleFabOpen = () => setFabOpen(prevState => !prevState);

  const [isLargeSize] = useIsLargeSize();
  const [gpsPositionColor] = useGpsPositionColor();

  const sources: Sources = useMemo(() => {
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
      },
      'trackList': {
        type: 'geojson',
        data: {
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
          }) as Feature)
        }
      },
      'extraLayers': {
        type: 'geojson',
        data: 'extra-layers.json'
      }
    };
  }, [geolocation, recordingTrack.coordinates, pointNavigation.feature, trackList]);

  const layers: Array<AnyLayer> = useMemo(() => {
    return [{
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
    }];
  }, [gpsPositionColor, visibleLayers]);

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

  const handlePointNavigationStop = () => {
    pointNavigation.stop();
    setBottomMargin(0);
  };

  const handlePointNavigationFitBounds = () => {
    setFitBounds(pointNavigation.getBounds());
  };

  useEffect(() => {
    if(recordingTrack.isRecording){
      setTopMargin(SEARCHBOX_HEIGHT + HEADER_HEIGHT);
    } else {
      setTopMargin(SEARCHBOX_HEIGHT);
    }
  }, [recordingTrack.isRecording]);

  useEffect(() => {
    if (pointNavigation.target) {
      setBottomMargin(POINT_NAVIGATION_BOTTOM_SHEET_HEIGHT);
      setFitBounds(pointNavigation.getBounds());
    }
  }, [pointNavigation.target]);

  const handlePointNavigationShowDetails = () => pointNavigation.target && onShowPointDetails(pointNavigation.target.id);
  const handleTrackNavigationStop = () => {
    trackNavigation.stop();
    setBottomMargin(0);
  };

  const handleTrackNavigationFitBounds = () => {
    setFitBounds(trackNavigation.getBounds());
  };

  useEffect(() => {
    if (trackNavigation.target) {
      setBottomMargin(TRACK_NAVIGATION_BOTTOM_SHEET_HEIGHT);
      setFitBounds(trackNavigation.getBounds());
    }
  }, [trackNavigation.target]);

  useEffect(() => {
    if (fitBounds !== undefined) {
      mapRef.current?.fitBounds(fitBounds, {padding: {top: 50 + topMargin, bottom: 50 + bottomMargin, left: 50, right: 50}});
      setFitBounds(undefined);
    }
  }, [fitBounds]);

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
      onStop={handlePointNavigationStop}
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
      onStop={handleTrackNavigationStop}
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
