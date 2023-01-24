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
  const scopeId = uuidv4();
  it('useGeoJSONExport should generate a valid GeoJSON from scopeId', () => {

    // GIVEN
    const sampleScope = scope;
    const samplePoints = points;
    const sampleTracks = tracks;
    
    const resultScope = renderHook(() => useScopes());
    const resultPoint = renderHook(() => useScopePoints(scopeId));
    const resultTrack = renderHook(() => useScopeTracks(scopeId));

    // WHEN
    act(() => resultScope.result.current.create(sampleScope));
    samplePoints.map(point => act(() => resultPoint.result.current.create(point)));
    sampleTracks.map(track => act(() => resultTrack.result.current.create(track)));

    const computedGeoJSON = renderHook(() => useGeoJSONExport(scopeId));

    // THEN
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    const expectedGeoJSON = {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [0, 0]
          },
          'properties': {
            'description': '',
            'images': [],
            'isVisible': true,
            'name': 'Point 1',
            'timestamp': 1673876171254,
          }
        },
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [1, 1]
          },
          'properties': {
            'description': '',
            'images': [],
            'isVisible': false,
            'name': 'Point 2',
            'timestamp': 1673876171245,
          }
        },
        {
          'type': 'Feature',
          'geometry': {
            type: 'LineString',
            coordinates: [[0, 0], [1, 1]]
          },
          'properties': {
            'description': '',
            'images': [],
            'isVisible': true,
            'name': 'Track 1',
            'timestamp': 1673876115769
          }
        },
        {
          'type': 'Feature',
          'geometry': {
            type: 'LineString',
            coordinates: [[2, 2], [3, 3]]
          },
          'properties': {
            'description': '',
            'images': [],
            'isVisible': true,
            'name': 'Track 2',
            'timestamp': 1673876115785
          }
        }
      ]
    };
    expect(computedGeoJSON.result.all[0]).to.deep.equal(expectedGeoJSON);

    // WHEN
    act(() => resultScope.result.current.delete(sampleScope.id));
    samplePoints.map(point => act(() => resultPoint.result.current.delete(point.id)));
    sampleTracks.map(track => act(() => resultTrack.result.current.delete(track.id)));

    // THEN
    expect(resultScope.result.current.list()).to.deep.equal([]);
    expect(localStorage.getItem('scopes')).to.deep.equal(JSON.stringify([]));
    expect(localStorage.getItem(`scopes/${scopeId}/points`)).to.deep.equal(JSON.stringify([]));
    expect(localStorage.getItem(`scopes/${scopeId}/tracks`)).to.deep.equal(JSON.stringify([]));
  });

  it('useGeoJSONExport should generate a valid GeoJSON from trackId', () => {

    // GIVEN
    const sampleScope = scope;
    const samplePoints = points;
    const sampleTracks = tracks;

    const resultScope = renderHook(() => useScopes());
    const resultPoint = renderHook(() => useScopePoints(scopeId));
    const resultTrack = renderHook(() => useScopeTracks(scopeId));

    // WHEN
    act(() => resultScope.result.current.create(sampleScope));
    samplePoints.map(point => act(() => resultPoint.result.current.create(point)));
    sampleTracks.map(track => act(() => resultTrack.result.current.create(track)));

    const computedGeoJSON = renderHook(() => useGeoJSONExport(scopeId, '3578a'));

    // THEN
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    const expectedGeoJSON = {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            type: 'LineString',
            coordinates: [[0, 0], [1, 1]]
          },
          'properties': {
            'description': '',
            'images': [],
            'isVisible': true,
            'name': 'Track 1',
            'timestamp': 1673876115769
          }
        }
      ]
    };
    expect(computedGeoJSON.result.all[0]).to.deep.equal(expectedGeoJSON);

    // WHEN
    act(() => resultScope.result.current.delete(sampleScope.id));
    samplePoints.map(point => act(() => resultPoint.result.current.delete(point.id)));
    sampleTracks.map(track => act(() => resultTrack.result.current.delete(track.id)));

    // THEN
    expect(resultScope.result.current.list()).to.deep.equal([]);
    expect(localStorage.getItem('scopes')).to.deep.equal(JSON.stringify([]));
    expect(localStorage.getItem(`scopes/${scopeId}/points`)).to.deep.equal(JSON.stringify([]));
    expect(localStorage.getItem(`scopes/${scopeId}/tracks`)).to.deep.equal(JSON.stringify([]));

  });

  it('useGeoJSONExport should generate a valid GeoJSON from trackId and visiblePoints', () => {

    // GIVEN
    const sampleScope = scope;
    const samplePoints = points;
    const sampleTracks = tracks;

    const resultScope = renderHook(() => useScopes());
    const resultPoint = renderHook(() => useScopePoints(scopeId));
    const resultTrack = renderHook(() => useScopeTracks(scopeId));

    // WHEN
    act(() => resultScope.result.current.create(sampleScope));
    samplePoints.map(point => act(() => resultPoint.result.current.create(point)));
    sampleTracks.map(track => act(() => resultTrack.result.current.create(track)));

    const computedGeoJSON = renderHook(() => useGeoJSONExport(scopeId, '3578a', true));

    // THEN
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    const expectedGeoJSON = {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': [[0, 0], [1, 1]]
          },
          'properties': {
            'description': '',
            'images': [],
            'isVisible': true,
            'name': 'Track 1',
            'timestamp': 1673876115769
          }
        },
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [0, 0]
          },
          'properties': {
            'name': 'Point 1',
            'timestamp': 1673876171254,
            'description': '',
            'images': [],
            'isVisible': true
          },
          
        }
      ]
    };
    expect(computedGeoJSON.result.all[0]).to.deep.equal(expectedGeoJSON);
    
    // WHEN
    act(() => resultScope.result.current.delete(sampleScope.id));
    samplePoints.map(point => act(() => resultPoint.result.current.delete(point.id)));
    sampleTracks.map(track => act(() => resultTrack.result.current.delete(track.id)));

    // THEN
    expect(resultScope.result.current.list()).to.deep.equal([]);
    expect(localStorage.getItem('scopes')).to.deep.equal(JSON.stringify([]));
    expect(localStorage.getItem(`scopes/${scopeId}/points`)).to.deep.equal(JSON.stringify([]));
    expect(localStorage.getItem(`scopes/${scopeId}/tracks`)).to.deep.equal(JSON.stringify([]));
    
  });

});