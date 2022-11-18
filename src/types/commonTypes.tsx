export type MapStyle = {
  label: string,
  thumbnail: string,
  id: string
}

export type MapStyles = Array<MapStyle>

export type Manager = 'LAYERS' | 'BASEMAPS' | 'SCOPES' | undefined;

//FIXME ver que tipos llegan aqui para poder tiparlos bien
// Averiguar si los dos sitios donde de usa hace referencia a lo mismo o son cosas distintas
export type Geolocation = {
  accuracy?: any,
  altitude?: any,
  altitudeAccuracy?: any,
  bearing?: any,
  latitude?: any,
  longitude?: any,
  speed?: any,
  time: number,
  heading?: any,
}

export type GenericError = {
  code: number,
  message: string
}