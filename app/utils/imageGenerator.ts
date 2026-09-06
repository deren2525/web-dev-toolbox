export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'gif'
export type FileNameMode = 'standard' | 'japanese' | 'custom'
export type ImagePattern = 'gradient' | 'solid' | 'shapes' | 'noise'

const MAX_PIXELS_PER_IMAGE = 8_500_000
const MAX_TOTAL_PIXELS = 100_000_000
const MAX_ARCHIVE_BYTES = 250 * 1024 * 1024

/**
 * 1枚あたりの目標容量から、安全にZIP生成できる最大枚数を算出する。
 *
 * @param targetKB 1枚あたりの目標容量。0は自動容量
 * @returns 100枚と推定ZIP容量250MBの範囲内に収まる最大枚数
 */
export const getMaximumImageCount = (targetKB: number) => {
  if (targetKB <= 0) return 100
  return Math.max(1, Math.min(100, Math.floor(MAX_ARCHIVE_BYTES / (targetKB * 1024))))
}

/**
 * バイト数を画面表示用のB・KB・MB表記へ変換する。
 *
 * @param bytes 変換するバイト数
 * @returns 単位を付けたファイルサイズ
 */
export const formatBytes = (bytes: number) => {
  if (bytes >= 1048576) {
    return `${(bytes / 1048576).toFixed(bytes % 1048576 ? 1 : 0)} MB`
  }
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`
  return `${Math.round(bytes)} B`
}

/**
 * 同じシードから常に同じ値を返す疑似乱数を生成する。
 *
 * @param seed 画像番号やピクセル位置から作るシード値
 * @returns 0以上1未満の疑似乱数
 */
export const createSeededRandom = (seed: number) => {
  const value = Math.sin(seed * 937.31) * 43758.5453
  return value - Math.floor(value)
}

/**
 * 命名パターン、画像番号、画像形式からファイル名を作成する。
 *
 * @param index ファイル名へ含める画像番号
 * @param mode ファイル名の命名パターン
 * @param format 出力する画像形式
 * @param customBaseName カスタム指定された拡張子なしのベース名
 * @param totalCount 生成する画像の総数
 * @returns 拡張子を含むファイル名
 */
export const createImageFileName = (
  index: number,
  mode: FileNameMode,
  format: ImageFormat,
  customBaseName = 'sample',
  totalCount = 1,
) => {
  const number = String(index).padStart(3, '0')
  const extension = format === 'jpeg' ? 'jpg' : format

  if (mode === 'japanese') return `サンプル画像-${number}.${extension}`
  if (mode === 'custom') {
    const baseName = sanitizeFileBaseName(customBaseName)
    const suffix = totalCount > 1 ? `-${number}` : ''
    return `${baseName}${suffix}.${extension}`
  }
  return `sample-${number}.${extension}`
}

/**
 * ZIP内のパスとして安全に扱えるファイル名のベース部分へ整形する。
 *
 * @param value 利用者が入力したファイル名
 * @returns 危険な記号と既知の画像拡張子を除いた最大100文字のベース名
 */
export const sanitizeFileBaseName = (value: string) => {
  const withoutControlCharacters = Array.from(value)
    .filter((character) => {
      const codePoint = character.codePointAt(0) ?? 0
      return codePoint >= 32 && codePoint !== 127
    })
    .join('')
  const normalized = withoutControlCharacters
    .normalize('NFKC')
    .trim()
    .replace(/\.(?:jpe?g|png|webp|gif)$/i, '')
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[.\s-]+|[.\s-]+$/g, '')
  return Array.from(normalized).slice(0, 100).join('') || 'sample'
}

/**
 * 画像が目標容量より小さい場合に末尾データを追加して容量を調整する。
 *
 * @param blob 容量を調整する画像Blob
 * @param targetKB 目標容量（KB）。0の場合は調整しない
 * @returns 目標容量以上へ調整したBlob
 */
export const padBlobToTarget = async (blob: Blob, targetKB: number, format: ImageFormat) => {
  const targetBytes = targetKB * 1024
  if (!targetBytes || blob.size >= targetBytes) return blob

  const bytes = new Uint8Array(await blob.arrayBuffer())
  const paddedBytes =
    format === 'jpeg'
      ? padJpegWithComments(bytes, targetBytes)
      : format === 'png'
        ? padPngWithAncillaryChunk(bytes, targetBytes)
        : format === 'webp'
          ? padWebPWithJunkChunk(bytes, targetBytes)
          : padGifWithCommentExtension(bytes, targetBytes)

  return new Blob([paddedBytes], { type: blob.type })
}

/**
 * 指定された生成条件がブラウザの安全な処理上限内か検証する。
 *
 * @param width 画像の幅
 * @param height 画像の高さ
 * @param count 生成枚数
 * @param targetKB 1枚あたりの目標容量
 * @param format 画像形式
 * @param pattern 画像パターン
 * @returns 問題がある場合はエラーメッセージ、問題がなければnull
 */
export const validateGenerationWorkload = (
  width: number,
  height: number,
  count: number,
  targetKB: number,
  format: ImageFormat,
  pattern: ImagePattern,
) => {
  if (![width, height, count, targetKB].every(Number.isFinite)) {
    return '入力値には有限の数値を指定してください。'
  }
  if (![width, height, count, targetKB].every(Number.isInteger)) {
    return '幅・高さ・枚数・容量には整数を指定してください。'
  }

  const pixelsPerImage = width * height
  if (pixelsPerImage > MAX_PIXELS_PER_IMAGE) {
    return '1枚あたりの総画素数は850万画素以下にしてください。'
  }
  const frameMultiplier = format === 'gif' ? 2 : 1
  if (pixelsPerImage * count * frameMultiplier > MAX_TOTAL_PIXELS) {
    return '生成画像の総画素数は1億画素以下にしてください。'
  }

  const bytesPerPixel = pattern === 'noise' || format === 'png' ? 4 : format === 'gif' ? 2 : 0.75
  const estimatedImageBytes = Math.max(targetKB * 1024, pixelsPerImage * bytesPerPixel)
  if (estimatedImageBytes * count > MAX_ARCHIVE_BYTES) {
    return '推定ZIP容量が250MBを超えます。サイズ・枚数・形式を減らしてください。'
  }

  return null
}

/**
 * JPEGのEOI直前へCOMセグメントを挿入し、正規構造のまま容量を増やす。
 *
 * @param source 元のJPEGバイト列
 * @param targetBytes 目標バイト数
 * @returns コメントセグメントを追加したJPEGバイト列
 */
const padJpegWithComments = (source: Uint8Array, targetBytes: number) => {
  if (
    source.length < 4 ||
    source[0] !== 0xff ||
    source[1] !== 0xd8 ||
    source[source.length - 2] !== 0xff ||
    source[source.length - 1] !== 0xd9
  ) {
    throw new Error('JPEGデータの構造を確認できませんでした。')
  }

  const segments: Uint8Array[] = []
  let remaining = targetBytes - source.length
  while (remaining > 0) {
    const segmentSize = remaining < 4 ? 4 : Math.min(65_537, remaining)
    const segment = new Uint8Array(segmentSize)
    const declaredLength = segmentSize - 2
    segment[0] = 0xff
    segment[1] = 0xfe
    segment[2] = declaredLength >> 8
    segment[3] = declaredLength & 0xff
    segments.push(segment)
    remaining -= segmentSize
  }

  return concatenateBytes(source.subarray(0, -2), ...segments, source.slice(-2))
}

/**
 * PNGのIEND直前へプライベート補助チャンクを挿入して容量を増やす。
 *
 * @param source 元のPNGバイト列
 * @param targetBytes 目標バイト数
 * @returns 補助チャンクを追加したPNGバイト列
 */
const padPngWithAncillaryChunk = (source: Uint8Array, targetBytes: number) => {
  const signature = [137, 80, 78, 71, 13, 10, 26, 10]
  if (
    source.length < 20 ||
    !signature.every((byte, index) => source[index] === byte) ||
    String.fromCharCode(...source.subarray(source.length - 8, source.length - 4)) !== 'IEND'
  ) {
    throw new Error('PNGデータの構造を確認できませんでした。')
  }

  const requiredBytes = Math.max(12, targetBytes - source.length)
  const dataLength = requiredBytes - 12
  const chunkType = new TextEncoder().encode('paDd')
  const chunk = new Uint8Array(dataLength + 12)
  const view = new DataView(chunk.buffer)
  view.setUint32(0, dataLength)
  chunk.set(chunkType, 4)
  view.setUint32(8 + dataLength, crc32(chunk.subarray(4, 8 + dataLength)))

  return concatenateBytes(source.subarray(0, -12), chunk, source.slice(-12))
}

/**
 * WebPのRIFFコンテナへJUNKチャンクを追加し、RIFFサイズも更新する。
 *
 * @param source 元のWebPバイト列
 * @param targetBytes 目標バイト数
 * @returns JUNKチャンクを追加したWebPバイト列
 */
const padWebPWithJunkChunk = (source: Uint8Array, targetBytes: number) => {
  if (
    source.length < 12 ||
    String.fromCharCode(...source.subarray(0, 4)) !== 'RIFF' ||
    String.fromCharCode(...source.subarray(8, 12)) !== 'WEBP'
  ) {
    throw new Error('WebPデータの構造を確認できませんでした。')
  }

  const requiredBytes = Math.max(8, targetBytes - source.length)
  const dataLength = requiredBytes - 8
  const paddedDataLength = dataLength + (dataLength % 2)
  const chunk = new Uint8Array(8 + paddedDataLength)
  chunk.set(new TextEncoder().encode('JUNK'), 0)
  new DataView(chunk.buffer).setUint32(4, dataLength, true)

  const result = concatenateBytes(source, chunk)
  new DataView(result.buffer).setUint32(4, result.length - 8, true)
  return result
}

/**
 * GIFのトレーラー直前へコメント拡張を追加して容量を増やす。
 *
 * @param source 元のGIFバイト列
 * @param targetBytes 目標バイト数
 * @returns コメント拡張を追加したGIFバイト列
 */
const padGifWithCommentExtension = (source: Uint8Array, targetBytes: number) => {
  const signature = new TextDecoder().decode(source.subarray(0, 6))
  if (
    source.length < 14 ||
    (signature !== 'GIF87a' && signature !== 'GIF89a') ||
    source[source.length - 1] !== 0x3b
  ) {
    throw new Error('GIFデータの構造を確認できませんでした。')
  }

  const requiredBytes = targetBytes - source.length
  let dataLength = Math.max(0, requiredBytes - 3)
  while (dataLength + Math.ceil(dataLength / 255) + 3 < requiredBytes) {
    dataLength++
  }

  const extension = new Uint8Array(3 + dataLength + Math.ceil(dataLength / 255))
  extension[0] = 0x21
  extension[1] = 0xfe
  let sourceOffset = 0
  let targetOffset = 2
  while (sourceOffset < dataLength) {
    const blockLength = Math.min(255, dataLength - sourceOffset)
    extension[targetOffset] = blockLength
    targetOffset += blockLength + 1
    sourceOffset += blockLength
  }
  extension[extension.length - 1] = 0

  return concatenateBytes(source.subarray(0, -1), extension, source.slice(-1))
}

/**
 * 複数のバイト列を1つのUint8Arrayへ結合する。
 *
 * @param chunks 結合するバイト列
 * @returns 結合済みのバイト列
 */
const concatenateBytes = (...chunks: Uint8Array[]) => {
  const result = new Uint8Array(chunks.reduce((total, chunk) => total + chunk.length, 0))
  let offset = 0
  for (const chunk of chunks) {
    result.set(chunk, offset)
    offset += chunk.length
  }
  return result
}

/**
 * PNGチャンクで使用するCRC-32チェックサムを計算する。
 *
 * @param bytes チェックサム対象のバイト列
 * @returns 符号なしCRC-32値
 */
const crc32 = (bytes: Uint8Array) => {
  let crc = 0xffffffff
  for (const byte of bytes) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}
