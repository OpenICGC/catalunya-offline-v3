// Stub Mapbox GL
// https://github.com/mapbox/mapbox-gl-js/issues/3436
window.URL.createObjectURL = function() {};

// eslint-disable-next-line no-undef
const testsContext = require.context('.', true, /.spec$/);
testsContext.keys().forEach(testsContext);
