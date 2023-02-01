import {Scope, ScopePoint, ScopeTrack} from '../types/commonTypes';
import Mustache from 'mustache';
import {useScopePoints, useScopeTracks} from './useStoredCollections';
import {v4 as uuidv4} from 'uuid';

const scopeId = uuidv4();
/*const scope: Scope = {
  id: scopeId,
  name: 'Scope 1',
  color: '#973572'
};
const scopePointList: ScopePoint[] = [
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
const scopeTrackList: ScopeTrack[] = [
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
];*/
export const useKmlExport = (scope: Scope) => {
  const pointStore = useScopePoints(scope.id);
  const trackStore = useScopeTracks(scope.id);
  const scopePointList = pointStore.list();
  const scopeTrackList = trackStore.list();
    
  const formattedPoints = scopePointList.map(point => ({
    ...point,
    properties: {
      ...point.properties,
      color: point.properties.color && 'ff'+point.properties.color.slice(1,7)
    }
  }));
  
  
  const formattedTracks = scopeTrackList.map(track => ({
    ...track,
    properties: {
      ...track.properties,
      color: track.properties.color && 'ff'+track.properties.color.slice(1,7)
    }
  }));

  const data = {
    scope: scope,
    points: formattedPoints,
    tracks: formattedTracks
  };

  const kml = Mustache.render(
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
      '<Document>\n' +
        '<name>{{scope.name}}</name>\n' +
        '<open>1</open>\n' +
        '<!-- TRACK STYLES -->\n' +
            '{{#tracks}}\n' +
                '<Style id="{{id}}-normal">\n' +
                    '<LineStyle>\n' +
                        '<color>ff973572</color>\n' +
                        '<width>5</width>\n' +
                    '</LineStyle>\n' +
                '</Style>\n' +
                '<Style id="{{id}}-highlight">\n' +
                    '<LineStyle>\n' +
                        '<color>ff973572</color>\n' +
                        '<width>7</width>\n' +
                    '</LineStyle>\n' +
                '</Style>\n' +
                '<StyleMap id="{{id}}">\n' +
                    '<Pair>\n' +
                        '<key>normal</key>\n' +
                        '<styleUrl>#{{id}}-normal</styleUrl>\n' +
                    '</Pair>\n' +
                    '<Pair>\n' +
                        '<key>highlight</key>\n' +
                        '<styleUrl>#{{id}}-highlight</styleUrl>\n' +
                    '</Pair>\n' +
                '</StyleMap>\n' +
            '{{/tracks}}\n' +
        '<!-- POINT STYLES -->\n' +
            '{{#points}}\n' +
                '<Style id="{{id}}-normal">\n' +
                    '<IconStyle>\n' +
                        '<color>ff973572</color>\n' +
                    '</IconStyle>\n' +
                    '<LabelStyle>\n' +
                        '<scale>1</scale>\n' +
                    '</LabelStyle>\n' +
                '</Style>\n' +
                '<Style id="{{id}}-highlight">\n' +
                    '<IconStyle>\n' +
                        '<color>ff973572</color>\n' +
                    '</IconStyle>\n' +
                    '<LabelStyle>\n' +
                        '<scale>1.1</scale>\n' +
                    '</LabelStyle>\n' +
                '</Style>\n' +
                '<StyleMap id="{{id}}">\n' +
                    '<Pair>\n' +
                        '<key>normal</key>\n' +
                        '<styleUrl>#{{id}}-normal</styleUrl>\n' +
                    '</Pair>\n' +
                    '<Pair>\n' +
                        '<key>highlight</key>\n' +
                        '<styleUrl>#{{id}}-highlight</styleUrl>\n' +
                    '</Pair>\n' +
                '</StyleMap>\n' +
            '{{/points}}\n' +
        '<!-- POINT FOLDER -->\n' +
          '<Folder>\n' +
              '<name>Points</name>\n' +
              '<open>1</open>\n' +
              '{{#points}}\n' +
                '<Placemark>\n' +
                    '<name>{{properties.name}}</name>\n' +
                    '<description>{{properties.description}}</description>\n' +
                    '<styleUrl>#{{id}}</styleUrl>\n' +
                    '<Point>\n' +
                        '<coordinates>{{geometry.coordinates.0}}, {{geometry.coordinates.1}}, {{geometry.coordinates.2}}</coordinates>\n' +
                    '</Point>\n' +
                '</Placemark>\n' +
              '{{/points}}\n' +
          '</Folder>\n' +
        '<!-- TRACK FOLDER -->\n' +
          '<Folder>\n' +
            '<name>Tracks</name>\n' +
          '<open>1</open>\n' +
              '{{#tracks}}\n' +
                '<Placemark>\n' +
                    '<name>{{properties.name}}</name>\n' +
                    '<description>{{properties.description}}</description>\n' +
                    '<styleUrl>#{{id}}</styleUrl>\n' +
                    '<LineString>\n' +
                        '<tessellate>1</tessellate>\n' +
                        '<coordinates>\n' +
                            '{{#geometry.coordinates}}\n' +
                                '{{.}} \n' +
                            '{{/geometry.coordinates}}\n' +
                        '</coordinates>\n' +
                    '</LineString>\n' +
                '</Placemark>\n' +
              '{{/tracks}}\n' +
          '</Folder>\n' +
          '</Document>\n' +
          '</kml>',
    data);

  /*const kml = Mustache.render(
    `<?xml version="1.0" encoding="UTF-8"?>
      <kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
      <Document>
        <name>{{scope.name}}</name>
        <open>1</open>
        <!-- TRACK STYLES -->
            {{#tracks}}
                <Style id="{{id}}-normal">
                    <LineStyle>
                        <color>ff973572</color>
                        <width>5</width>
                    </LineStyle>
                </Style>
                <Style id="{{id}}-highlight">
                    <LineStyle>
                        <color>ff973572</color>
                        <width>7</width>
                    </LineStyle>
                </Style>
                <StyleMap id="{{id}}">
                    <Pair>
                        <key>normal</key>
                        <styleUrl>#{{id}}-normal</styleUrl>
                    </Pair>
                    <Pair>
                        <key>highlight</key>
                        <styleUrl>#{{id}}-highlight</styleUrl>
                    </Pair>
                </StyleMap>
            {{/tracks}}
        <!-- POINT STYLES -->
            {{#points}}
                <Style id="{{id}}-normal">
                    <IconStyle>
                        <color>ff973572</color>
                    </IconStyle>
                    <LabelStyle>
                        <scale>1</scale>
                    </LabelStyle>
                </Style>
                <Style id="{{id}}-highlight">
                    <IconStyle>
                        <color>ff973572</color>
                    </IconStyle>
                    <LabelStyle>
                        <scale>1.1</scale>
                    </LabelStyle>
                </Style>
                <StyleMap id="{{id}}">
                    <Pair>
                        <key>normal</key>
                        <styleUrl>#{{id}}-normal</styleUrl>
                    </Pair>
                    <Pair>
                        <key>highlight</key>
                        <styleUrl>#{{id}}-highlight</styleUrl>
                    </Pair>
                </StyleMap>
            {{/points}}
        <!-- POINT FOLDER -->
          <Folder>
              <name>Points</name>
              <open>1</open>
              {{#points}}
                <Placemark>
                    <name>{{properties.name}}</name>
                    <description>{{properties.description}}</description>
                    <styleUrl>#{{id}}</styleUrl>
                    <Point>
                        <coordinates>{{geometry.coordinates.0}}, {{geometry.coordinates.1}}, {{geometry.coordinates.2}}</coordinates>
                    </Point>
                </Placemark>
              {{/points}}
          </Folder>
        <!-- TRACK FOLDER -->
          <Folder>
            <name>Tracks</name>
          <open>1</open>
              {{#tracks}}
                <Placemark>
                    <name>{{properties.name}}</name>
                    <description>{{properties.description}}</description>
                    <styleUrl>#{{id}}</styleUrl>
                    <LineString>
                        <tessellate>1</tessellate>
                        <coordinates>
                            {#geometry.coordinates}}
                                {{.}} 
                            {{/geometry.coordinates}}
                        </coordinates>
                    </LineString>
                </Placemark>
              {{/tracks}}
          </Folder>
          </Document>
          </kml>`,
    data);*/

  return kml;
  //console.log(kml);
};