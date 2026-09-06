import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const outputRoot = new URL('../../.output/public/', import.meta.url)
const toolSlugs = [
  'browser-checker',
  'dummy-image-generator',
  'json-formatter',
  'base64',
  'url-encoder',
  'timestamp-converter',
  'uuid-generator',
  'jwt-decoder',
  'hash-generator',
  'text-counter',
]

const errorPageUrl = new URL('404.html', outputRoot)
assert.ok(existsSync(errorPageUrl), '404.htmlが生成されていません')
const errorPage = readFileSync(errorPageUrl, 'utf8')
assert.match(errorPage, /ページが見つかりません/, '404.htmlにエラー説明がありません')
assert.match(errorPage, /ホームへ戻る/, '404.htmlにホームへの導線がありません')

const sitemap = readFileSync(new URL('sitemap.xml', outputRoot), 'utf8')
for (const slug of toolSlugs) {
  const html = readFileSync(new URL(`tools/${slug}/index.html`, outputRoot), 'utf8')
  assert.match(html, /<h1[\s>]/, `${slug}: H1がありません`)
  assert.match(html, /<meta name="description"/, `${slug}: descriptionがありません`)
  assert.match(html, /<link rel="canonical"/, `${slug}: canonicalがありません`)
  assert.match(html, /"BreadcrumbList"/, `${slug}: BreadcrumbListがありません`)
  assert.match(
    html,
    /"(?:WebApplication|SoftwareApplication)"/,
    `${slug}: WebApplicationがありません`,
  )
  assert.match(html, /aria-label="パンくずリスト"/, `${slug}: 画面上のパンくずがありません`)
  assert.ok(sitemap.includes(`/tools/${slug}/`), `${slug}: sitemap.xmlにURLがありません`)
}

console.log(`SEO generated HTML check passed (${toolSlugs.length} tools)`)
