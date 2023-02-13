import {expect} from 'chai';
import {GeoJSONImport} from './GeoJSONImport';

import sampleGeoJSONExportedFromCatOffline from '../../components/fixtures/sampleGeoJSONExportedFromCatOffline.geo.json';
import sampleGeoJSONWithoutPropertiesNorUnsupportedGeometries from '../../components/fixtures/sampleGeoJSONWithoutPropertiesNorUnsupportedGeometries.geo.json';
import GeoJSON from 'geojson';

const expectedImportedFromCatOffline = {
  points: [
    {
      type: 'Feature',
      id: '55610ca2-9e2a-41bf-a6fa-c603181f9c4a',
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
        coordinates: [0, 0]
      }
    },
    {
      type: 'Feature',
      id: 'b903b3ee-d5b5-4ec8-b23a-bbcde4b808f2',
      properties: {
        name: 'Point 2',
        color: '#973572',
        timestamp: 1673876171245,
        description: 'Point 2 description',
        images: [],
        isVisible: false
      },
      geometry: {
        type: 'Point',
        coordinates: [1, 1]
      }
    }
  ],
  tracks: [
    {
      type: 'Feature',
      id: '1df93aae-d842-41c8-b370-0b6320a212d3',
      properties: {
        name: 'Track 1',
        color: '#973572',
        timestamp: 1673876115769,
        description: 'Track 1 description',
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
      id: '6505bfe9-d478-41be-8b41-81934e42a3bb',
      properties: {
        name: 'Track 2',
        color: '#973572',
        timestamp: 1673876115785,
        description: 'Track 1 description',
        images: [],
        isVisible: false
      },
      geometry: {
        type: 'LineString',
        coordinates: [[2, 2], [3, 3]]
      }
    }
  ],
  numberOfErrors: 0
};
const expectedImportedWithUnsupportedGeometries = {
  points: [
    {
      type: 'Feature',
      properties: {
        color: undefined,
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
      properties: {
        color: undefined,
        description: '',
        images: [],
        isVisible: true
      },
      geometry: {
        type: 'Point',
        coordinates: [1, 1]
      }
    }
  ],
  tracks: [
    {
      type: 'Feature',
      properties: {
        color: undefined,
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
      properties: {
        color: undefined,
        description: '',
        images: [],
        isVisible: true
      },
      geometry: {
        type: 'LineString',
        coordinates: [[2, 2], [3, 3]]
      }
    }
  ],
  numberOfErrors: 1
};

describe('useGeoJSONImport', () => {

  it('useGeoJSONImport should import a GeoJSON previously exported with CatOffline', async () => {
    // GIVEN
    const data: GeoJSON.FeatureCollection = sampleGeoJSONExportedFromCatOffline as GeoJSON.FeatureCollection;

    //WHEN
    const computedData = GeoJSONImport(data);

    // THEN
    expect(computedData).to.deep.equal(expectedImportedFromCatOffline);
  });
  
  it('useGeoJSONImport should import a GeoJSON with empty properties', async () => {
    
    // WHEN
    const computedData = GeoJSONImport(sampleGeoJSONWithoutPropertiesNorUnsupportedGeometries as GeoJSON.FeatureCollection);
      
    const partialComputedData = {
      points: computedData.points.map(point => (
        {
          type: point.type,
          properties: {
            color: point.properties.color,
            description: point.properties.description,
            images: point.properties.images,
            isVisible: point.properties.isVisible
          },
          geometry: point.geometry
        }
      )),
      tracks: computedData.tracks.map(track => (
        {
          type: track.type,
          properties: {
            color: track.properties.color,
            description: track.properties.description,
            images: track.properties.images,
            isVisible: track.properties.isVisible
          },
          geometry: track.geometry
        }
      )),
      numberOfErrors: computedData.numberOfErrors
    };

    // THEN
    expect(partialComputedData).to.deep.equal(expectedImportedWithUnsupportedGeometries);
    
    // THEN
    const computedPoint = computedData?.points && computedData.points.map(point => point);
    const computedTrack = computedData?.tracks && computedData.tracks.map(track => track);
    
    computedPoint && computedPoint.map(point =>
      expect(point.id).to.be.a('string') && expect(point.id).to.have.lengthOf(36) &&
        expect(point.properties.name).to.be.a('string') && expect(point.properties.name).to.include('Point') && expect(point.properties.name).to.have.lengthOf(42) &&
            expect(point.properties.timestamp).to.be.a('number') && expect(Date.now()-point.properties.timestamp).to.be.below(20)
    );

    computedTrack && computedTrack.map(track =>
      expect(track.id).to.be.a('string') && expect(track.id).to.have.lengthOf(36) &&
        expect(track.properties.name).to.be.a('string') && expect(track.properties.name).to.include('Track') && expect(track.properties.name).to.have.lengthOf(42) &&
            expect(track.properties.timestamp).to.be.a('number') && expect(Date.now()-track.properties.timestamp).to.be.below(20)
    );
      
  });
  
});