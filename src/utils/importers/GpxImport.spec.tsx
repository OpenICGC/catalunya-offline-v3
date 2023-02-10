import {expect} from 'chai';
import {GpxImport} from './GpxImport';
import sampleGpxTrackFromCatOffline from '../../components/fixtures/sampleGpxTrackFromCatOffline.xml';
import sampleGpxTrackAndPointFromCatOffline from '../../components/fixtures/sampleGpxTrackAndPointFromCatOffline.xml';
import sampleGpxFromRutaBike from '../../components/fixtures/sampleGpxFromRutaBike.xml';
import sampleGpxFromWikiloc from '../../components/fixtures/sampleGpxFromWikiloc.xml';
import kmlSample_01 from '../../hooks/kmlSample_01.xml';

const expectedImportedTrackFromCatOffline = {
  points: [],
  tracks: [
    {
      type: 'Feature',
      properties: {
        name: 'Track 1',
        color: undefined,
        description: 'A custom description',
        images: [],
        isVisible: true,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [ 1.849509, 41.609283, 142 ],
          [ 1.849479, 41.60926, 141 ],
          [ 1.849474, 41.609236, 141 ],
          [ 1.849479, 41.609232, 141 ],
          [ 1.849478, 41.609233, 141 ]
        ]
      }
    }
  ],
  numberOfErrors: 0
};
const expectedImportedTrackAndPointFromCatOffline = {
  points: [
    {
      type: 'Feature',
      properties: {
        name: 'Point 1',
        color: undefined,
        description: 'A visible point',
        images: [],
        isVisible: true,
      },
      geometry: {
        type: 'Point',
        coordinates: [ 1.849113, 41.608731, 12 ]
      }
    }    
  ],
  tracks: [
    {
      type: 'Feature',
      properties: {
        name: 'Track 1',
        color: undefined,
        description: 'A custom description',
        images: [],
        isVisible: true,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [ 1.849509, 41.609283, 142 ],
          [ 1.849479, 41.60926, 141 ],
          [ 1.849474, 41.609236, 141 ],
          [ 1.849479, 41.609232, 141 ],
          [ 1.849478, 41.609233, 141 ]
        ]
      }
    }
  ],
  numberOfErrors: 0
};
const expectedImportedFromRutaBike = {
  points: [],
  tracks: [
    {
      type: 'Feature',
      properties: {
        name: 'Track 1',
        color: undefined,
        description: 'A custom description',
        images: [],
        isVisible: true,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [ 3.007210, 42.403040, 180.4 ],
          [ 3.007440, 42.402570, 179.8 ],
          [ 3.007510, 42.402460, 179.5 ],
          [ 3.007570, 42.402270, 176.2 ],
          [ 3.007700, 42.401800, 171.3 ]
        ]
      }
    }
  ],
  numberOfErrors: 0
};
const expectedImportedFromWikiloc = {
  points: [],
  tracks: [
    {
      type: 'Feature',
      properties: {
        name: 'Track 1',
        color: undefined,
        description: '',
        images: [],
        isVisible: true,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [ 2.011065, 42.281256, 1264.071 ],
          [ 2.011152, 42.281275, 1263.541 ],
          [ 2.011242, 42.281302, 1263.215 ],
          [ 2.011462, 42.281354, 1263.308 ]
        ]
      }
    }
  ],
  numberOfErrors: 0
};

const expectedImportedError = {
  points: [],
  tracks: [],
  numberOfErrors: 1
};
describe('GpxImport', () => {
    
  it('GpxImport should import a Gpx Track and Point from CatOffline', async () => {
    //GIVEN
    const data = sampleGpxTrackAndPointFromCatOffline;
    
    //WHEN
    const computedData = GpxImport(data);

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
    expect(partialComputedData).to.deep.equal(expectedImportedTrackAndPointFromCatOffline);

    // THEN
    const computedTrack = computedData?.tracks && computedData.tracks.map(track => track);

    computedTrack && computedTrack.map(track =>
      expect(track.id).to.be.a('string') && expect(track.id).to.have.lengthOf(36) &&
        expect(track.properties.timestamp).to.be.a('number') && expect(Date.now()-track.properties.timestamp).to.be.below(20)
    );
      
  });

  it('GpxImport should import a Gpx Track from CatOffline', async () => {
    //GIVEN
    const data = sampleGpxTrackFromCatOffline;

    //WHEN
    const computedData = GpxImport(data);

    const partialComputedData = {
      points: [],
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
    expect(partialComputedData).to.deep.equal(expectedImportedTrackFromCatOffline);

    // THEN
    const computedTrack = computedData?.tracks && computedData.tracks.map(track => track);

    computedTrack && computedTrack.map(track =>
      expect(track.id).to.be.a('string') && expect(track.id).to.have.lengthOf(36) &&
        expect(track.properties.timestamp).to.be.a('number') && expect(Date.now()-track.properties.timestamp).to.be.below(20)
    );

  });

  it('GpxImport should import a Gpx Track from RutaBike', async () => {
    //GIVEN
    const data = sampleGpxFromRutaBike;

    //WHEN
    const computedData = GpxImport(data);

    const partialComputedData = {
      points: [],
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

    computedTrack && computedTrack.map(track =>
      expect(track.id).to.be.a('string') && expect(track.id).to.have.lengthOf(36) &&
        expect(track.properties.timestamp).to.be.a('number') && expect(Date.now()-track.properties.timestamp).to.be.below(20)
    );
  });

  it('GpxImport should import a Gpx Track from Wikiloc', async () => {
    //GIVEN
    const data = sampleGpxFromWikiloc;

    //WHEN
    const computedData = GpxImport(data);

    const partialComputedData = {
      points: [],
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

  it('GpxImport should import a Gpx Track and Point from Wikiloc', async () => {
    //GIVEN
    const data = sampleGpxFromWikiloc;

    //WHEN
    const computedData = GpxImport(data);

    const partialComputedData = {
      points: [],
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

  it('GpxImport should not import a string', async () => {
    //GIVEN
    const data = 'hola mundo';

    //WHEN
    const computedData = GpxImport(data);

    // THEN
    expect(computedData).to.deep.equal(expectedImportedError);

  });
  it('GpxImport should not import a kml', async () => {
    //GIVEN
    const data = kmlSample_01;

    //WHEN
    const computedData = GpxImport(data);

    // THEN
    expect(computedData).to.deep.equal(expectedImportedError);

  });

});
