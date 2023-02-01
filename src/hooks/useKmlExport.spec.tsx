import {expect} from 'chai';
import {useKmlExport} from './useKmlExport';
import {act, renderHook} from '@testing-library/react-hooks/dom';
import {useScopePoints, useScopes, useScopeTracks} from './useStoredCollections';
import {v4 as uuidv4} from 'uuid';
import {Scope, ScopePoint, ScopeTrack} from '../types/commonTypes';

const scopeId = uuidv4();

const scope: Scope = {
  id: scopeId,
  name: 'Scope 1',
  color: '#973572'
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
      images: [],
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
      color: '#977235',
      timestamp: 1673876115769,
      description: 'Track 1 description',
      images: [],
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

const trackWithoutTimestampNorElevation: ScopeTrack[] = [
  {
    type: 'Feature',
    id: 'e73af4f0-4a3f-4c75-972f-fb9b8ac4a596',
    properties: {
      name: 'Track 1',
      color: '#977235',
      timestamp: 1673876115769,
      description: 'Track 1 description',
      images: [],
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
      color: '#977235',
      timestamp: 1673876115769,
      description: 'Track 1 description',
      images: [],
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

const sampleKML = '<?xml version="1.0" encoding="UTF-8"?>\n' +
'<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
    '<Document>\n' +
        '<name>Scope 1</name>\n' +
        '<open>1</open>\n' +
        '<!-- TRACK STYLES -->\n' +
        '<Style id="e73af4f0-4a3f-4c75-972f-fb9b8ac4a596-normal">\n' +
            '<LineStyle>\n' +
                '<color>ff973572</color>\n' +
                '<width>5</width>\n' +
            '</LineStyle>\n' +
        '</Style>\n' +
        '<Style id="e73af4f0-4a3f-4c75-972f-fb9b8ac4a596-highlight">\n' +
            '<LineStyle>\n' +
                '<color>ff973572</color>\n' +
                '<width>7</width>\n' +
            '</LineStyle>\n' +
        '</Style>\n' +
        '<StyleMap id="e73af4f0-4a3f-4c75-972f-fb9b8ac4a596">\n' +
            '<Pair>\n' +
                '<key>normal</key>\n' +
                '<styleUrl>#e73af4f0-4a3f-4c75-972f-fb9b8ac4a596-normal</styleUrl>\n' +
            '</Pair>\n' +
            '<Pair>\n' +
                '<key>highlight</key>\n' +
                '<styleUrl>#e73af4f0-4a3f-4c75-972f-fb9b8ac4a596-highlight</styleUrl>\n' +
            '</Pair>\n' +
        '</StyleMap>\n' +
        '<!-- POINT STYLES -->\n' +
        '<Style id="874bf4f0-4a3f-4c75-972f-fb9b8ac4a596-normal">\n' +
            '<IconStyle>\n' +
                '<color>ff973572</color>\n' +
            '</IconStyle>\n' +
            '<LabelStyle>\n' +
                '<scale>1</scale>\n' +
            '</LabelStyle>\n' +
        '</Style>\n' +
        '<Style id="874bf4f0-4a3f-4c75-972f-fb9b8ac4a596-highlight">\n' +
            '<IconStyle>\n' +
                '<color>ff973572</color>\n' +
            '</IconStyle>\n' +
            '<LabelStyle>\n' +
                '<scale>1.1</scale>\n' +
            '</LabelStyle>\n' +
        '</Style>\n' +
        '<StyleMap id="874bf4f0-4a3f-4c75-972f-fb9b8ac4a596">\n' +
            '<Pair>\n' +
                '<key>normal</key>\n' +
                '<styleUrl>#874bf4f0-4a3f-4c75-972f-fb9b8ac4a596-normal</styleUrl>\n' +
            '</Pair>\n' +
            '<Pair>\n' +
                '<key>highlight</key>\n' +
                '<styleUrl>#874bf4f0-4a3f-4c75-972f-fb9b8ac4a596-highlight</styleUrl>\n' +
            '</Pair>\n' +
        '</StyleMap>\n' +
        '<Style id="35de56eb-7c9d-405d-8d6c-147e083cb6bf-normal">\n' +
            '<IconStyle>\n' +
                '<color>ff973572</color>\n' +
            '</IconStyle>\n' +
            '<LabelStyle>\n' +
                '<scale>1</scale>\n' +
            '</LabelStyle>\n' +
        '</Style>\n' +
        '<Style id="35de56eb-7c9d-405d-8d6c-147e083cb6bf-highlight">\n' +
            '<IconStyle>\n' +
                '<color>ff973572</color>\n' +
            '</IconStyle>\n' +
            '<LabelStyle>\n' +
                '<scale>1.1</scale>\n' +
            '</LabelStyle>\n' +
        '</Style>\n' +
        '<StyleMap id="35de56eb-7c9d-405d-8d6c-147e083cb6bf">\n' +
            '<Pair>\n' +
                '<key>normal</key>\n' +
                '<styleUrl>#35de56eb-7c9d-405d-8d6c-147e083cb6bf-normal</styleUrl>\n' +
            '</Pair>\n' +
            '<Pair>\n' +
                '<key>highlight</key>\n' +
                '<styleUrl>#35de56eb-7c9d-405d-8d6c-147e083cb6bf-highlight</styleUrl>\n' +
            '</Pair>\n' +
        '</StyleMap>\n' +
        '<!-- POINT FOLDER -->\n' +
        '<Folder>\n' +
            '<name>Points</name>\n' +
            '<open>1</open>\n' +
            '<Placemark>\n' +
                '<name>Point 1</name>\n' +
                '<description>Point 1 description</description>\n' +
                '<styleUrl>#874bf4f0-4a3f-4c75-972f-fb9b8ac4a596</styleUrl>\n' +
                '<Point>\n' +
                    '<coordinates>-3.698005, 40.402501, 0</coordinates>\n' +
                '</Point>\n' +
            '</Placemark>\n' +
            '<Placemark>\n' +
                '<name>Point 2</name>\n' +
                '<description>Point 2 description</description>\n' +
                '<styleUrl>#35de56eb-7c9d-405d-8d6c-147e083cb6bf</styleUrl>\n' +
                '<Point>\n' +
                    '<coordinates>-3.698864176137905, 40.40192130721456, 0</coordinates>\n' +
                '</Point>\n' +
            '</Placemark>\n' +
        '</Folder>\n' +
        '<!-- TRACK FOLDER -->\n' +
        '<Folder>\n' +
            '<name>Tracks</name>\n' +
            '<open>1</open>\n' +
            '<Placemark>\n' +
                '<name>Track 1</name>\n' +
                '<description>Track 1 description</description>\n' +
                '<styleUrl>#e73af4f0-4a3f-4c75-972f-fb9b8ac4a596</styleUrl>\n' +
                '<LineString>\n' +
                    '<tessellate>1</tessellate>\n' +
                    '<coordinates>\n' +
                        '-3.698053272441833,40.40243085733725,0 \n' +
                        '-3.697723976621552,40.40272136663401,0 \n' +
                        '-3.695985219357802,40.40257933830212,0 \n' +
                        '-3.696128879062175,40.40098962237379,0 \n' +
                        '-3.698789629333535,40.40101458330396,0 \n' +
                        '-3.699582462026573,40.40127776668836,0 \n' +
                    '</coordinates>\n' +
                '</LineString>\n' +
            '</Placemark>\n' +
        '</Folder>\n' +
    '</Document>\n' +
'</kml>';

describe('useKmlExport', () => {
  // GIVEN
  const sampleScope = scope;
  const samplePoints = points;
  const sampleTracks = tracks;

  const sampleTrackWithoutTimestamp = trackWithoutTimestamp;
  const sampleTrackWithoutTimestampNorElevation = trackWithoutTimestampNorElevation;

  /*it('useKmlExport should generate a valid KML from scopeId (tracks with lon,lat,ele,timestamp)', async () => {

    // WHEN
    const resultScope = renderHook(() => useScopes());
    const resultPoint = renderHook(() => useScopePoints(scope.id));
    const resultTrack = renderHook(() => useScopeTracks(scope.id));

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

    const {result, waitForNextUpdate} = renderHook(() => useKmlExport(scope));
    await waitForNextUpdate();

    // THEN
    const expectedKML = sampleKML;

    expect(result.current).to.deep.equal(expectedKML);

    //CLEAN
    act(() => resultScope.result.current.delete(scope.id));
    await resultScope.waitForNextUpdate();
  });*/

  it('useKmlExport should generate a valid KML from scopeId (tracks with lon,lat,ele)', async () => {

    // WHEN
    const resultScope = renderHook(() => useScopes());
    const resultPoint = renderHook(() => useScopePoints(scope.id));
    const resultTrack = renderHook(() => useScopeTracks(scope.id));

    act(() => resultScope.result.current.create(sampleScope));
    await resultScope.waitForNextUpdate();
    for (const point of samplePoints) {
      act(() => resultPoint.result.current.create(point));
      await resultPoint.waitForNextUpdate();
    }
    for (const track of sampleTrackWithoutTimestamp) {
      act(() => resultTrack.result.current.create(track));
      await resultTrack.waitForNextUpdate();
    }

    const {result, waitForNextUpdate} = renderHook(() => useKmlExport(scope));
    await waitForNextUpdate();

    // THEN
    const expectedKML = sampleKML;

    expect(result.current).to.deep.equal(expectedKML);

    //CLEAN
    act(() => resultScope.result.current.delete(scope.id));
    await resultScope.waitForNextUpdate();
  });

  /*it('useKmlExport should generate a valid KML from scopeId (tracks with lon,lat)', async () => {

    // WHEN
    const resultScope = renderHook(() => useScopes());
    const resultPoint = renderHook(() => useScopePoints(scope.id));
    const resultTrack = renderHook(() => useScopeTracks(scope.id));

    act(() => resultScope.result.current.create(sampleScope));
    await resultScope.waitForNextUpdate();
    for (const point of samplePoints) {
      act(() => resultPoint.result.current.create(point));
      await resultPoint.waitForNextUpdate();
    }
    for (const track of sampleTrackWithoutTimestampNorElevation) {
      act(() => resultTrack.result.current.create(track));
      await resultTrack.waitForNextUpdate();
    }

    const {result, waitForNextUpdate} = renderHook(() => useKmlExport(scope));
    await waitForNextUpdate();

    // THEN
    const expectedKML = sampleKML;

    expect(result.current).to.deep.equal(expectedKML);

    //CLEAN
    act(() => resultScope.result.current.delete(scope.id));
    await resultScope.waitForNextUpdate();
  });*/

});