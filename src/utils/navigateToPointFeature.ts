import {Feature, LineString, Position} from 'geojson';

interface FeatureProperties {
  bearing: number;
  distance: number;
}
const navigateToPointFeature = (from: Position, to: Position): Feature<LineString, FeatureProperties> => {
  // Formulae from https://www.movable-type.co.uk/scripts/latlong.html
  const [lon1, lat1] = from;
  const [lon2, lat2] = to;

  // Distance (haversine)
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180; // φ, λ in radians
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // in metres

  // Bearing
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1)*Math.sin(φ2) -
            Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  const bearing = (θ*180/Math.PI + 360) % 360; // in degrees

  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [from, to]
    },
    properties: {
      bearing,
      distance
    }
  };
};

export default navigateToPointFeature;
