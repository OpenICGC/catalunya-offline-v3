import hex2dec from './hex2dec';
import {inflate} from 'pako';

onmessage = (e) => {
  hex2dec(e.data).then(uInt8Array => {
    if (uInt8Array[0] === 0x1f && uInt8Array[1] === 0x8b) {
      uInt8Array = inflate(uInt8Array);
    }
    e.ports[0].postMessage(uInt8Array, [uInt8Array.buffer]);
  });
};
