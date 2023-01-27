import {expect} from 'chai';
import {useGeoJSONExport} from './useGeoJSONExport';
import {act, renderHook} from '@testing-library/react-hooks/dom';
import {useScopePoints, useScopes, useScopeTracks} from './useStoredCollections';
import {v4 as uuidv4} from 'uuid';
import {Scope, ScopePoint, ScopeTrack} from '../types/commonTypes';

const scopeId = uuidv4();

const scope: Scope = {
  id: scopeId,
  name: 'Scope 1',
  color: '#FABADA'
};
const points: ScopePoint[] = [
  {
    type: 'Feature',
    id: uuidv4(),
    properties: {
      name: 'Point 1',
      timestamp: 1673876171254,
      description: '',
      images: [],
      isVisible: true
    },
    geometry: {
      type: 'Point',
      coordinates: [0, 0]
    }
  },
  {
    type: 'Feature',
    id: uuidv4(),
    properties: {
      name: 'Point 2',
      timestamp: 1673876171245,
      description: '',
      images: [],
      isVisible: false
    },
    geometry: {
      type: 'Point',
      coordinates: [1, 1]
    }
  }
];
const tracks: ScopeTrack[] = [
  {
    type: 'Feature',
    id: '3578a',
    properties: {
      name: 'Track 1',
      timestamp: 1673876115769,
      description: '',
      images: [],
      isVisible: true
    },
    geometry: {
      type: 'LineString',
      coordinates: [[0, 0], [1, 1]]
    }
  },
  {
    type: 'Feature',
    id: '4585b',
    properties: {
      name: 'Track 2',
      timestamp: 1673876115785,
      description: '',
      images: [],
      isVisible: true
    },
    geometry: {
      type: 'LineString',
      coordinates: [[2, 2], [3, 3]]
    }
  }
];

describe('useGeoJSONExport', () => {
  // GIVEN
  const sampleScope = scope;
  const samplePoints = points;
  const sampleTracks = tracks;

  
  
  it('useGeoJSONExport should generate a valid GeoJSON from scopeId', async () => {

    // WHEN
    const resultScope = renderHook(() => useScopes());
    const resultPoint = renderHook(() => useScopePoints(scopeId));
    const resultTrack = renderHook(() => useScopeTracks(scopeId));
    
    act(() => resultScope.result.current.create(sampleScope));
    await resultScope.waitForNextUpdate();
    for (const point of samplePoints) {
      act(() => resultPoint.result.current.create(point));
      await resultPoint.waitForNextUpdate();
    }
    for (const track of sampleTracks) {
      act(() => resultTrack.result.current.create(track));
      await resultTrack.waitForNextUpdate();
    }

    const {result, waitForNextUpdate} = renderHook(() => useGeoJSONExport(scopeId));
    await waitForNextUpdate();

    // THEN
    const expectedGeoJSON = {
      'type': 'FeatureCollection',
      'features': [
        ...samplePoints,
        ...sampleTracks
      ]
    };
    expect(result.current).to.deep.equal(expectedGeoJSON);

    //CLEAN
    act(() => resultScope.result.current.delete(scopeId));
    await resultScope.waitForNextUpdate();
  });

  it('useGeoJSONExport should generate a valid GeoJSON from trackId', async () => {
    // WHEN
    const resultScope = renderHook(() => useScopes());
    const resultPoint = renderHook(() => useScopePoints(scopeId));
    const resultTrack = renderHook(() => useScopeTracks(scopeId));
    
    act(() => resultScope.result.current.create(sampleScope));
    await resultScope.waitForNextUpdate();
    for (const point of samplePoints) {
      act(() => resultPoint.result.current.create(point));
      await resultPoint.waitForNextUpdate();
    }
    for (const track of sampleTracks) {
      act(() => resultTrack.result.current.create(track));
      await resultTrack.waitForNextUpdate();
    }

    const {result, waitForNextUpdate} = renderHook(() => useGeoJSONExport(scopeId, '3578a'));
    await waitForNextUpdate();

    // THEN
    const expectedGeoJSON = {
      'type': 'FeatureCollection',
      'features': [
        sampleTracks[0]
      ]
    };
    expect(result.current).to.deep.equal(expectedGeoJSON);

    //CLEAN
    act(() => resultScope.result.current.delete(scopeId));
    await resultScope.waitForNextUpdate();
  });

  it('useGeoJSONExport should generate a valid GeoJSON from trackId and visiblePoints', async () => {
    // WHEN
    const resultScope = renderHook(() => useScopes());
    const resultPoint = renderHook(() => useScopePoints(scopeId));
    const resultTrack = renderHook(() => useScopeTracks(scopeId));
    
    act(() => resultScope.result.current.create(sampleScope));
    await resultScope.waitForNextUpdate();
    for (const point of samplePoints) {
      act(() => resultPoint.result.current.create(point));
      await resultPoint.waitForNextUpdate();
    }
    for (const track of sampleTracks) {
      act(() => resultTrack.result.current.create(track));
      await resultTrack.waitForNextUpdate();
    }

    const {result, waitForNextUpdate} = renderHook(() => useGeoJSONExport(scopeId, '3578a', true));
    await waitForNextUpdate();

    // THEN
    const expectedGeoJSON = {
      'type': 'FeatureCollection',
      'features': [
        sampleTracks[0],
        samplePoints[0]
      ]
    };
    expect(result.current).to.deep.equal(expectedGeoJSON);

    //CLEAN
    act(() => resultScope.result.current.delete(scopeId));
    await resultScope.waitForNextUpdate();
  });
});