// Stub Mapbox GL
// https://github.com/mapbox/mapbox-gl-js/issues/3436
window.URL.createObjectURL = () => '';

// @ts-expect-error pos no sé
const testsContext = require.context('.', true, /.spec$/);
testsContext.keys().forEach(testsContext);
