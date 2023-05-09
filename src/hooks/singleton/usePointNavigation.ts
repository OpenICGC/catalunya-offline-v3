import {useCallback, useEffect, useMemo, useState} from 'react';
import {Feature, LineString, Position} from 'geojson';
import {singletonHook} from 'react-singleton-hook';
import {HEXColor, Scope, ScopePoint, UUID} from '../../types/commonTypes';
import useGeolocation from './useGeolocation';
import {useScopePoints, useScopes} from '../usePersistedCollections';
import navigateToPointFeature from '../../utils/navigateToPointFeature';

type startFn = (scopeId: UUID, scopePointId: UUID) => void;

type navigationState = {
  scopeId?: UUID,
  scopePointId?: UUID
}

const initialNavigationState = {
  scopeId: undefined,
  scopePointId: undefined
};

type usePointNavigationType = {
  isNavigating: boolean,
  target: {
    id: string,
    name: string,
    color: HEXColor
  } | undefined,
  feature: Feature<LineString, {
    bearing: number,
    distance: number
  }> | undefined,
  start: startFn,
  stop: () => void,
  getBounds: () => [number, number, number, number] | undefined
}

const usePointNavigation = (): usePointNavigationType => {
  const [state, setState] = useState<navigationState>(initialNavigationState);
  const scopeStore = useScopes();
  const pointStore = useScopePoints(state.scopeId);
  const {geolocation} = useGeolocation();

  const scope: Scope | undefined = state.scopeId ? scopeStore.retrieve(state.scopeId) : undefined;
  const scopePoint: ScopePoint | undefined = state.scopePointId ? pointStore.retrieve(state.scopePointId) : undefined;

  const fromPosition: Position | undefined = useMemo(() =>
    state.scopeId && state.scopePointId && geolocation && geolocation.longitude && geolocation.latitude ? [geolocation.longitude, geolocation.latitude] : undefined
  , [state.scopeId, state.scopePointId, geolocation.longitude, geolocation.latitude]);

  const toPosition: Position | undefined = scopePoint?.geometry.coordinates;

  const isNavigating: boolean = fromPosition != undefined && toPosition != undefined;

  const feature = useMemo(() => fromPosition && toPosition ? navigateToPointFeature(fromPosition, toPosition) : undefined, [fromPosition, toPosition]);

  useEffect(() => {
    if (scopePoint && !scopePoint.properties.isVisible) {
      pointStore.update({
        ...scopePoint,
        properties: {
          ...scopePoint.properties,
          isVisible: true
        }
      });
    }
  }, [scopePoint]);

  const target = useMemo(() => scopePoint ? {
    id: scopePoint.id,
    name: scopePoint.properties.name,
    color: scopePoint.properties.color || scope?.color || '#000000'
  } : undefined, [scopePoint, scope?.color]);

  const start: startFn = useCallback((scopeId, scopePointId) => {
    setState({scopeId, scopePointId});
  }, []);

  const stop = useCallback(() => {
    setState(initialNavigationState);
  }, []);

  const getBounds = useCallback((): [number, number, number, number] | undefined => fromPosition && toPosition ?
    [
      Math.min(fromPosition ? fromPosition[0] : toPosition[0], toPosition[0]), // xMin
      Math.min(fromPosition ? fromPosition[1] : toPosition[1], toPosition[1]), // yMin
      Math.max(fromPosition ? fromPosition[0] : toPosition[0], toPosition[0]), // xMax
      Math.max(fromPosition ? fromPosition[1] : toPosition[1], toPosition[1])  // yMax
    ] : undefined
  , [fromPosition, toPosition]);

  return {
    isNavigating,
    target,
    feature,
    start,
    stop,
    getBounds
  };
};

const initialState: usePointNavigationType = {
  isNavigating: false,
  target: undefined,
  feature: undefined,
  start: () => undefined,
  stop: () => undefined,
  getBounds: () => undefined
};

export default singletonHook<usePointNavigationType>(initialState, usePointNavigation);
