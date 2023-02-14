import {expect} from 'chai';
import {KmlImport} from './KmlImport';

import sampleKmlFromWikiloc from '../../components/fixtures/sampleKmlFromWikiloc.xml';
import sampleKmlFromRutaBike from '../../components/fixtures/sampleKmlFromRutaBike.xml';

const expectedImportedFromWikiloc = {
  points: [
    {
      type: 'Feature',
      properties: {
        name: 'paki estacio',
        color: undefined,
        description: '',
        images: [],
        isVisible: true,
      },
      geometry: {
        type: 'Point',
        coordinates: [ 2.069355, 41.444691, 214 ]
      }
    }
  ],
  tracks: [
    {
      type: 'Feature',
      properties: {
        name: 'Path',
        color: '#FF9933',
        description: '',
        images: [],
        isVisible: true,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [ 2.069355, 41.444691, 214.042 ],
          [ 2.069453, 41.444753, 212.022 ],
          [ 2.069559, 41.444805, 211.014 ],
          [ 2.069628, 41.444891, 211.008 ],
          [ 2.069636, 41.444987, 210.066 ]
        ]
      }
    }
  ],
  numberOfErrors: 0
};

const expectedImportedFromRutaBike = {
  points: [
    {
      type: 'Feature',
      properties: {
        color: undefined,
        description: '',
        images: [],
        isVisible: true,
      },
      geometry: {
        type: 'Point',
        coordinates: [ 2.41738, 41.869, 751.03 ]
      }
    },
    {
      type: 'Feature',
      properties: {
        color: undefined,
        description: '',
        images: [],
        isVisible: true,
      },
      geometry: {
        type: 'Point',
        coordinates: [ 2.425380, 41.872720, 838.50 ]
      }
    }
  ],
  tracks: [
    {
      type: 'Feature',
      properties: {
        name: 'Track 1',
        color: '#59acff',
        description: '',
        images: [],
        isVisible: true,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [ 2.417380,41.869000,751.03 ],
          [ 2.417380,41.869000,751.027200 ],
          [ 2.417380,41.869030,750.42 ],
          [ 2.417380,41.869030,750.417600 ],
          [ 2.417460,41.869000,749.50 ],
          [ 2.417460,41.869000,749.503200 ],
          [ 2.417550,41.868960,750.11 ],
          [ 2.417550,41.868960,750.112800 ],
          [ 2.417640,41.868960,750.42 ],
          [ 2.417640,41.868960,750.417600 ],
        ]
      }
    }
  ],
  numberOfErrors: 0
};

describe('KmlImport', () => {

  it('KmlImport should import a Kml from Wikiloc', async () => {
    //GIVEN
    const data = sampleKmlFromWikiloc;

    //WHEN
    const computedData = KmlImport(data);

    const partialComputedData = {
      points: computedData.points.map(point => (
        {
          type: point.type,
          properties: {
            name: point.properties.name,
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
            name: track.properties.name,
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
    expect(partialComputedData).to.deep.equal(expectedImportedFromWikiloc);

    // THEN
    const computedTrack = computedData?.tracks && computedData.tracks.map(track => track);

    computedTrack && computedTrack.map(track =>
      expect(track.id).to.be.a('string') && expect(track.id).to.have.lengthOf(36) &&
        expect(track.properties.timestamp).to.be.a('number') && expect(Date.now()-track.properties.timestamp).to.be.below(20)
    );

  });

  it('KmlImport should import a Kml from RutaBike', async () => {
    //GIVEN
    const data = sampleKmlFromRutaBike;

    //WHEN
    const computedData = KmlImport(data);

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
            name: track.properties.name,
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
    expect(partialComputedData).to.deep.equal(expectedImportedFromRutaBike);

    // THEN
    const computedTrack = computedData?.tracks && computedData.tracks.map(track => track);
    const computedPoint = computedData?.points && computedData.points.map(point => point);

    computedPoint && computedPoint.map(point =>
      expect(point.id).to.be.a('string') && expect(point.id).to.have.lengthOf(36) &&
        expect(point.properties.name).to.be.a('string') && expect(point.properties.name).to.include('Point') && expect(point.properties.name).to.have.lengthOf(42) &&
            expect(point.properties.timestamp).to.be.a('number') && expect(Date.now()-point.properties.timestamp).to.be.below(20)
    );

    computedTrack && computedTrack.map(track =>
      expect(track.id).to.be.a('string') && expect(track.id).to.have.lengthOf(36) &&
        expect(track.properties.timestamp).to.be.a('number') && expect(Date.now()-track.properties.timestamp).to.be.below(20)
    );

  });

});