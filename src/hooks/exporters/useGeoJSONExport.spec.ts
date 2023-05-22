import {expect} from 'chai';
import {useGeoJSONExport} from './useGeoJSONExport';
import {act, renderHook} from '@testing-library/react-hooks/dom';
import {useScopePoints, useScopes, useScopeTracks} from '../usePersistedCollections';
import {v4 as uuidv4} from 'uuid';
import {Scope, ScopePoint, ScopeTrack} from '../../types/commonTypes';
import {getImageNameWithoutPath} from '../../utils/getImageNameWithoutPath';

const scope: Scope = {
  id: uuidv4(),
  name: 'Scope 1',
  color: '#973572'
};
const points: ScopePoint[] = [
  {
    type: 'Feature',
    id: uuidv4(),
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
      images: ['myPath/imageTrack1.jpg'],
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

const expectedPoints = points
  .map(point => ({
    ...point,
    properties: {
      ...point.properties,
      formattedDate: new Date(point.properties.timestamp).toLocaleString(),
      images: point.properties.images
        .map(image => 'files/' + getImageNameWithoutPath(image))
    }
  }));
const expectedTracks = tracks
  .map(track => ({
    ...track,
    properties: {
      ...track.properties,
      formattedDate: new Date(track.properties.timestamp).toLocaleString(),
      images: track.properties.images
        .map(image => 'files/' + getImageNameWithoutPath(image))
    }
  }));

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
    const expectedGeoJSON = {
      'type': 'FeatureCollection',
      'features': [
        ...expectedTracks,
        ...expectedPoints
      ]
    };
    expect(geoJSONExportHook.result.current).to.deep.equal(expectedGeoJSON);

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
    const geoJSONExportHook = renderHook(() => useGeoJSONExport(scope.id, '3578a'));

    // WHEN
    act(() => scopesHook.result.current.create(scope));
    for (const point of points) {
      act(() => scopePointsHook.result.current.create(point));
    }
    for (const track of tracks) {
      act(() => scopeTracksHook.result.current.create(track));
    }

    // THEN
    const expectedGeoJSON = {
      'type': 'FeatureCollection',
      'features': [
        expectedTracks[0]
      ]
    };
    expect(geoJSONExportHook.result.current).to.deep.equal(expectedGeoJSON);

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
    const geoJSONExportHook = renderHook(() => useGeoJSONExport(scope.id, '3578a', true));

    // WHEN
    act(() => scopesHook.result.current.create(scope));
    for (const point of points) {
      act(() => scopePointsHook.result.current.create(point));
    }
    for (const track of tracks) {
      act(() => scopeTracksHook.result.current.create(track));
    }

    // THEN
    const expectedGeoJSON = {
      'type': 'FeatureCollection',
      'features': [
        expectedTracks[0],
        expectedPoints[0]
      ]
    };
    expect(geoJSONExportHook.result.current).to.deep.equal(expectedGeoJSON);

    // CLEAN
    act(() => scopesHook.result.current.delete(scope.id));
  });
});
