import {expect} from 'chai';
import {useKmlExport} from './useKmlExport';
import {act, renderHook} from '@testing-library/react-hooks/dom';
import {useScopePoints, useScopes, useScopeTracks} from '../usePersistedCollections';
import {Scope, ScopePoint, ScopeTrack} from '../../types/commonTypes';
import kmlSample_01 from './fixtures/sample_01.kml';
import kmlSample_02 from './fixtures/sample_02.kml';

const scope: Scope = {
  id: '9c3981d3-8ca5-4b7b-a3bc-a949761591ab',
  name: 'Scope 1',
  color: '#fabada'
};

const points: ScopePoint[] = [
  {
    type: 'Feature',
    id: '874bf4f0-4a3f-4c75-972f-fb9b8ac4a596',
    properties: {
      name: 'Point 1',
      color: '#973572',
      timestamp: 1673876171254,
      description: 'Point 1 description',
      images: ['myPath/image1Point1.jpg', 'myPath/image2Point1.jpg' ],
      isVisible: true
    },
    geometry: {
      type: 'Point',
      coordinates: [-3.698005,40.402501,0]
    }
  },
  {
    type: 'Feature',
    id: '35de56eb-7c9d-405d-8d6c-147e083cb6bf',
    properties: {
      name: 'Point 2',
      color: '#973572',
      timestamp: 1673876171254,
      description: 'Point 2 description',
      images: [],
      isVisible: true
    },
    geometry: {
      type: 'Point',
      coordinates: [-3.698864176137905,40.40192130721456,0]
    }
  }
];

const tracks: ScopeTrack[] = [
  {
    type: 'Feature',
    id: 'e73af4f0-4a3f-4c75-972f-fb9b8ac4a596',
    properties: {
      name: 'Track 1',
      color: '#973572',
      timestamp: 1673876115769,
      description: 'Track 1 description',
      images: ['myPath/imageTrack1.jpg'],
      isVisible: true
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [-3.698053272441833,40.40243085733725,0,1674736045],
        [-3.697723976621552,40.40272136663401,0,1674736058],
        [-3.695985219357802,40.40257933830212,0,1674736070],
        [-3.696128879062175,40.40098962237379,0,1674736079],
        [-3.698789629333535,40.40101458330396,0,1674736085],
        [-3.699582462026573,40.40127776668836,0,1674736185]
      ]
    }
  }
];

const pointsWithoutElevation: ScopePoint[] = [
  {
    type: 'Feature',
    id: '874bf4f0-4a3f-4c75-972f-fb9b8ac4a596',
    properties: {
      name: 'Point 1',
      timestamp: 1673876171254,
      description: 'Point 1 description',
      images: ['myPath/mySubPath/image1Point1.jpg', 'myPath/mySubPath/image2Point1.jpg' ],
      isVisible: true
    },
    geometry: {
      type: 'Point',
      coordinates: [-3.698005,40.402501]
    }
  },
  {
    type: 'Feature',
    id: '35de56eb-7c9d-405d-8d6c-147e083cb6bf',
    properties: {
      name: 'Point 2',
      color: '#973572',
      timestamp: 1673876171254,
      description: 'Point 2 description',
      images: [],
      isVisible: true
    },
    geometry: {
      type: 'Point',
      coordinates: [-3.698864176137905,40.40192130721456]
    }
  }
];

const trackWithoutTimestampNorElevation: ScopeTrack[] = [
  {
    type: 'Feature',
    id: 'e73af4f0-4a3f-4c75-972f-fb9b8ac4a596',
    properties: {
      name: 'Track 1',
      color: '#973572',
      timestamp: 1673876115769,
      description: 'Track 1 description',
      images: ['myPath/imageTrack1.jpg'],
      isVisible: true
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [-3.698053272441833,40.40243085733725],
        [-3.697723976621552,40.40272136663401],
        [-3.695985219357802,40.40257933830212],
        [-3.696128879062175,40.40098962237379],
        [-3.698789629333535,40.40101458330396],
        [-3.699582462026573,40.40127776668836]
      ]
    }
  }
];

const trackWithoutTimestamp: ScopeTrack[] = [
  {
    type: 'Feature',
    id: 'e73af4f0-4a3f-4c75-972f-fb9b8ac4a596',
    properties: {
      name: 'Track 1',
      color: '#973572',
      timestamp: 1673876115769,
      description: 'Track 1 description',
      images: ['myPath/imageTrack1.jpg'],
      isVisible: true
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [-3.698053272441833,40.40243085733725,0],
        [-3.697723976621552,40.40272136663401,0],
        [-3.695985219357802,40.40257933830212,0],
        [-3.696128879062175,40.40098962237379,0],
        [-3.698789629333535,40.40101458330396,0],
        [-3.699582462026573,40.40127776668836,0]
      ]
    }
  }
];

describe('useKmlExport', () => {
  it('should generate a valid KML from scopeId (tracks with lon,lat,ele,timestamp, points with lon,lat,ele)', async () => {
    // GIVEN
    const scopesHook = renderHook(() => useScopes());
    await scopesHook.waitForValueToChange(() => scopesHook.result.current.list() !== undefined);
    const scopePointsHook = renderHook(() => useScopePoints(scope.id));
    await scopePointsHook.waitForValueToChange(() => scopePointsHook.result.current.list() !== undefined);
    const scopeTracksHook = renderHook(() => useScopeTracks(scope.id));
    await scopeTracksHook.waitForValueToChange(() => scopeTracksHook.result.current.list() !== undefined);
    const kmlExportHook = renderHook(() => useKmlExport(scope.id));

    // WHEN
    act(() => scopesHook.result.current.create(scope));
    for (const point of points) {
      act(() => scopePointsHook.result.current.create(point));
    }
    for (const track of tracks) {
      act(() => scopeTracksHook.result.current.create(track));
    }

    // THEN
    expect(kmlExportHook.result.current).to.deep.equal(kmlSample_01);

    //CLEAN
    act(() => scopesHook.result.current.delete(scope.id));
  });

  it('should generate a valid KML from scopeId (tracks with lon,lat,ele, points with lon,lat,ele)', async () => {
    // GIVEN
    const scopesHook = renderHook(() => useScopes());
    await scopesHook.waitForValueToChange(() => scopesHook.result.current.list() !== undefined);
    const scopePointsHook = renderHook(() => useScopePoints(scope.id));
    await scopePointsHook.waitForValueToChange(() => scopePointsHook.result.current.list() !== undefined);
    const scopeTracksHook = renderHook(() => useScopeTracks(scope.id));
    await scopeTracksHook.waitForValueToChange(() => scopeTracksHook.result.current.list() !== undefined);
    const kmlExportHook = renderHook(() => useKmlExport(scope.id));

    // WHEN
    act(() => scopesHook.result.current.create(scope));
    for (const point of points) {
      act(() => scopePointsHook.result.current.create(point));
    }
    for (const track of trackWithoutTimestamp) {
      act(() => scopeTracksHook.result.current.create(track));
    }

    // THEN
    expect(kmlExportHook.result.current).to.deep.equal(kmlSample_01);

    // CLEAN
    act(() => scopesHook.result.current.delete(scope.id));
  });

  it('should generate a valid KML from scopeId (tracks with lon,lat, points with lon,lat,ele)', async () => {
    // GIVEN
    const scopesHook = renderHook(() => useScopes());
    await scopesHook.waitForValueToChange(() => scopesHook.result.current.list() !== undefined);
    const scopePointsHook = renderHook(() => useScopePoints(scope.id));
    await scopePointsHook.waitForValueToChange(() => scopePointsHook.result.current.list() !== undefined);
    const scopeTracksHook = renderHook(() => useScopeTracks(scope.id));
    await scopeTracksHook.waitForValueToChange(() => scopeTracksHook.result.current.list() !== undefined);
    const kmlExportHook = renderHook(() => useKmlExport(scope.id));

    // WHEN
    act(() => scopesHook.result.current.create(scope));
    for (const point of points) {
      act(() => scopePointsHook.result.current.create(point));
    }
    for (const track of trackWithoutTimestampNorElevation) {
      act(() => scopeTracksHook.result.current.create(track));
    }

    // THEN
    expect(kmlExportHook.result.current).to.deep.equal(kmlSample_01);

    // CLEAN
    act(() => scopesHook.result.current.delete(scope.id));
  });

  it('should generate a valid KML from scopeId (points with lon,lat, tracks with lon,lat)', async () => {
    // GIVEN
    const scopesHook = renderHook(() => useScopes());
    await scopesHook.waitForValueToChange(() => scopesHook.result.current.list() !== undefined);
    const scopePointsHook = renderHook(() => useScopePoints(scope.id));
    await scopePointsHook.waitForValueToChange(() => scopePointsHook.result.current.list() !== undefined);
    const scopeTracksHook = renderHook(() => useScopeTracks(scope.id));
    await scopeTracksHook.waitForValueToChange(() => scopeTracksHook.result.current.list() !== undefined);
    const kmlExportHook = renderHook(() => useKmlExport(scope.id));

    // WHEN
    act(() => scopesHook.result.current.create(scope));
    for (const point of pointsWithoutElevation) {
      act(() => scopePointsHook.result.current.create(point));
    }
    for (const track of trackWithoutTimestamp) {
      act(() => scopeTracksHook.result.current.create(track));
    }

    // THEN
    expect(kmlExportHook.result.current).to.deep.equal(kmlSample_02);

    // CLEAN
    act(() => scopesHook.result.current.delete(scope.id));
  });
});
