// Generates a branded 1200x630 OG image (public/og-image.png) using only
// Node built-ins (zlib deflate + PNG chunks). No external dependencies.
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const W = 1200;
const H = 630;

// --- Simple 5x7 bitmap font for uppercase A-Z, 0-9, and a few symbols ---
const FONT = {
  A: ['01110','10001','10001','11111','10001','10001','10001'],
  B: ['11110','10001','10001','11110','10001','10001','11110'],
  C: ['01111','10000','10000','10000','10000','10000','01111'],
  D: ['11110','10001','10001','10001','10001','10001','11110'],
  E: ['11111','10000','10000','11110','10000','10000','11111'],
  F: ['11111','10000','10000','11110','10000','10000','10000'],
  G: ['01111','10000','10000','10111','10001','10001','01111'],
  H: ['10001','10001','10001','11111','10001','10001','10001'],
  I: ['11111','00100','00100','00100','00100','00100','11111'],
  J: ['00111','00010','00010','00010','10010','10010','01100'],
  K: ['10001','10010','10100','11000','10100','10010','10001'],
  L: ['10000','10000','10000','10000','10000','10000','11111'],
  M: ['10001','11011','10101','10101','10001','10001','10001'],
  N: ['10001','10001','11001','10101','10011','10001','10001'],
  O: ['01110','10001','10001','10001','10001','10001','01110'],
  P: ['11110','10001','10001','11110','10000','10000','10000'],
  Q: ['01110','10001','10001','10001','10101','10010','01101'],
  R: ['11110','10001','10001','11110','10100','10010','10001'],
  S: ['01111','10000','10000','01110','00001','00001','11110'],
  T: ['11111','00100','00100','00100','00100','00100','00100'],
  U: ['10001','10001','10001','10001','10001','10001','01110'],
  V: ['10001','10001','10001','10001','10001','01010','00100'],
  W: ['10001','10001','10001','10101','10101','10101','01010'],
  X: ['10001','10001','01010','00100','01010','10001','10001'],
  Y: ['10001','10001','01010','00100','00100','00100','00100'],
  Z: ['11111','00001','00010','00100','01000','10000','11111'],
  '0': ['01110','10001','10011','10101','11001','10001','01110'],
  '1': ['00100','01100','00100','00100','00100','00100','01110'],
  '2': ['01110','10001','00001','00110','01000','10000','11111'],
  '3': ['11110','00001','00001','01110','00001','00001','11110'],
  '4': ['00010','00110','01010','10010','11111','00010','00010'],
  '5': ['11111','10000','10000','11110','00001','00001','11110'],
  '6': ['01110','10000','10000','11110','10001','10001','01110'],
  '7': ['11111','00001','00010','00100','01000','01000','01000'],
  '8': ['01110','10001','10001','01110','10001','10001','01110'],
  '9': ['01110','10001','10001','01111','00001','00001','01110'],
  '-': ['00000','00000','00000','11111','00000','00000','00000'],
  '.': ['00000','00000','00000','00000','00000','00000','00100'],
  ',': ['00000','00000','00000','00000','00100','00100','01000'],
  "'": ['00100','00100','01000','00000','00000','00000','00000'],
  ' ': ['00000','00000','00000','00000','00000','00000','00000'],
};

function drawText(ctx, text, x, y, scale, color) {
  const stride = 6; // 5px glyph + 1px gap
  let cursor = x;
  for (const ch of text.toUpperCase()) {
    const glyph = FONT[ch];
    if (!glyph) { cursor += stride * scale; continue; }
    for (let r = 0; r < 7; r++) {
      const row = glyph[r];
      for (let c = 0; c < 5; c++) {
        if (row[c] === '1') {
          for (let dy = 0; dy < scale; dy++) {
            for (let dx = 0; dx < scale; dx++) {
              ctx.setPixel(cursor + c * scale + dx, y + r * scale + dy, color);
            }
          }
        }
      }
    }
    cursor += stride * scale;
  }
  return cursor;
}

function main() {
  // Pixel buffer as [r,g,b,a]
  const pixels = new Uint8Array(W * H * 4);

  const ctx = {
    setPixel(x, y, [r, g, b, a = 255]) {
      if (x < 0 || y < 0 || x >= W || y >= H) return;
      const i = (y * W + x) * 4;
      pixels[i] = r; pixels[i + 1] = g; pixels[i + 2] = b; pixels[i + 3] = a;
    },
    fillRect(x0, y0, x1, y1, color) {
      for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) this.setPixel(x, y, color);
    },
    blendRect(x0, y0, x1, y1, color) {
      for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
        const i = (y * W + x) * 4;
        const a = color[3] / 255;
        pixels[i] = Math.round(color[0] * a + pixels[i] * (1 - a));
        pixels[i + 1] = Math.round(color[1] * a + pixels[i + 1] * (1 - a));
        pixels[i + 2] = Math.round(color[2] * a + pixels[i + 2] * (1 - a));
      }
    },
  };

  // Background: deep gradient (dark slate -> accent purple/pink)
  const top = [26, 26, 32];       // #1A1A20
  const bottom = [80, 25, 64];    // #501940
  for (let y = 0; y < H; y++) {
    const t = y / (H - 1);
    const r = Math.round(top[0] + (bottom[0] - top[0]) * t);
    const g = Math.round(top[1] + (bottom[1] - top[1]) * t);
    const b = Math.round(top[2] + (bottom[2] - top[2]) * t);
    ctx.fillRect(0, y, W, y + 1, [r, g, b]);
  }

  // Accent horizontal line
  ctx.fillRect(0, 330, W, 6, [216, 65, 91]); // accent pink #D8415B

  // Name (large)
  const nameColor = [255, 255, 255];
  const nameScale = 14; // 5*14=70px tall
  const nameText = 'Shariful Haque';
  const nameW = nameText.length * 6 * nameScale;
  drawText(ctx, nameText, (W - nameW) / 2, 140, nameScale, nameColor);

  // Tagline (small)
  const tagColor = [235, 235, 240];
  const tagScale = 5; // 35px tall
  const tagText = "Researcher  •  Data Analyst  •  Author";
  const tagW = tagText.length * 6 * tagScale;
  drawText(ctx, tagText, (W - tagW) / 2, 400, tagScale, tagColor);

  // Website URL (small, bottom)
  const urlColor = [190, 190, 200];
  const urlScale = 4;
  const urlText = 'www.sharifulhaque.org';
  const urlW = urlText.length * 6 * urlScale;
  drawText(ctx, urlText, (W - urlW) / 2, 500, urlScale, urlColor);

  // --- PNG encoding ---
  const raw = Buffer.alloc((W * 4 + 1) * H);
  const pixelBuf = Buffer.from(pixels.buffer);
  for (let y = 0; y < H; y++) {
    raw[y * (W * 4 + 1)] = 0; // filter: none
    pixelBuf.copy(raw, y * (W * 4 + 1) + 1, y * W * 4, (y + 1) * W * 4);
  }

  function crc32(buf) {
    let c, crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = (crc ^ buf[i]) & 0xff;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      crc = (crc >>> 8) ^ c;
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);

  const outPath = path.join(__dirname, '..', 'public', 'og-image.png');
  fs.writeFileSync(outPath, png);
  console.log(`Wrote ${outPath} (${png.length} bytes)`);
}

main();
