import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  L: number[];
  S: number[];
  hueRanges: { min: number, max: number }[];

  constructor() {
    const options: any = {};
    let LS = [options.lightness, options.saturation].map(function (param) {
      param = param || [0.35, 0.5, 0.65]; // note that 3 is a prime
      return Array.isArray(param) ? param.concat() : [param];
    });

    this.L = LS[0];
    this.S = LS[1];

    if (typeof options.hue === 'number') {
      options.hue = { min: options.hue, max: options.hue };
    }
    if (typeof options.hue === 'object' && !Array.isArray(options.hue)) {
      options.hue = [options.hue];
    }
    if (typeof options.hue === 'undefined') {
      options.hue = [];
    }
    this.hueRanges = options.hue.map(function (range: { min: number, max: number }) {
      return {
        min: typeof range.min === 'undefined' ? 0 : range.min,
        max: typeof range.max === 'undefined' ? 360 : range.max
      };
    });
  }

  /**
   * BKDR Hash (modified version)
   *
   * @param str string to hash
   */
  hash(str: string): number {
    let seed = 131;
    let seed2 = 137;
    let hash = 0;
    // make hash more sensitive for short string like 'a', 'b', 'c'
    str += 'x';
    // Note: Number.MAX_SAFE_INTEGER equals 9007199254740991
    const maxSafeInteger: number = Math.round(9007199254740991 / seed2);
    for (let i = 0; i < str.length; i++) {
      if (hash > maxSafeInteger) {
        hash = Math.round(hash / seed2);
      }
      hash = hash * seed + str.charCodeAt(i);
    }
    return hash;
  };

  /**
 * Convert RGB Array to HEX
 *
 * @param RGBArray - [R, G, B]
 * @returns 6 digits hex starting with #
 */
  rgb2hex(RGBArray: number[]): string {
    let hex = '#';
    RGBArray.forEach(function (value) {
      if (value < 16) {
        hex += 0;
      }
      hex += value.toString(16);
    });
    return hex;
  };

  /**
   * Convert HSL to RGB
   *
   * @see {@link http://zh.wikipedia.org/wiki/HSL和HSV色彩空间} for further information.
   * @param H Hue ∈ [0, 360)
   * @param S Saturation ∈ [0, 1]
   * @param L Lightness ∈ [0, 1]
   * @returns R, G, B ∈ [0, 255]
   */
  hsl2rgb(H: number, S: number, L: number): number[] {
    H /= 360;

    let q = L < 0.5 ? L * (1 + S) : L + S - L * S;
    let p = 2 * L - q;

    return [H + 1 / 3, H, H - 1 / 3].map(function (color) {
      if (color < 0) {
        color++;
      }
      if (color > 1) {
        color--;
      }
      if (color < 1 / 6) {
        color = p + (q - p) * 6 * color;
      } else if (color < 0.5) {
        color = q;
      } else if (color < 2 / 3) {
        color = p + (q - p) * 6 * (2 / 3 - color);
      } else {
        color = p;
      }
      return Math.round(color * 255);
    });
  };


  /**
   * Returns the hash in [h, s, l].
   * Note that H ∈ [0, 360); S ∈ [0, 1]; L ∈ [0, 1];
   *
   * @param str string to hash
   * @returns [h, s, l]
   */
  hsl(str: string): any[] {
    let H;
    let S;
    let L;
    let hash = this.hash(str);

    if (this.hueRanges.length) {
      let range = this.hueRanges[hash % this.hueRanges.length];
      let hueResolution = 727; // note that 727 is a prime
      H = ((hash / this.hueRanges.length) % hueResolution) * (range.max - range.min) / hueResolution + range.min;
    } else {
      H = hash % 359; // note that 359 is a prime
    }
    hash = Math.round(hash / 360);
    S = this.S[hash % this.S.length];
    hash = Math.round(hash / this.S.length);
    L = this.L[hash % this.L.length];

    return [H, S, L];
  };

  /**
   * Returns the hash in [r, g, b].
   * Note that R, G, B ∈ [0, 255]
   *
   * @param str string to hash
   * @returns [r, g, b]
   */
  rgb(str: string): number[] {
    let hsl = this.hsl(str);
    return this.hsl2rgb(hsl[0], hsl[1], hsl[2]);
  };

  /**
   * Returns the hash in hex
   *
   * @param str string to hash
   * @returns hex with #
   */
  hex(str: string): string {
    let rgb = this.rgb(str);
    return this.rgb2hex(rgb);
  };
}
