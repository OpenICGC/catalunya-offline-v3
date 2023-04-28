import {expect} from 'chai';
import {useGPXExport} from './useGPXExport';
import {v4 as uuidv4} from 'uuid';
import {Scope, ScopePoint, ScopeTrack} from '../../types/commonTypes';
import {act, renderHook} from '@testing-library/react-hooks/dom';
import {useScopePoints, useScopes, useScopeTracks} from '../useStoredCollections';
import gpxSample_01 from './gpxSample_01.xml';
import gpxSample_02 from './gpxSample_02.xml';
import gpxSample_03 from './gpxSample_03.xml';
import gpxSample_04 from './gpxSample_04.xml';

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
      description: 'A visible point',
      images: ['image1Point1.jpg', 'image2Point1.jpg' ],
      isVisible: true
    },
    geometry: {
      type: 'Point',
      coordinates: [ 1.849113, 41.608731, 12.0 ]
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
      coordinates: [ 1.85018, 41.607493, 129.0 ]
    }
  }
];

const track: ScopeTrack = {
  type: 'Feature',
  id: '560a8451-a29c-41d4-a716-544676554400',
  properties: {
    name: 'Track 1',
    timestamp: 1673876115769,
    description: 'A custom description',
    images: ['imageTrack1.jpg'],
    isVisible: true
  },
  geometry: {
    type: 'LineString',
    coordinates: [
      [ 1.849509, 41.609283, 142.0, 1674736045 ],
      [ 1.849479, 41.60926, 141.0, 1674736058 ],
      [ 1.849474, 41.609236, 141.0, 1674736070 ],
      [ 1.849479, 41.609232, 141.0, 1674736079 ],
      [ 1.849478, 41.609233, 141.0, 1674736085 ]
    ]
  }
};

const trackWithoutTimestamp: ScopeTrack = {
  type: 'Feature',
  id: uuidv4(),
  properties: {
    name: 'Track withoutTimestamp',
    timestamp: 1673876115769,
    description: 'A custom description',
    images: ['imageTrack1.jpg'],
    isVisible: true
  },
  geometry: {
    type: 'LineString',
    coordinates: [
      [ 1.849509, 41.609283, 142.0 ],
      [ 1.849479, 41.60926, 141.0 ],
      [ 1.849474, 41.609236, 141.0 ],
      [ 1.849479, 41.609232, 141.0 ],
      [ 1.849478, 41.609233, 141.0 ]
    ]
  }
};

const trackWithoutTimestampNorElevation: ScopeTrack = {
  type: 'Feature',
  id: uuidv4(),
  properties: {
    name: 'Track without timestamp nor elevation',
    timestamp: 1673876115769,
    description: 'A custom description',
    images: ['imageTrack1.jpg'],
    isVisible: true
  },
  geometry: {
    type: 'LineString',
    coordinates: [
      [ 1.849509, 41.609283 ],
      [ 1.849479, 41.60926 ],
      [ 1.849474, 41.609236 ],
      [ 1.849479, 41.609232 ],
      [ 1.849478, 41.609233 ]
    ]
  }
};

describe('useGPXExport', () => {
  it('should generate a valid GPX from trackId', async() => {
    // GIVEN
    const scopesHook = renderHook(() => useScopes());
    await scopesHook.waitForValueToChange(() => scopesHook.result.current.list() !== undefined);
    const scopeTracksHook = renderHook(() => useScopeTracks(scope.id));
    await scopeTracksHook.waitForValueToChange(() => scopeTracksHook.result.current.list() !== undefined);
    const gpxExportHook = renderHook(() => useGPXExport(scope.id, track.id));

    // WHEN
    act(() => scopesHook.result.current.create(scope));
    act(() => scopeTracksHook.result.current.create(track));

    // THEN
    expect(gpxExportHook.result.current).to.deep.equal(gpxSample_01);

    // CLEAN
    act(() => scopeTracksHook.result.current.delete(track.id));
    act(() => scopesHook.result.current.delete(scope.id));
  });

  it('should generate a valid GPX from trackId and visiblePoints', async() => {
    // GIVEN
    const scopesHook = renderHook(() => useScopes());
    await scopesHook.waitForValueToChange(() => scopesHook.result.current.list() !== undefined);
    const scopeTracksHook = renderHook(() => useScopeTracks(scope.id));
    await scopeTracksHook.waitForValueToChange(() => scopeTracksHook.result.current.list() !== undefined);
    const scopePointsHook = renderHook(() => useScopePoints(scope.id));
    await scopePointsHook.waitForValueToChange(() => scopePointsHook.result.current.list() !== undefined);
    const gpxExportHook = renderHook(() => useGPXExport(scope.id, track.id, true));

    // WHEN
    act(() => scopesHook.result.current.create(scope));
    for (const point of points) {
      act(() => scopePointsHook.result.current.create(point));
    }
    act(() => scopeTracksHook.result.current.create(track));

    // THEN
    expect(gpxExportHook.result.current).to.deep.equal(gpxSample_02);

    // CLEAN
    act(() => scopeTracksHook.result.current.delete(track.id));
    for (const point of points) {
      act(() => scopePointsHook.result.current.delete(point.id));
    }
    act(() => scopesHook.result.current.delete(scope.id));
  });

  it('should generate a valid GPX from trackId without timestamp', async() => {
    // GIVEN
    const scopesHook = renderHook(() => useScopes());
    await scopesHook.waitForValueToChange(() => scopesHook.result.current.list() !== undefined);
    const scopeTracksHook = renderHook(() => useScopeTracks(scope.id));
    await scopeTracksHook.waitForValueToChange(() => scopeTracksHook.result.current.list() !== undefined);
    const gpxExportHook = renderHook(() => useGPXExport(scope.id, trackWithoutTimestamp.id));

    // WHEN
    act(() => scopesHook.result.current.create(scope));
    act(() => scopeTracksHook.result.current.create(trackWithoutTimestamp));

    // THEN
    expect(gpxExportHook.result.current).to.deep.equal(gpxSample_03);

    // CLEAN
    act(() => scopeTracksHook.result.current.delete(trackWithoutTimestamp.id));
    act(() => scopesHook.result.current.delete(scope.id));
  });

  it('should generate a valid GPX from trackId without timestamp nor elevation', async() => {
    // GIVEN
    const scopesHook = renderHook(() => useScopes());
    await scopesHook.waitForValueToChange(() => scopesHook.result.current.list() !== undefined);
    const scopeTracksHook = renderHook(() => useScopeTracks(scope.id));
    await scopeTracksHook.waitForValueToChange(() => scopeTracksHook.result.current.list() !== undefined);
    const gpxExportHook = renderHook(() => useGPXExport(scope.id, trackWithoutTimestampNorElevation.id));

    // WHEN
    act(() => scopesHook.result.current.create(scope));
    act(() => scopeTracksHook.result.current.create(trackWithoutTimestampNorElevation));

    // THEN
    expect(gpxExportHook.result.current).to.deep.equal(gpxSample_04);

    // CLEAN
    act(() => scopeTracksHook.result.current.delete(trackWithoutTimestampNorElevation.id));
    act(() => scopesHook.result.current.delete(scope.id));
  });
});
