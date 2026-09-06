import { mount } from '@vue/test-utils'
import { computed, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import DummyImagePage from '../../app/pages/tools/dummy-image-generator/index.vue'

const generate = vi.fn()

beforeEach(() => {
  generate.mockReset()
  vi.stubGlobal('useSeoMeta', () => undefined)
  vi.stubGlobal('useHead', () => undefined)
  vi.stubGlobal('useImageGenerator', () => ({
    preview: ref(),
    width: ref(800),
    height: ref(600),
    count: ref(20),
    format: ref('jpeg'),
    targetKB: ref(0),
    pattern: ref('solid'),
    solidColor: ref('#356859'),
    gradientStartColor: ref('#356859'),
    gradientEndColor: ref('#18352c'),
    nameMode: ref('standard'),
    customFileName: ref('sample-image'),
    showNumber: ref(true),
    showDimensions: ref(true),
    showSize: ref(true),
    generating: ref(false),
    progress: ref(0),
    error: ref(''),
    totalSize: computed(() => '約 2 MB'),
    maxCount: computed(() => 100),
    presets: [['正方形', 100, 100]],
    patternOptions: [{ value: 'solid', label: '単色' }],
    normalizeCount: vi.fn(),
    generate,
    reset: vi.fn(),
  }))
})

describe('Dummy Image Generator page', () => {
  it('生成設定を表示し、生成ボタンから処理を呼び出す', async () => {
    const wrapper = mount(DummyImagePage, {
      global: { stubs: { GeneratorStats: true, NuxtLink: { template: '<a><slot /></a>' } } },
    })
    expect(wrapper.text()).toContain('生成設定')
    const buttons = wrapper.findAll('button')
    const generateButton = buttons.find((button) => button.text().includes('ZIP生成'))
    expect(generateButton).toBeDefined()
    await generateButton!.trigger('click')
    expect(generate).toHaveBeenCalledOnce()
  })
})
