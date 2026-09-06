import { mount } from '@vue/test-utils'
import { createHash } from 'node:crypto'
import { nextTick } from 'vue'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import Base64Page from '../../app/pages/tools/base64/index.vue'
import JsonPage from '../../app/pages/tools/json-formatter/index.vue'
import UrlPage from '../../app/pages/tools/url-encoder/index.vue'
import UuidPage from '../../app/pages/tools/uuid-generator/index.vue'
import JwtPage from '../../app/pages/tools/jwt-decoder/index.vue'
import HashPage from '../../app/pages/tools/hash-generator/index.vue'
import TextCounterPage from '../../app/pages/tools/text-counter/index.vue'

beforeAll(() => {
  vi.stubGlobal('useSiteSeo', () => undefined)
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
  })
})

const stubs = {
  UtilityPage: { template: '<main><slot name="tool" /></main>' },
  ToolActions: {
    props: ['primary', 'secondary', 'disabled'],
    emits: ['primary', 'secondary'],
    template:
      '<div><button data-action="primary" :disabled="disabled" @click="$emit(\'primary\')">{{ primary }}</button><button data-action="secondary" @click="$emit(\'secondary\')">{{ secondary }}</button></div>',
  },
  RelatedTools: true,
}

describe('utility tool pages', () => {
  it('JSONを整形し、不正なJSONにはエラーを表示する', async () => {
    const wrapper = mount(JsonPage, { global: { stubs } })
    await wrapper.get('#json-input').setValue('{"ok":true}')
    await wrapper.get('[data-action="primary"]').trigger('click')
    expect((wrapper.get('#json-output').element as HTMLTextAreaElement).value).toBe(
      '{\n  "ok": true\n}',
    )
    await wrapper.get('#json-output').trigger('click')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('{\n  "ok": true\n}')
    await wrapper.get('#json-input').setValue('{invalid}')
    await wrapper.get('[data-action="primary"]').trigger('click')
    expect(wrapper.text()).toContain('構文エラー')
  })

  it('日本語をBase64へ変換して元に戻す', async () => {
    const wrapper = mount(Base64Page, { global: { stubs } })
    await wrapper.get('#base64-input').setValue('日本語')
    await wrapper.get('[data-action="primary"]').trigger('click')
    const encoded = (wrapper.get('#base64-output').element as HTMLTextAreaElement).value
    expect(encoded).toBe('5pel5pys6Kqe')
    await wrapper.get('#base64-input').setValue(encoded)
    await wrapper.get('[data-action="secondary"]').trigger('click')
    expect((wrapper.get('#base64-output').element as HTMLTextAreaElement).value).toBe('日本語')
  })

  it('URLのクエリ値をエンコードして元に戻す', async () => {
    const wrapper = mount(UrlPage, { global: { stubs } })
    await wrapper.get('#url-input').setValue('日本語 test')
    await wrapper.get('[data-action="primary"]').trigger('click')
    const encoded = (wrapper.get('#url-output').element as HTMLTextAreaElement).value
    expect(encoded).toBe('%E6%97%A5%E6%9C%AC%E8%AA%9E%20test')
    await wrapper.get('#url-input').setValue(encoded)
    await wrapper.get('[data-action="secondary"]').trigger('click')
    expect((wrapper.get('#url-output').element as HTMLTextAreaElement).value).toBe('日本語 test')
  })

  it('指定数のUUID v4を生成する', async () => {
    const wrapper = mount(UuidPage, { global: { stubs } })
    await nextTick()
    const initial = (wrapper.get('textarea').element as HTMLTextAreaElement).value.split('\n')
    expect(initial).toHaveLength(10)
    expect(
      initial.every((value) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(value),
      ),
    ).toBe(true)
    await wrapper.get('input[type="number"]').setValue(3)
    await wrapper.get('[data-action="primary"]').trigger('click')
    expect((wrapper.get('textarea').element as HTMLTextAreaElement).value.split('\n')).toHaveLength(
      3,
    )
  })

  it('JWTのHeaderとPayloadをデコードする', async () => {
    const wrapper = mount(JwtPage, { global: { stubs } })
    const token = `${btoa('{"alg":"none","typ":"JWT"}')}.${btoa('{"sub":"123","exp":1893456000}')}.signature`
    await wrapper.get('#jwt-input').setValue(token)
    await wrapper.get('[data-action="primary"]').trigger('click')
    expect((wrapper.get('#jwt-header').element as HTMLTextAreaElement).value).toContain(
      '"alg": "none"',
    )
    expect((wrapper.get('#jwt-payload').element as HTMLTextAreaElement).value).toContain(
      '"sub": "123"',
    )
    expect(wrapper.text()).toContain('署名は検証していません')
    vi.mocked(navigator.clipboard.writeText).mockClear()
    await wrapper.get('#jwt-header').trigger('keydown', { key: 'Enter' })
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      '{\n  "alg": "none",\n  "typ": "JWT"\n}',
    )
  })

  it('不正なJWTをエラーにする', async () => {
    const wrapper = mount(JwtPage, { global: { stubs } })
    await wrapper.get('#jwt-input').setValue('not-a-jwt')
    await wrapper.get('[data-action="primary"]').trigger('click')
    expect(wrapper.text()).toContain('正しいJWT')
  })

  it('SHA-256ハッシュを16進数で表示する', async () => {
    const digest = vi.fn(async (algorithm: string, data: ArrayBuffer | ArrayBufferView) => {
      const name = algorithm.toLowerCase().replace('-', '')
      const bytes = ArrayBuffer.isView(data)
        ? new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
        : new Uint8Array(data)
      return Uint8Array.from(createHash(name).update(bytes).digest()).buffer
    })
    Object.defineProperty(globalThis.crypto, 'subtle', {
      configurable: true,
      value: { digest },
    })
    const wrapper = mount(HashPage, { global: { stubs } })
    await wrapper.get('#hash-input').setValue('hello')
    await wrapper.get('[data-action="primary"]').trigger('click')
    expect(digest).toHaveBeenCalledWith('SHA-256', expect.any(Uint8Array))
    expect((wrapper.get('#hash-output').element as HTMLTextAreaElement).value).toBe(
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    )
    vi.mocked(navigator.clipboard.writeText).mockClear()
    await wrapper.get('#hash-output').trigger('keydown', { key: ' ' })
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    )
  })

  it('文字数・UTF-8バイト数・行数・単語数を集計する', async () => {
    const wrapper = mount(TextCounterPage, { global: { stubs } })
    await wrapper.get('#counter-input').setValue('日本語 test\n2行目')
    expect(wrapper.text()).toContain('12')
    expect(wrapper.text()).toContain('22')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('3')
  })
})
