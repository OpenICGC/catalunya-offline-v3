// Code from https://github.com/fabiospampinato/hex-encoding

const DEC2HEX = (() => {
  const alphabet = '0123456789abcdef';
  const dec2hex16 = [...alphabet];
  const dec2hex256 = new Array(256);

  for ( let i = 0; i < 256; i++ ) {
    dec2hex256[i] = `${dec2hex16[(i >>> 4) & 0xF]}${dec2hex16[i & 0xF]}`;
  }
  return dec2hex256;
})();

const HEX2DEC = (() => {
  const hex2dec: { [key: string]: number; }  = {};

  for ( let i = 0; i < 256; i++ ) {
    const hex = DEC2HEX[i];
    const firstLower = hex[0];
    const firstUpper = firstLower.toUpperCase();
    const lastLower = hex[1];
    const lastUpper = lastLower.toUpperCase();

    hex2dec[hex] = i;
    hex2dec[`${firstLower}${lastUpper}`] = i;
    hex2dec[`${firstUpper}${lastLower}`] = i;
    hex2dec[`${firstUpper}${lastUpper}`] = i;
  }

  return hex2dec;
})();

const hex2dec = (data: string) => new Promise<Uint8Array>(resolve => {
  const length = data.length / 2;
  const u8 = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    u8[i] = HEX2DEC[data.slice(i * 2, (i * 2) + 2)];
  }
  resolve(u8);
});

export default hex2dec;
