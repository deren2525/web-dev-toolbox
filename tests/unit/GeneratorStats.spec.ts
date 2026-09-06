import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import GeneratorStats from '../../app/components/GeneratorStats.vue'

describe('GeneratorStats', () => {
  it('画像サイズ、枚数、合計容量を表示する', () => {
    const wrapper = mount(GeneratorStats, {
      props: { width: 1200, height: 630, count: 20, totalSize: '2 MB' },
    })
    expect(wrapper.text()).toContain('1200 × 630')
    expect(wrapper.text()).toContain('20 枚')
    expect(wrapper.text()).toContain('2 MB')
  })
})
