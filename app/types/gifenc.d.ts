declare module 'gifenc' {
  type GifPalette = number[][]

  type GifFrameOptions = {
    delay?: number
    palette: GifPalette
    repeat?: number
  }

  type GifEncoder = {
    bytes: () => Uint8Array
    finish: () => void
    writeFrame: (index: Uint8Array, width: number, height: number, options: GifFrameOptions) => void
  }

  const gifenc: {
    GIFEncoder: () => GifEncoder
    quantize: (rgba: Uint8Array | Uint8ClampedArray, maxColors: number) => GifPalette
    applyPalette: (rgba: Uint8Array | Uint8ClampedArray, palette: GifPalette) => Uint8Array
  }

  export default gifenc
}
