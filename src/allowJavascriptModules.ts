// esto es un hack que viene de aqui https://blog.atomist.com/declaration-file-fix/
//declare module 'nombre-de-la-libreria-que-no-tiene-tipado';
declare module '*.geojson';
declare module '*.xml' {
  const doc: string;
  export default doc;
}
