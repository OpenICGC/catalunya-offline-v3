import {useEffect, useState} from 'react';
import {Position} from 'geojson';
import {singletonHook} from 'react-singleton-hook';
import {Scope, ScopePoint, UUID} from '../types/commonTypes';
import useGeolocation from './useGeolocation';
import {useScopePoints, useScopes} from './useStoredCollections';
import navigateToPointFeature from '../utils/navigateToPointFeature';

type startFn = (scopeId: UUID, scopePointId: UUID) => void;

type navigationState = {
  scopeId?: UUID,
  scopePointId?: UUID
}

const initialState: navigationState = {
  scopeId: undefined,
  scopePointId: undefined
};

const usePointNavigationImpl = () => {
  const [state, setState] = useState<navigationState>(initialState);
  const scopeStore = useScopes();
  const pointStore = useScopePoints(state.scopeId);
  const {geolocation} = useGeolocation(false);

  const scope: Scope | undefined = state.scopeId ? scopeStore.retrieve(state.scopeId) : undefined;
  const scopePoint: ScopePoint | undefined = state.scopePointId ? pointStore.retrieve(state.scopePointId) : undefined;

  const fromPosition: Position | undefined = geolocation && geolocation.longitude && geolocation.latitude ? [geolocation.longitude, geolocation.latitude] : undefined;
  const toPosition: Position | undefined = scopePoint?.geometry.coordinates;

  const isNavigating: boolean = fromPosition != undefined && toPosition != undefined;

  const feature = fromPosition && toPosition ? navigateToPointFeature(fromPosition, toPosition) : undefined;

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

  const target = scopePoint ? {
    id: scopePoint.id,
    name: scopePoint.properties.name,
    color: scopePoint.properties.color || scope?.color || '#000000'
  } : undefined;

  const start: startFn = (scopeId, scopePointId) => {
    setState({scopeId, scopePointId});
  };

  const stop = () => {
    setState(initialState);
  };

  const getBounds = (): [number, number, number, number] | undefined => fromPosition && toPosition ?
    [
      Math.min(fromPosition[0], toPosition[0]), // xMin
      Math.min(fromPosition[1], toPosition[1]), // yMin
      Math.max(fromPosition[0], toPosition[0]), // xMax
      Math.max(fromPosition[1], toPosition[1])  // yMax
    ] : undefined;

  return {
    isNavigating,
    target,
    feature,
    start,
    stop,
    getBounds
  };
};

const trivialImpl = () => ({
  isNavigating: false,
  target: undefined,
  feature: undefined,
  start: () => undefined,
  stop: () => undefined,
  getBounds: () => undefined
});

const usePointNavigation = singletonHook(trivialImpl, usePointNavigationImpl);

export default usePointNavigation;
