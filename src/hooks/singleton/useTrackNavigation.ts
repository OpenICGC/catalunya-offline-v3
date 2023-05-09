import {useCallback, useEffect, useMemo, useState} from 'react';
import {Position, LineString} from 'geojson';
import {singletonHook} from 'react-singleton-hook';
import {HEXColor, Scope, ScopeTrack, UUID} from '../../types/commonTypes';
import useGeolocation from './useGeolocation';
import {useScopes, useScopeTracks} from '../usePersistedCollections';
import turfNearestPointOnLine from '@turf/nearest-point-on-line';
import useTrackTolerance from '../settings/useTrackTolerance';

type startFn = (scopeId: UUID, scopePointId: UUID) => void;

type navigationState = {
  scopeId?: UUID,
  scopeTrackId?: UUID
}

const initialNavigationState: navigationState = {
  scopeId: undefined,
  scopeTrackId: undefined
};

type useTrackNavigationType = {
  isNavigating: boolean,
  target: {
    id: string,
    name: string,
    color: HEXColor,
    coordinates: Array<Position>
  } | undefined,
  isOutOfTrack: boolean,
  currentPositionIndex: number | undefined,
  isReverseDirection: boolean,
  toggleReverseDirection: () => void,
  start: startFn,
  stop: () => void,
  getBounds: () => [number, number, number, number] | undefined
}

const useTrackNavigation = (): useTrackNavigationType => {
  const [trackTolerance] = useTrackTolerance();
  const [state, setState] = useState<navigationState>(initialNavigationState);
  const scopeStore = useScopes();
  const trackStore = useScopeTracks(state.scopeId);
  const {geolocation} = useGeolocation();
  const [isReverseDirection, setReverseDirection] = useState<boolean>(false);
  const toggleReverseDirection = useCallback(() => setReverseDirection(prevValue => !prevValue), []);

  const scope: Scope | undefined = state.scopeId ? scopeStore.retrieve(state.scopeId) : undefined;
  const scopeTrack: ScopeTrack | undefined = state.scopeTrackId ? trackStore.retrieve(state.scopeTrackId) : undefined;

  const fromPosition: Position | undefined = useMemo(() =>
    state.scopeId && state.scopeTrackId && geolocation && geolocation.longitude && geolocation.latitude ? [geolocation.longitude, geolocation.latitude] : undefined
  , [state.scopeId, state.scopeTrackId, geolocation.longitude, geolocation.latitude]);

  const toTrack: LineString | undefined = useMemo(() =>
    scopeTrack?.geometry ?
      isReverseDirection ? {
        ...scopeTrack.geometry,
        coordinates: [...scopeTrack.geometry.coordinates].reverse()
      } : scopeTrack.geometry
      : undefined
  ,[scopeTrack?.geometry, isReverseDirection]);

  const isNavigating: boolean = fromPosition != undefined && toTrack != undefined;

  const snappedFeature = useMemo(() =>
    fromPosition && toTrack ? turfNearestPointOnLine(toTrack, fromPosition, {units: 'kilometers'}) : undefined,
  [fromPosition, toTrack]);

  const snappedDistance: number | undefined = snappedFeature?.properties.dist ? snappedFeature.properties.dist * 1000 : undefined;
  const currentPositionIndex: number | undefined = snappedFeature?.properties?.index;
  const isOutOfTrack: boolean = snappedDistance ? snappedDistance > trackTolerance : false;

  useEffect(() => {
    if (scopeTrack && !scopeTrack.properties.isVisible) {
      trackStore.update({
        ...scopeTrack,
        properties: {
          ...scopeTrack.properties,
          isVisible: true
        }
      });
    }
  }, [scopeTrack]);

  const target = useMemo(() => scopeTrack && toTrack ? {
    id: scopeTrack.id,
    name: scopeTrack.properties.name,
    color: scopeTrack.properties.color || scope?.color || '#000000',
    coordinates: toTrack.coordinates
  } : undefined, [scopeTrack, toTrack?.coordinates, scope?.color]);

  const start: startFn = useCallback((scopeId, scopeTrackId) => {
    setState({scopeId, scopeTrackId});
  }, []);

  const stop = useCallback(() => {
    setState(initialNavigationState);
  }, []);

  const getBounds = useCallback((): [number, number, number, number] | undefined => toTrack ?
    [...(fromPosition && !isOutOfTrack ? [fromPosition] : []), ...toTrack.coordinates].reduce<[number, number, number, number]>((bbox, position) => ([
      Math.min(bbox[0], position[0]), // xMin
      Math.min(bbox[1], position[1]), // yMin
      Math.max(bbox[2], position[0]), // xMax
      Math.max(bbox[3], position[1])  // yMax
    ]), [180, 90, -180, -90])
    : undefined
  , [fromPosition, isOutOfTrack, toTrack?.coordinates]);

  return {
    isNavigating,
    target,
    isOutOfTrack,
    currentPositionIndex,
    isReverseDirection,
    toggleReverseDirection,
    start,
    stop,
    getBounds
  };
};

const initialState: useTrackNavigationType = {
  isNavigating: false,
  target: undefined,
  isOutOfTrack: false,
  currentPositionIndex: undefined,
  isReverseDirection: false,
  toggleReverseDirection: () => undefined,
  start: () => undefined,
  stop: () => undefined,
  getBounds: () => undefined
};

export default singletonHook<useTrackNavigationType>(initialState, useTrackNavigation);
