import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import BrowserChecker from '../../app/pages/tools/browser-checker/index.vue'

beforeAll(() => {
  vi.stubGlobal('useSeoMeta', () => undefined)
  vi.stubGlobal('useHead', () => undefined)
})

describe('Browser Checker page', () => {
  it('初期化して問い合わせ用レポートを生成する', async () => {
    const wrapper = mount(BrowserChecker, {
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' } } },
    })
    await nextTick()
    await nextTick()
    const report = (
      wrapper.get('textarea[aria-label="問い合わせ用レポート本文"]').element as HTMLTextAreaElement
    ).value
    expect(report).toContain('ブラウザ:')
    expect(report).toContain('OS:')
    expect(report).toContain('User Agent:')
    expect(report).not.toContain('undefined')
  })
})
