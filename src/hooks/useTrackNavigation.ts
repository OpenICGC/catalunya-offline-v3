import {useState} from 'react';
import {Position, LineString} from 'geojson';
import {singletonHook} from 'react-singleton-hook';
import {Scope, ScopeTrack, UUID} from '../types/commonTypes';
import useGeolocation from './useGeolocation';
import {useScopes, useScopeTracks} from './useStoredCollections';
import turfNearestPointOnLine from '@turf/nearest-point-on-line';
import useTrackTolerance from './settings/useTrackTolerance';

type startFn = (scopeId: UUID, scopePointId: UUID) => void;

type navigationState = {
  scopeId?: UUID,
  scopeTrackId?: UUID
}

const initialState: navigationState = {
  scopeId: undefined,
  scopeTrackId: undefined
};

const useTrackNavigationImpl = () => {
  const [trackTolerance] = useTrackTolerance();
  const [state, setState] = useState<navigationState>(initialState);
  const scopeStore = useScopes();
  const trackStore = useScopeTracks(state.scopeId);
  const {geolocation} = useGeolocation(false);
  const [isReverseDirection, setReverseDirection] = useState<boolean>(false);
  const toggleReverseDirection = () => setReverseDirection(prevValue => !prevValue);

  const scope: Scope | undefined = state.scopeId ? scopeStore.retrieve(state.scopeId) : undefined;
  const scopeTrack: ScopeTrack | undefined = state.scopeTrackId ? trackStore.retrieve(state.scopeTrackId) : undefined;

  const fromPosition: Position | undefined = geolocation && geolocation.longitude && geolocation.latitude ? [geolocation.longitude, geolocation.latitude] : undefined;
  const toTrack: LineString | undefined = scopeTrack?.geometry ?
    isReverseDirection ? {
      ...scopeTrack.geometry,
      coordinates: [...scopeTrack.geometry.coordinates].reverse()
    } : scopeTrack.geometry
    : undefined;

  const isNavigating: boolean = fromPosition != undefined && toTrack != undefined;

  const snappedFeature = fromPosition && toTrack ? turfNearestPointOnLine(toTrack, fromPosition, {units: 'kilometers'}) : undefined;
  const snappedDistance: number | undefined = snappedFeature?.properties.dist ? snappedFeature.properties.dist * 1000 : undefined;
  const currentPositionIndex: number | undefined = snappedFeature?.properties?.index;
  const isOutOfTrack: boolean = snappedDistance ? snappedDistance > trackTolerance : false;

  const target = scopeTrack && toTrack ? {
    id: scopeTrack.id,
    name: scopeTrack.properties.name,
    color: scopeTrack.properties.color || scope?.color || '#000000',
    coordinates: toTrack.coordinates
  } : undefined;

  const start: startFn = (scopeId, scopeTrackId) => {
    setState({scopeId, scopeTrackId});
  };

  const stop = () => {
    setState(initialState);
  };

  const getBounds = (): [number, number, number, number] | undefined => fromPosition && toTrack ?
    [fromPosition, ...toTrack.coordinates].reduce<[number, number, number, number]>((bbox, position) => ([
      Math.min(bbox[0], position[0]), // xMin
      Math.min(bbox[1], position[1]), // yMin
      Math.max(bbox[2], position[0]), // xMax
      Math.max(bbox[3], position[1])  // yMax
    ]), [180, 90, -180, -90])
    : undefined;

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

const trivialImpl = () => ({
  isNavigating: false,
  target: undefined,
  isOutOfTrack: false,
  currentPositionIndex: undefined,
  isReverseDirection: false,
  toggleReverseDirection: () => undefined,
  start: () => undefined,
  stop: () => undefined,
  getBounds: () => undefined
});

const useTrackNavigation = singletonHook(trivialImpl, useTrackNavigationImpl);

export default useTrackNavigation;
