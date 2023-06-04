import {expect} from 'chai';
import kmlScopeImporter from './kmlScopeImporter';

import fromWikiloc from './fixtures/kml/fromWikiloc.kml';
import fromRutaBike from './fixtures/kml/fromRutaBike.kml';
import fromGEarth from './fixtures/kml/fromGEarth.kml';
import sample_01 from './fixtures/kml/sample_01.kml';
import {asDataUrl, unicodeToBase64} from '../loaders/helpers';

const expectedImportedFromWikiloc = {
  points: [
    {
      type: 'Feature',
      properties: {
        name: 'paki estacio',
        color: undefined,
        description:  '<table width="400" style="color:#666"><tr><td colspan="2" align="left"><a href="https://www.wikiloc.com"><img src="https://sc.wklcdn.com/wikiloc/images/wikiloc.png?v=3.0" alt="Wikiloc"></a></td></tr><tr><td colspan="2"><font style="font-size:14pt;color:#2B60DE"><a href="https://www.wikiloc.com/hiking-trails/paki-estacio-21063457">paki estacio</a></font><br/>near La Floresta Pearson, Catalunya (España) by <a style="color:#2B60DE" href="https://www.wikiloc.com/wikiloc/user.do?id=607096">Carme Burrel</a></td></tr><tr><td width="40"><img src="https://sc.wklcdn.com/wikiloc/images/pictograms/1.png" alt=""/></td><td align="left"><font style="color:black"><b>Walking distance:</b> 0 mi. - 0 km.</font><br/><br/><b>Elevation min:</b> 209 meters <b>max:</b> 219 meters<br/><b>Uphill:</b> 7 meters <b>down:</b> 7 meters<br/><b>Type: </b>One way<br/></td></tr><tr><td colspan="2"> </td></tr><tr><td align="right" colspan="2"><br/><a style="color:#2B60DE"href="https://www.wikiloc.com/wikiloc/upload.do"><b>Upload your trail to wikiloc.com &rarr;</b></a></td></tr></table>',
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
        description: '\n              <table>\n                <tr><td>Longitude: 2.417380 </td></tr>\n                <tr><td>Latitude: 41.869000 </td></tr>\n                <tr><td>Altitude: 751.027 meters </td></tr>\n                <tr><td>Speed: 15.9 meters/hour </td></tr>\n                <tr><td>Heading: 2.7 </td></tr>\n                <tr><td>Time: 2003-07-03T17:39:31Z </td></tr>\n              </table>\n            ',
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
        description: '\n              <table>\n                <tr><td>Longitude: 2.425380 </td></tr>\n                <tr><td>Latitude: 41.872720 </td></tr>\n                <tr><td>Altitude: 838.505 meters </td></tr>\n                <tr><td>Speed: 5.6 km/hour </td></tr>\n                <tr><td>Heading: 44.8 </td></tr>\n                <tr><td>Time: 2003-07-03T17:51:59Z </td></tr>\n              </table>\n            ',
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
const expectedImportedFromGEarth = {
  points: [],
  tracks: [
    {
      type: 'Feature',
      properties: {
        name: 'KmlPath',
        color: '#aa00ff',
        description: 'A kmlPath description',
        images: [],
        isVisible: true,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [ 1.189078170287159,41.11763934406184,0 ],
          [ 1.190725247335649,41.12131425356854,0 ],
          [ 1.193769182339264,41.12296929348794,0 ],
          [ 1.195315560929782,41.12106882889221,0 ],
          [ 1.193673346337989,41.11621332650662,0 ],
          [ 1.190429489326825,41.11569927135588,0 ]
        ]
      }
    }
  ],
  numberOfErrors: 0
};
const expectedImportedFromCatoffline = {
  points: [
    {
      type: 'Feature',
      properties: {
        name: 'Point 1',
        color: '#973572',
        description: '\n                    \n                        Point 1 description\n                        <img style="max-width:500px; margin-bottom: 10px" src="9c3981d3-8ca5-4b7b-a3bc-a949761591ab/files/image1Point1.jpg">\n                        <img style="max-width:500px; margin-bottom: 10px" src="9c3981d3-8ca5-4b7b-a3bc-a949761591ab/files/image2Point1.jpg">\n                    \n                ',
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
      properties: {
        name: 'Point 2',
        color: '#973572',
        description: '\n                    \n                        Point 2 description\n                    \n                ',
        images: [],
        isVisible: true
      },
      geometry: {
        type: 'Point',
        coordinates: [-3.698864176137905,40.40192130721456,0]
      }
    }
  ],
  tracks: [
    {
      type: 'Feature',
      properties: {
        name: 'Track 1',
        color: '#973572',
        description: '\n                    \n                        Track 1 description\n                        <p>Timestamp: 1673876115769</p>\n                        <img style="max-width:500px; margin-bottom: 10px" src="9c3981d3-8ca5-4b7b-a3bc-a949761591ab/files/imageTrack1.jpg">\n                    \n                ',
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
  ],
  numberOfErrors: 0
};

describe('kmlScopeImporter', () => {

  it('should import a Kml from Catoffline', async () => {
    //GIVEN
    const data = asDataUrl(unicodeToBase64(sample_01), 'application/vnd.google-earth.kml+xml');

    //WHEN
    const computedData = await kmlScopeImporter(data);

    const partialComputedData = {
      points: computedData.points.map(point => (
        {
          type: point.type,
          properties: {
            name: point.properties.name,
            color: point.properties.color,
            description: point.properties.description,
            images: [],
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
            images: [],
            isVisible: track.properties.isVisible
          },
          geometry: track.geometry
        }
      )),
      numberOfErrors: computedData.numberOfErrors
    };

    // THEN
    expect(partialComputedData).to.deep.equal(expectedImportedFromCatoffline);

    // THEN
    const computedTrack = computedData?.tracks && computedData.tracks.map(track => track);
    const computedPoint = computedData?.points && computedData.points.map(point => point);

    computedPoint && computedPoint.map(point =>
      expect(point.id).to.be.a('string') && expect(point.id).to.have.lengthOf(36) &&
        expect(point.properties.timestamp).to.be.a('number') && expect(Date.now()-point.properties.timestamp).to.be.below(20)
    );
    computedTrack && computedTrack.map(track =>
      expect(track.id).to.be.a('string') && expect(track.id).to.have.lengthOf(36) &&
        expect(track.properties.timestamp).to.be.a('number') && expect(Date.now()-track.properties.timestamp).to.be.below(20)
    );

  });

  it('should import a Kml from Wikiloc', async () => {
    //GIVEN
    const data = asDataUrl(unicodeToBase64(fromWikiloc), 'application/vnd.google-earth.kml+xml');

    //WHEN
    const computedData = await kmlScopeImporter(data);

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

  it('should import a Kml from RutaBike', async () => {
    //GIVEN
    const data = asDataUrl(unicodeToBase64(fromRutaBike), 'application/vnd.google-earth.kml+xml');

    //WHEN
    const computedData = await kmlScopeImporter(data);

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

  it('should import a Kml from Google Earth', async () => {
    //GIVEN
    const data = asDataUrl(unicodeToBase64(fromGEarth), 'application/vnd.google-earth.kml+xml');

    //WHEN
    const computedData = await kmlScopeImporter(data);

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
    expect(partialComputedData).to.deep.equal(expectedImportedFromGEarth);
    //expect(computedData).to.deep.equal(expectedImportedFromGEarth);

    // THEN
    const computedTrack = computedData?.tracks && computedData.tracks.map(track => track);

    computedTrack && computedTrack.map(track =>
      expect(track.id).to.be.a('string') && expect(track.id).to.have.lengthOf(36) &&
        expect(track.properties.timestamp).to.be.a('number') && expect(Date.now()-track.properties.timestamp).to.be.below(20)
    );

  });

});