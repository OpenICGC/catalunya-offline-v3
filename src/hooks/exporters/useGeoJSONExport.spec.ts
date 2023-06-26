import {expect} from 'chai';
import {useGeoJSONExport} from './useGeoJSONExport';
import {act, renderHook} from '@testing-library/react-hooks/dom';
import {useScopePoints, useScopes, useScopeTracks} from '../usePersistedCollections';
import {Scope, ScopePoint, ScopeTrack} from '../../types/commonTypes';

const scope: Scope = {
  id: '4f9ccab4-1e64-4c2e-9604-c8b0b09a50e8',
  name: 'Scope 1',
  color: '#973572',
  schema: [{
    id: 'd887a030-3881-4d4d-8c11-e11f3c2305c4',
    name: 'Point Custom Field',
    appliesToPoints: true,
    appliesToTracks: false
  },{
    id: '08654537-c986-4f05-8cf7-b6cc045a35e3',
    name: 'Track Custom Field',
    appliesToPoints: false,
    appliesToTracks: true
  }]
};

const points: ScopePoint[] = [
  {
    type: 'Feature',
    id: '35fdf931-0f73-4189-8b99-1e801fbf8695',
    properties: {
      name: 'Point 1',
      timestamp: 1673876171254,
      description: '',
      images: ['myPath/image1Point1.jpg', 'myPath/image2Point1.jpg' ],
      isVisible: true
    },
    geometry: {
      type: 'Point',
      coordinates: [0, 0]
    },
    schemaValues: {
      'd887a030-3881-4d4d-8c11-e11f3c2305c4': 'Point Value 1'
    }
  },
  {
    type: 'Feature',
    id: 'd449f479-1c92-48f6-aa11-c018fb4c26a6',
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
    },
    schemaValues: {
      'd887a030-3881-4d4d-8c11-e11f3c2305c4': 'Point Value 2'
    }
  }
];

const tracks: ScopeTrack[] = [
  {
    type: 'Feature',
    id: '373e0907-b84e-4455-a1ac-0812d9be5a4e',
    properties: {
      name: 'Track 1',
      timestamp: 1673876115769,
      description: '',
      images: ['myPath/imageTrack1.jpg'],
      isVisible: true
    },
    geometry: {
      type: 'LineString',
      coordinates: [[0, 0], [1, 1]]
    },
    schemaValues: {
      '08654537-c986-4f05-8cf7-b6cc045a35e3': 'Track Value 1'
    }
  },
  {
    type: 'Feature',
    id: 'bf3b2036-09cd-415f-ad10-d4af159d09bd',
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
    },
    schemaValues: {
      '08654537-c986-4f05-8cf7-b6cc045a35e3': 'Track Value 2'
    }
  }
];

const expectedPoints = [{
  type: 'Feature',
  id: '35fdf931-0f73-4189-8b99-1e801fbf8695',
  geometry: {
    type: 'Point',
    coordinates: [0, 0]
  },
  properties: {
    name: 'Point 1',
    timestamp: 1673876171254,
    description: '',
    images: [
      'files/image1Point1.jpg',
      'files/image2Point1.jpg'
    ],
    isVisible: true,
    'Point Custom Field': 'Point Value 1',
    formattedDate: new Date(1673876171254).toLocaleString()
  }
}, {
  type: 'Feature',
  id: 'd449f479-1c92-48f6-aa11-c018fb4c26a6',
  geometry: {
    type: 'Point',
    coordinates: [1, 1]
  },
  properties: {
    name: 'Point 2',
    timestamp: 1673876171245,
    description: '',
    images: [],
    isVisible: false,
    'Point Custom Field': 'Point Value 2',
    formattedDate: new Date(1673876171245).toLocaleString()
  }
}];

const expectedTracks = [{
  type: 'Feature',
  id: '373e0907-b84e-4455-a1ac-0812d9be5a4e',
  geometry: {
    type: 'LineString',
    coordinates: [[0, 0], [1, 1]]
  },
  properties: {
    name: 'Track 1',
    timestamp: 1673876115769,
    description: '',
    images: ['files/imageTrack1.jpg'],
    isVisible: true,
    'Track Custom Field': 'Track Value 1',
    formattedDate: new Date(1673876115769).toLocaleString()
  }
}, {
  type: 'Feature',
  id: 'bf3b2036-09cd-415f-ad10-d4af159d09bd',
  geometry: {
    type: 'LineString',
    coordinates: [[2, 2], [3, 3]]
  },
  properties: {
    name: 'Track 2',
    timestamp: 1673876115785,
    description: '',
    images: [],
    isVisible: true,
    'Track Custom Field': 'Track Value 2',
    formattedDate: new Date(1673876115785).toLocaleString()
  }
}];

describe('useGeoJSONExport', () => {
  it('should generate a valid GeoJSON from scope.id', async () => {

    // GIVEN
    const scopesHook = renderHook(() => useScopes());
    await scopesHook.waitForValueToChange(() => scopesHook.result.current.list() !== undefined);
    const scopePointsHook = renderHook(() => useScopePoints(scope.id));
    await scopePointsHook.waitForValueToChange(() => scopePointsHook.result.current.list() !== undefined);
    const scopeTracksHook = renderHook(() => useScopeTracks(scope.id));
    await scopeTracksHook.waitForValueToChange(() => scopeTracksHook.result.current.list() !== undefined);
    const geoJSONExportHook = renderHook(() => useGeoJSONExport(scope.id));

    // WHEN
    act(() => scopesHook.result.current.create(scope));
    for (const point of points) {
      act(() => scopePointsHook.result.current.create(point));
    }
    for (const track of tracks) {
      act(() => scopeTracksHook.result.current.create(track));
    }

    // THEN
    expect(geoJSONExportHook.result.current).to.deep.equal({
      type: 'FeatureCollection',
      features: [
        ...expectedTracks,
        ...expectedPoints
      ]
    });

    // CLEAN
    act(() => scopesHook.result.current.delete(scope.id));
  });

  it('should generate a valid GeoJSON from trackId', async () => {
    // GIVEN
    const scopesHook = renderHook(() => useScopes());
    await scopesHook.waitForValueToChange(() => scopesHook.result.current.list() !== undefined);
    const scopePointsHook = renderHook(() => useScopePoints(scope.id));
    await scopePointsHook.waitForValueToChange(() => scopePointsHook.result.current.list() !== undefined);
    const scopeTracksHook = renderHook(() => useScopeTracks(scope.id));
    await scopeTracksHook.waitForValueToChange(() => scopeTracksHook.result.current.list() !== undefined);
    const geoJSONExportHook = renderHook(() => useGeoJSONExport(scope.id, '373e0907-b84e-4455-a1ac-0812d9be5a4e'));

    // WHEN
    act(() => scopesHook.result.current.create(scope));
    for (const point of points) {
      act(() => scopePointsHook.result.current.create(point));
    }
    for (const track of tracks) {
      act(() => scopeTracksHook.result.current.create(track));
    }

    // THEN
    expect(geoJSONExportHook.result.current).to.deep.equal({
      type: 'FeatureCollection',
      features: [
        expectedTracks[0]
      ]
    });

    // CLEAN
    act(() => scopesHook.result.current.delete(scope.id));
  });

  it('should generate a valid GeoJSON from trackId and visiblePoints', async () => {
    // GIVEN
    const scopesHook = renderHook(() => useScopes());
    await scopesHook.waitForValueToChange(() => scopesHook.result.current.list() !== undefined);
    const scopePointsHook = renderHook(() => useScopePoints(scope.id));
    await scopePointsHook.waitForValueToChange(() => scopePointsHook.result.current.list() !== undefined);
    const scopeTracksHook = renderHook(() => useScopeTracks(scope.id));
    await scopeTracksHook.waitForValueToChange(() => scopeTracksHook.result.current.list() !== undefined);
    const geoJSONExportHook = renderHook(() => useGeoJSONExport(scope.id, '373e0907-b84e-4455-a1ac-0812d9be5a4e', true));

    // WHEN
    act(() => scopesHook.result.current.create(scope));
    for (const point of points) {
      act(() => scopePointsHook.result.current.create(point));
    }
    for (const track of tracks) {
      act(() => scopeTracksHook.result.current.create(track));
    }

    // THEN
    expect(geoJSONExportHook.result.current).to.deep.equal({
      type: 'FeatureCollection',
      features: [
        expectedTracks[0],
        expectedPoints[0]
      ]
    });

    // CLEAN
    act(() => scopesHook.result.current.delete(scope.id));
  });
});
