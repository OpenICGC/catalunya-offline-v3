export const getSignificantDistanceUnits = (distance: number) => {
  if(distance) {
    return distance > 10000 ?
      distance > 1000000 ? `${(distance / 1000).toFixed()} km`
        : `${(distance / 1000).toFixed(2)} km`
      : `${distance.toFixed()} m`;
  } else return undefined;
};