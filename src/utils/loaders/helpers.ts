// See https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
import {base64string, dataUrl, mimeType} from './types';

export const base64toUnicode = (base64string: base64string): string => decodeURIComponent(
  Array.prototype.map.call(
    window.atob(base64string), (c) =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join('')
);

export const unicodeToBase64 = (unicodeString: string): base64string => window.btoa(
  encodeURIComponent(unicodeString)
    .replace(/%([0-9A-F]{2})/g, (match, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
);

export const asDataUrl = (base64string: base64string, mimeType: mimeType): dataUrl => `data:${mimeType};base64,${base64string}`;

export const asBlob = (unicodeString: string, mimeType: mimeType) => new Blob([unicodeString], {type: mimeType});
