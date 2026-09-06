import JSZip from 'jszip'
import gifenc from 'gifenc'
import {
  createImageFileName,
  createSeededRandom as random,
  formatBytes,
  getMaximumImageCount,
  padBlobToTarget,
  validateGenerationWorkload,
} from '~/utils/imageGenerator'
import type { FileNameMode, ImageFormat, ImagePattern } from '~/utils/imageGenerator'

const { applyPalette, GIFEncoder, quantize } = gifenc

/**
 * サンプル画像ジェネレーターの設定、プレビュー、ZIP生成処理を提供する。
 *
 * @returns 画面で利用するリアクティブな状態と操作関数
 */
export const useImageGenerator = () => {
  const preview = ref<HTMLCanvasElement>()
  const width = ref(800)
  const height = ref(600)
  const count = ref(20)
  const format = ref<ImageFormat>('jpeg')
  const targetKB = ref(0)
  const pattern = ref<ImagePattern>('gradient')
  const solidColor = ref('#356859')
  const gradientStartColor = ref('#d55f39')
  const gradientEndColor = ref('#18352c')
  const nameMode = ref<FileNameMode>('standard')
  const customFileName = ref('sample-image')
  const showNumber = ref(true)
  const showDimensions = ref(true)
  const showSize = ref(true)
  const generating = ref(false)
  const progress = ref(0)
  const error = ref('')
  let previewAnimationTimer: ReturnType<typeof setInterval> | undefined
  let previewTitleVisible = true

  const formatName = computed(() => (format.value === 'jpeg' ? 'JPG' : format.value.toUpperCase()))
  const totalSize = computed(() =>
    targetKB.value
      ? formatBytes(targetKB.value * 1024 * count.value)
      : `約 ${formatBytes(width.value * height.value * count.value * (format.value === 'png' ? 1 : 0.22))}`,
  )
  const maxCount = computed(() => getMaximumImageCount(targetKB.value))

  const presets = [
    ['正方形', 100, 100],
    ['OGP', 1200, 630],
    ['フルHD', 1920, 1080],
    ['縦長', 1080, 1920],
  ] as const

  const setPreset = (preset: (typeof presets)[number]) => {
    width.value = preset[1]
    height.value = preset[2]
  }

  const patternOptions: {
    value: ImagePattern
    label: string
    note?: string
  }[] = [
    {
      value: 'gradient',
      label: 'グラデーション',
    },
    { value: 'solid', label: '単色' },
    {
      value: 'shapes',
      label: 'ランダム模様',
      note: '画像ごとに模様が違うよ',
    },
    {
      value: 'noise',
      label: 'ノイズ風',
      note: '圧縮されにくく容量テスト向き',
    },
  ]

  /**
   * 選択中の設定に従ってCanvasへサンプル画像を描画する。
   *
   * @param canvas 描画先のCanvas要素
   * @param index ファイル名と画像内容に使用する画像番号
   * @param includeTitle 画像内のタイトル情報を表示するか
   */
  const draw = (canvas: HTMLCanvasElement, index: number, includeTitle = true) => {
    const canvasWidth = Math.max(1, Math.min(4096, Number(width.value)))
    const canvasHeight = Math.max(1, Math.min(4096, Number(height.value)))
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    const context = canvas.getContext('2d')!
    const hue = Math.floor(random(index + 5) * 360)

    if (pattern.value === 'gradient') {
      const gradient = context.createLinearGradient(0, 0, canvasWidth, canvasHeight)
      gradient.addColorStop(0, gradientStartColor.value)
      gradient.addColorStop(1, gradientEndColor.value)
      context.fillStyle = gradient
      context.fillRect(0, 0, canvasWidth, canvasHeight)
    } else if (pattern.value === 'solid') {
      context.fillStyle = solidColor.value
      context.fillRect(0, 0, canvasWidth, canvasHeight)
    } else if (pattern.value === 'shapes') {
      context.fillStyle = `hsl(${hue} 35% 13%)`
      context.fillRect(0, 0, canvasWidth, canvasHeight)
      for (let indexOffset = 0; indexOffset < 20; indexOffset++) {
        const size =
          Math.min(canvasWidth, canvasHeight) * (0.06 + random(index * 41 + indexOffset) * 0.3)
        context.fillStyle = `hsla(${(hue + indexOffset * 23) % 360} 75% 60% / ${0.2 + random(index * 61 + indexOffset) * 0.6})`
        context.fillRect(
          random(index * 71 + indexOffset) * canvasWidth - size / 2,
          random(index * 91 + indexOffset) * canvasHeight - size / 2,
          size,
          size,
        )
      }
    } else {
      const pixels = context.createImageData(canvasWidth, canvasHeight)
      for (let pixel = 0; pixel < pixels.data.length; pixel += 4) {
        const x = (pixel / 4) % canvasWidth
        const y = Math.floor(pixel / 4 / canvasWidth)
        const wave = Math.sin(x / 35 + index) * 25 + Math.cos(y / 50) * 22
        const grain = random(pixel + index * 99991) * 75
        pixels.data[pixel] = 48 + wave + grain
        pixels.data[pixel + 1] = 84 + wave * 0.5 + grain
        pixels.data[pixel + 2] = 112 - wave * 0.25 + grain
        pixels.data[pixel + 3] = 255
      }
      context.putImageData(pixels, 0, 0)
    }

    if (!includeTitle) return

    const lines = []
    if (showNumber.value) lines.push(`#${String(index).padStart(3, '0')}`)
    if (showDimensions.value) lines.push(`${canvasWidth} × ${canvasHeight}`)
    if (showSize.value) {
      lines.push(targetKB.value ? `TARGET ${formatBytes(targetKB.value * 1024)}` : formatName.value)
    }
    if (!lines.length) return

    const fontSize = Math.max(13, Math.min(canvasWidth, canvasHeight) * 0.065)
    context.font = `700 ${fontSize}px ui-monospace, monospace`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    const lineHeight = fontSize * 1.3
    const boxWidth = Math.min(
      canvasWidth * 0.86,
      Math.max(...lines.map((line) => context.measureText(line).width)) + fontSize * 2,
    )
    const boxHeight = lines.length * lineHeight + fontSize
    context.fillStyle = 'rgba(7,15,13,.64)'
    context.beginPath()
    context.roundRect(
      (canvasWidth - boxWidth) / 2,
      (canvasHeight - boxHeight) / 2,
      boxWidth,
      boxHeight,
      Math.min(24, fontSize / 2),
    )
    context.fill()
    context.fillStyle = '#fff'
    lines.forEach((line, lineIndex) =>
      context.fillText(
        line,
        canvasWidth / 2,
        canvasHeight / 2 + (lineIndex - (lines.length - 1) / 2) * lineHeight,
      ),
    )
  }

  /**
   * Canvasの内容を選択中の画像形式でBlobへ変換する。
   *
   * @param canvas 変換対象のCanvas要素
   * @returns 画像データを含むBlob
   */
  const toBlob = (canvas: HTMLCanvasElement) =>
    new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('画像を生成できませんでした。'))),
        `image/${format.value}`,
        format.value === 'png' ? undefined : 0.88,
      ),
    )

  /**
   * タイトルの表示・非表示が切り替わる2フレームのGIFを生成する。
   *
   * @param canvas GIFフレームの描画に利用するCanvas要素
   * @param index ファイル名と画像内容に使用する画像番号
   * @returns 無限ループするアニメーションGIF
   */
  const createAnimatedGifBlob = (canvas: HTMLCanvasElement, index: number) => {
    const encoder = GIFEncoder()
    for (const includeTitle of [true, false]) {
      draw(canvas, index, includeTitle)
      const context = canvas.getContext('2d')!
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
      const palette = quantize(pixels, 256)
      encoder.writeFrame(applyPalette(pixels, palette), canvas.width, canvas.height, {
        palette,
        delay: 800,
        repeat: 0,
      })
    }
    encoder.finish()
    const bytes = encoder.bytes()
    return new Blob([bytes.slice().buffer as ArrayBuffer], {
      type: 'image/gif',
    })
  }

  /**
   * 選択中の形式に応じて静止画像またはアニメーションGIFを生成する。
   *
   * @param canvas 画像の描画に利用するCanvas要素
   * @param index ファイル名と画像内容に使用する画像番号
   * @returns 選択形式で生成した画像Blob
   */
  const createImageBlob = async (canvas: HTMLCanvasElement, index: number) => {
    if (format.value === 'gif') return createAnimatedGifBlob(canvas, index)
    draw(canvas, index)
    return toBlob(canvas)
  }

  /**
   * 自由入力された枚数を整数へ変換し、現在の許容範囲内へ補正する。
   */
  const normalizeCount = () => {
    const numericCount = Number(count.value)
    count.value = Number.isFinite(numericCount)
      ? Math.max(1, Math.min(maxCount.value, Math.trunc(numericCount)))
      : 1
  }

  /**
   * 入力値を検証し、指定枚数の画像を生成してZIPとしてダウンロードする。
   */
  const generate = async () => {
    error.value = ''
    if (width.value < 1 || height.value < 1 || width.value > 4096 || height.value > 4096) {
      error.value = '幅と高さは1〜4096pxで指定してください。'
      return
    }
    if (count.value < 1 || count.value > maxCount.value) {
      error.value = `枚数は1〜${maxCount.value}枚で指定してください。`
      return
    }
    const workloadError = validateGenerationWorkload(
      width.value,
      height.value,
      count.value,
      targetKB.value,
      format.value,
      pattern.value,
    )
    if (workloadError) {
      error.value = workloadError
      return
    }

    generating.value = true
    progress.value = 0
    try {
      const zip = new JSZip()
      const canvas = document.createElement('canvas')
      for (let index = 1; index <= count.value; index++) {
        zip.file(
          createImageFileName(
            index,
            nameMode.value,
            format.value,
            customFileName.value,
            count.value,
          ),
          await padBlobToTarget(await createImageBlob(canvas, index), targetKB.value, format.value),
          {
            binary: true,
            compression: 'STORE',
          },
        )
        progress.value = Math.round((index / count.value) * 85)
        await new Promise(requestAnimationFrame)
      }
      const output = await zip.generateAsync(
        { type: 'blob', compression: 'STORE' },
        (info) => (progress.value = 85 + Math.round(info.percent * 0.15)),
      )
      const url = URL.createObjectURL(output)
      const link = document.createElement('a')
      link.href = url
      link.download = `sample-images-${width.value}x${height.value}-${count.value}.zip`
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (caughtError) {
      error.value =
        caughtError instanceof Error ? caughtError.message : '生成中にエラーが発生しました。'
    } finally {
      generating.value = false
    }
  }

  /**
   * 主要な画像生成設定を初期値へ戻す。
   */
  const reset = () => {
    width.value = 800
    height.value = 600
    count.value = 20
    format.value = 'jpeg'
    targetKB.value = 0
    pattern.value = 'gradient'
    solidColor.value = '#356859'
    gradientStartColor.value = '#d55f39'
    gradientEndColor.value = '#18352c'
  }

  /**
   * 実行中のGIFプレビュー用タイマーを停止する。
   */
  const stopPreviewAnimation = () => {
    if (previewAnimationTimer !== undefined) {
      clearInterval(previewAnimationTimer)
      previewAnimationTimer = undefined
    }
  }

  /**
   * GIF選択時にタイトル表示・非表示を切り替えるプレビューを開始する。
   */
  const startPreviewAnimation = () => {
    stopPreviewAnimation()
    if (format.value !== 'gif') return
    previewAnimationTimer = setInterval(() => {
      previewTitleVisible = !previewTitleVisible
      if (preview.value) draw(preview.value, 1, previewTitleVisible)
    }, 800)
  }

  /**
   * 現在の設定をプレビュー用Canvasへ反映する。
   */
  const updatePreview = () => {
    previewTitleVisible = true
    if (preview.value) draw(preview.value, 1, previewTitleVisible)
    startPreviewAnimation()
  }

  watch(
    [
      width,
      height,
      format,
      targetKB,
      pattern,
      solidColor,
      gradientStartColor,
      gradientEndColor,
      showNumber,
      showDimensions,
      showSize,
    ],
    () => nextTick(updatePreview),
  )
  watch(maxCount, (maximum) => {
    count.value = Math.min(count.value, maximum)
  })
  onMounted(updatePreview)
  onBeforeUnmount(stopPreviewAnimation)

  return {
    preview,
    width,
    height,
    count,
    format,
    targetKB,
    pattern,
    solidColor,
    gradientStartColor,
    gradientEndColor,
    nameMode,
    customFileName,
    showNumber,
    showDimensions,
    showSize,
    generating,
    progress,
    error,
    totalSize,
    maxCount,
    presets,
    setPreset,
    patternOptions,
    normalizeCount,
    generate,
    reset,
  }
}
