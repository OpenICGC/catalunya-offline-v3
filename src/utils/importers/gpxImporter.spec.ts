import {expect} from 'chai';
import gpxImporter from './gpxImporter';
import sampleGpxTrackFromCatOffline from '../../components/fixtures/sampleGpxTrackFromCatOffline.xml';
import sampleGpxTrackAndPointFromCatOffline from '../../components/fixtures/sampleGpxTrackAndPointFromCatOffline.xml';
import sampleGpxFromRutaBike from '../../components/fixtures/sampleGpxFromRutaBike.xml';
import sampleGpxFromWikiloc from '../../components/fixtures/sampleGpxFromWikiloc.xml';
import sampleGpxFromWikilocWithAccents from '../../components/fixtures/sampleGpxFromWikilocWithAccents.xml';
import kmlSample_01 from '../../hooks/exporters/kmlSample_01.xml';
import sampleMultiPolygon from '../../components/fixtures/sampleMultiPolygon.xml';

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
          [ 1.849509, 41.609283, 142, 1674736 ],
          [ 1.849479, 41.60926, 141, 1674736 ],
          [ 1.849474, 41.609236, 141, 1674736 ],
          [ 1.849479, 41.609232, 141, 1674736 ],
          [ 1.849478, 41.609233, 141, 1674736 ]
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
          [ 1.849509, 41.609283, 142, 1674736 ],
          [ 1.849479, 41.60926, 141, 1674736 ],
          [ 1.849474, 41.609236, 141, 1674736 ],
          [ 1.849479, 41.609232, 141, 1674736 ],
          [ 1.849478, 41.609233, 141, 1674736 ]
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
          [ 3.007210, 42.403040, 180.4, 1117217951 ],
          [ 3.007440, 42.402570, 179.8, 1117217962 ],
          [ 3.007510, 42.402460, 179.5, 1117217967 ],
          [ 3.007570, 42.402270, 176.2, 1117217973 ],
          [ 3.007700, 42.401800, 171.3, 1117217982 ]
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
          [ 2.011065, 42.281256, 1264.071, 1617201761 ],
          [ 2.011152, 42.281275, 1263.541, 1617201788 ],
          [ 2.011242, 42.281302, 1263.215, 1617201817 ],
          [ 2.011462, 42.281354, 1263.308, 1617201856 ]
        ]
      }
    }
  ],
  numberOfErrors: 0
};

const expectedImportedFromWikilocWithAccents = {
  points: [],
  tracks: [
    {
      type: 'Feature',
      properties: {
        name: '110113 ROJALS',
        color: undefined,
        description: 'Una mica més enllà hi ha, a mà dreta.',
        images: [],
        isVisible: true
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [1.11249, 41.338297, 978, 1294909567],
          [1.11213, 41.33826, 982, 1294909600]
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

const expectedMultiPolygon = {
  points: [],
  tracks: [
    {
      type: 'Feature',
      properties: {
        name: 'Connecticut',
        color: undefined,
        description: '',
        images: [],
        isVisible: true
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [ -73.49793718127407, 42.054513454754115 ],
          [ -72.73222164578922, 42.03598745377748 ],
          [ -71.8009089830251, 42.013249823569055 ],
          [ -71.79295081245215, 41.466616522785614 ],
          [ -71.853825649692,41.32003632258983 ],
          [ -72.29514238146447, 41.26975515396981 ],
          [ -72.87616634793818, 41.22055919042799 ],
          [ -73.64788653178721, 40.95323936094951 ],
          [ -73.64826921714257, 40.954623463363454 ],
          [ -73.64788653178721, 40.95476927691993 ],
          [ -73.65668718127472, 40.9850696884738 ],
          [ -73.69267981636597, 41.107310289060365 ],
          [ -73.47517371284943, 41.2046686874981 ],
          [ -73.55348934598777, 41.28985728613134 ],
          [ -73.49793718127407, 42.054513454754115 ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Rhode Island',
        color: undefined,
        description: '',
        images: [],
        isVisible: true
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [ -71.853825649692, 41.32003632258983 ],
          [ -71.79295081245215, 41.466616522785614 ],
          [ -71.8009089830251, 42.013249823569055 ],
          [ -71.37915178087496, 42.02436025651181 ],
          [ -71.30507361518457, 41.76241242122431 ],
          [ -71.14789974636884, 41.64758738867177 ],
          [ -71.1203820461734, 41.49465098730397 ],
          [ -71.853825649692, 41.32003632258983 ]
        ]
      }
    }
  ],
  numberOfErrors: 0
};
describe('gpxImporter', () => {
    
  it('should import a Gpx Track and Point from CatOffline', async () => {
    //GIVEN
    const data = sampleGpxTrackAndPointFromCatOffline;
    
    //WHEN
    const computedData = gpxImporter(data);

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

  it('should import a Gpx Track from CatOffline', async () => {
    //GIVEN
    const data = sampleGpxTrackFromCatOffline;

    //WHEN
    const computedData = gpxImporter(data);

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

  it('should import a Gpx Track from RutaBike', async () => {
    //GIVEN
    const data = sampleGpxFromRutaBike;

    //WHEN
    const computedData = gpxImporter(data);

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

  it('should import a Gpx Track from Wikiloc', async () => {
    //GIVEN
    const data = sampleGpxFromWikiloc;

    //WHEN
    const computedData = gpxImporter(data);

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

  it('should import a Gpx Track and Point from Wikiloc', async () => {
    //GIVEN
    const data = sampleGpxFromWikiloc;

    //WHEN
    const computedData = gpxImporter(data);

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

  it('should not import a string', async () => {
    //GIVEN
    const data = 'hello world';

    //WHEN
    const computedData = gpxImporter(data);

    // THEN
    expect(computedData).to.deep.equal(expectedImportedError);

  });

  it('should import a Gpx file parsing correctly the UTF-8 character encoding', () => {
    //GIVEN
    const data = sampleGpxFromWikilocWithAccents;

    //WHEN
    const computedData = gpxImporter(data);

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
    expect(partialComputedData).to.deep.equal(expectedImportedFromWikilocWithAccents);

    // THEN
    const computedTrack = computedData?.tracks && computedData.tracks.map(track => track);

    computedTrack && computedTrack.map(track =>
      expect(track.id).to.be.a('string') && expect(track.id).to.have.lengthOf(36) &&
      expect(track.properties.timestamp).to.be.a('number') && expect(Date.now()-track.properties.timestamp).to.be.below(20)
    );
  });

  it('should not import a kml', async () => {
    //GIVEN
    const data = kmlSample_01;

    //WHEN
    const computedData = gpxImporter(data);

    // THEN
    expect(computedData).to.deep.equal(expectedImportedError);

  });

  it('should not import a MultyPoligon gpx', async () => {
    //GIVEN
    const data = sampleMultiPolygon;

    //WHEN
    const computedData = gpxImporter(data);

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
    expect(partialComputedData).to.deep.equal(expectedMultiPolygon);

    // THEN
    const computedTrack = computedData?.tracks && computedData.tracks.map(track => track);

    computedTrack && computedTrack.map(track =>
      expect(track.id).to.be.a('string') && expect(track.id).to.have.lengthOf(36) &&
        expect(track.properties.timestamp).to.be.a('number') && expect(Date.now()-track.properties.timestamp).to.be.below(20)
    );

  });

});
