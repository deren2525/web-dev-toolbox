import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import TimestampConverter from '../../app/pages/tools/timestamp-converter/index.vue'

beforeAll(() => {
  vi.stubGlobal('useSiteSeo', () => undefined)
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
  })
})

const mountPage = () =>
  mount(TimestampConverter, {
    global: {
      stubs: {
        UtilityPage: { template: '<main><slot name="tool" /></main>' },
        RelatedTools: true,
      },
    },
  })

describe('Unix timestamp converter', () => {
  it('初期表示時に実行時エラーが発生せず日時を表示する', async () => {
    const wrapper = mountPage()
    await nextTick()
    expect(wrapper.text()).toContain('ローカル日時')
    expect(wrapper.text()).toContain('UTC日時')
  })

  it('日時をUnix秒とミリ秒へ変換する', async () => {
    const wrapper = mountPage()
    await wrapper.get('#datetime').setValue('2026-01-01T00:00:00')
    await wrapper.get('input[type="checkbox"]').setValue(true)
    const convertButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Unix時間へ変換'))
    expect(convertButton).toBeDefined()
    await convertButton!.trigger('click')
    expect(wrapper.text()).toContain('1767225600')
    expect(wrapper.text()).toContain('1767225600000')
    const resultButton = wrapper.findAll('button').find((button) => button.text() === '1767225600')
    expect(resultButton).toBeDefined()
    await resultButton!.trigger('click')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('1767225600')
  })
})
