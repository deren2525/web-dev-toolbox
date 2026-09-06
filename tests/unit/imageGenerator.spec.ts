import { describe, expect, it } from 'vitest'
import {
  createImageFileName,
  createSeededRandom,
  formatBytes,
  getMaximumImageCount,
  padBlobToTarget,
  sanitizeFileBaseName,
  validateGenerationWorkload,
} from '../../app/utils/imageGenerator'

describe('imageGenerator utils', () => {
  it('バイト数を読みやすい単位へ変換する', () => {
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(1024)).toBe('1 KB')
    expect(formatBytes(1024 * 1024)).toBe('1 MB')
    expect(formatBytes(1.5 * 1024 * 1024)).toBe('1.5 MB')
  })

  it('指定容量に応じて安全な最大枚数を返す', () => {
    expect(getMaximumImageCount(0)).toBe(100)
    expect(getMaximumImageCount(5120)).toBe(50)
    expect(getMaximumImageCount(10240)).toBe(25)
    expect(getMaximumImageCount(102400)).toBe(2)
  })

  it('同じシードから同じ疑似乱数を生成する', () => {
    expect(createSeededRandom(42)).toBe(createSeededRandom(42))
    expect(createSeededRandom(42)).not.toBe(createSeededRandom(43))
    expect(createSeededRandom(42)).toBeGreaterThanOrEqual(0)
    expect(createSeededRandom(42)).toBeLessThan(1)
  })

  it('命名モードと形式に応じたファイル名を生成する', () => {
    expect(createImageFileName(1, 'standard', 'jpeg')).toBe('sample-001.jpg')
    expect(createImageFileName(12, 'japanese', 'png')).toBe('サンプル画像-012.png')
    expect(createImageFileName(3, 'custom', 'webp', '../危険/名前.webp', 4)).toBe(
      '危険-名前-003.webp',
    )
    expect(createImageFileName(1, 'custom', 'gif', 'animation.gif', 1)).toBe('animation.gif')
    expect(createImageFileName(4, 'standard', 'gif')).toBe('sample-004.gif')
  })

  it('カスタムファイル名から危険な文字と余分な拡張子を除去する', () => {
    expect(sanitizeFileBaseName(' ../../sample:image.png ')).toBe('sample-image')
    expect(sanitizeFileBaseName('///')).toBe('sample')
    expect(sanitizeFileBaseName('あ'.repeat(101))).toHaveLength(100)
  })

  it('JPEGをCOMセグメントで指定容量まで拡張する', async () => {
    const source = new Blob([new Uint8Array([0xff, 0xd8, 0xff, 0xd9])], {
      type: 'image/jpeg',
    })
    const padded = await padBlobToTarget(source, 100, 'jpeg')
    const bytes = new Uint8Array(await padded.arrayBuffer())

    expect(padded.size).toBe(100 * 1024)
    expect(padded.type).toBe('image/jpeg')
    expect(Array.from(bytes.slice(-2))).toEqual([0xff, 0xd9])
  })

  it('PNGをIEND直前の補助チャンクで拡張する', async () => {
    const source = new Blob([
      new Uint8Array([
        137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130,
      ]),
    ])
    const padded = await padBlobToTarget(source, 1, 'png')
    const bytes = new Uint8Array(await padded.arrayBuffer())

    expect(padded.size).toBe(1024)
    expect(new TextDecoder().decode(bytes.slice(-8, -4))).toBe('IEND')
    expect(new TextDecoder().decode(bytes.slice(12, 16))).toBe('paDd')
  })

  it('WebPへJUNKチャンクを追加してRIFFサイズを更新する', async () => {
    const sourceBytes = new Uint8Array(12)
    sourceBytes.set(new TextEncoder().encode('RIFF'), 0)
    sourceBytes.set(new TextEncoder().encode('WEBP'), 8)
    const padded = await padBlobToTarget(new Blob([sourceBytes]), 1, 'webp')
    const bytes = new Uint8Array(await padded.arrayBuffer())

    expect(padded.size).toBe(1024)
    expect(new DataView(bytes.buffer).getUint32(4, true)).toBe(1016)
    expect(new TextDecoder().decode(bytes.slice(12, 16))).toBe('JUNK')
  })

  it('GIFへコメント拡張を追加してトレーラーを維持する', async () => {
    const sourceBytes = new Uint8Array(14)
    sourceBytes.set(new TextEncoder().encode('GIF89a'), 0)
    sourceBytes[sourceBytes.length - 1] = 0x3b
    const padded = await padBlobToTarget(new Blob([sourceBytes], { type: 'image/gif' }), 1, 'gif')
    const bytes = new Uint8Array(await padded.arrayBuffer())

    expect(padded.size).toBeGreaterThanOrEqual(1024)
    expect(new TextDecoder().decode(bytes.slice(0, 6))).toBe('GIF89a')
    expect(Array.from(bytes.slice(13, 15))).toEqual([0x21, 0xfe])
    expect(bytes[bytes.length - 1]).toBe(0x3b)
  })

  it('目標容量以上のBlobは変更しない', async () => {
    const source = new Blob([new Uint8Array(2048)])

    expect(await padBlobToTarget(source, 1, 'jpeg')).toBe(source)
    expect(await padBlobToTarget(source, 0, 'jpeg')).toBe(source)
  })

  it('危険な総画素数と推定ZIP容量を拒否する', () => {
    expect(validateGenerationWorkload(4096, 4096, 1, 0, 'jpeg', 'gradient')).toContain('850万画素')
    expect(validateGenerationWorkload(1920, 1080, 100, 0, 'jpeg', 'gradient')).toContain('1億画素')
    expect(validateGenerationWorkload(1000, 1000, 60, 5120, 'jpeg', 'gradient')).toContain('250MB')
  })

  it('一般的な生成条件を許可する', () => {
    expect(validateGenerationWorkload(800, 600, 20, 0, 'jpeg', 'gradient')).toBeNull()
  })
})
