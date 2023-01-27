import {expect} from 'chai';
import {useGPXExport} from './useGPXExport';
import {v4 as uuidv4} from 'uuid';
import {Scope, ScopePoint, ScopeTrack} from '../types/commonTypes';
import {act, renderHook} from '@testing-library/react-hooks/dom';
import {useScopePoints, useScopes, useScopeTracks} from './useStoredCollections';

const scopeId = uuidv4();

const scope: Scope = {
  id: scopeId,
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
      images: [],
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
    images: [],
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

describe('useGPXExport', () => {
    
  const sampleScope = scope;
  const sampleTrack = track;
  const samplePoints = points;
  

  it('useGPXExport should generate a valid GPX from trackId', async() => {

    // GIVEN
    const resultScope = renderHook(() => useScopes());
    const resultTrack = renderHook(() => useScopeTracks(scopeId));
    const resultPoint = renderHook(() => useScopePoints(scopeId));

    // WHEN
    act(() => resultScope.result.current.create(sampleScope));
    await resultScope.waitForNextUpdate();

    for (const point of samplePoints) {
      act(() => resultPoint.result.current.create(point));
      await resultPoint.waitForNextUpdate();
    }
    act(() => resultTrack.result.current.create(sampleTrack));
    await resultTrack.waitForNextUpdate();
    
    const { result, waitForNextUpdate } = renderHook(() => useGPXExport(scope, track.id));
    await waitForNextUpdate();
    
    // THEN
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    const expectedGPX = '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<gpx creator="fabulator:gpx-builder" version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\n' +
            '  <metadata>\n' +
            '    <name>Scope 1</name>\n' +
            '    <copyright author="Institut Cartogràfic i Geològic de Catalunya">\n'+
            '      <year>2023</year>\n' +
            '    </copyright>\n' +
            '    <link href="https://www.icgc.cat/ca/"></link>\n' +
            '  </metadata>\n' +
            '  <rte>\n' +
            '    <cmt>A custom description</cmt>\n' +
            '    <rtept lat="41.609283" lon="1.849509">\n' +
            '      <ele>142</ele>\n' +
            '      <time>1970-01-20T09:12:16.045Z</time>\n' +
            '    </rtept>\n' +
            '    <rtept lat="41.60926" lon="1.849479">\n' +
            '      <ele>141</ele>\n' +
            '      <time>1970-01-20T09:12:16.058Z</time>\n' +
            '    </rtept>\n' +
            '    <rtept lat="41.609236" lon="1.849474">\n' +
            '      <ele>141</ele>\n' +
            '      <time>1970-01-20T09:12:16.070Z</time>\n' +
            '    </rtept>\n' +
            '    <rtept lat="41.609232" lon="1.849479">\n' +
            '      <ele>141</ele>\n' +
            '      <time>1970-01-20T09:12:16.079Z</time>\n' +
            '    </rtept>\n' +
            '    <rtept lat="41.609233" lon="1.849478">\n' +
            '      <ele>141</ele>\n' +
            '      <time>1970-01-20T09:12:16.085Z</time>\n' +
            '    </rtept>\n' +
            '    <name>Track 1</name>\n' +
            '  </rte>\n' +
            '</gpx>';

    expect(result.current).to.deep.equal(expectedGPX);

    //CLEAN
    act(() => resultScope.result.current.delete(sampleScope.id));
    await resultScope.waitForNextUpdate();
    
  });

  it('useGPXExport should generate a valid GPX from trackId and visiblePoints', async() => {

    // GIVEN
    const resultScope = renderHook(() => useScopes());
    const resultTrack = renderHook(() => useScopeTracks(scopeId));
    const resultPoint = renderHook(() => useScopePoints(scopeId));

    // WHEN
    act(() => resultScope.result.current.create(sampleScope));
    await resultScope.waitForNextUpdate();

    for (const point of samplePoints) {
      act(() => resultPoint.result.current.create(point));
      await resultPoint.waitForNextUpdate();
    }

    act(() => resultTrack.result.current.create(sampleTrack));
    await resultTrack.waitForNextUpdate();
    
    const { result, waitForNextUpdate } = renderHook(() => useGPXExport(scope, track.id, true));
    await waitForNextUpdate();

    // THEN
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    const expectedGPX = '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<gpx creator="fabulator:gpx-builder" version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\n' +
            '  <metadata>\n' +
            '    <name>Scope 1</name>\n' +
            '    <copyright author="Institut Cartogràfic i Geològic de Catalunya">\n'+
            '      <year>2023</year>\n' +
            '    </copyright>\n' +
            '    <link href="https://www.icgc.cat/ca/"></link>\n' +
            '  </metadata>\n' +
            '  <wpt lat="41.608731" lon="1.849113">\n' +
            '    <ele>12</ele>\n' +
            '    <time>2023-01-16T13:36:11.254Z</time>\n' +
            '    <name>Point 1</name>\n' +
            '    <cmt>A visible point</cmt>\n' +
            '  </wpt>\n' +
            '  <rte>\n' +
            '    <cmt>A custom description</cmt>\n' +
            '    <rtept lat="41.609283" lon="1.849509">\n' +
            '      <ele>142</ele>\n' +
            '      <time>1970-01-20T09:12:16.045Z</time>\n' +
            '    </rtept>\n' +
            '    <rtept lat="41.60926" lon="1.849479">\n' +
            '      <ele>141</ele>\n' +
            '      <time>1970-01-20T09:12:16.058Z</time>\n' +
            '    </rtept>\n' +
            '    <rtept lat="41.609236" lon="1.849474">\n' +
            '      <ele>141</ele>\n' +
            '      <time>1970-01-20T09:12:16.070Z</time>\n' +
            '    </rtept>\n' +
            '    <rtept lat="41.609232" lon="1.849479">\n' +
            '      <ele>141</ele>\n' +
            '      <time>1970-01-20T09:12:16.079Z</time>\n' +
            '    </rtept>\n' +
            '    <rtept lat="41.609233" lon="1.849478">\n' +
            '      <ele>141</ele>\n' +
            '      <time>1970-01-20T09:12:16.085Z</time>\n' +
            '    </rtept>\n' +
            '    <name>Track 1</name>\n' +
            '  </rte>\n' +
            '</gpx>';

    expect(result.current).to.deep.equal(expectedGPX);

    //CLEAN
    act(() => resultScope.result.current.delete(sampleScope.id));
    await resultScope.waitForNextUpdate();

  });

});