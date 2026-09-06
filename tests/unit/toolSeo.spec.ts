import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { toolSeoDefinitions } from '../../app/data/toolSeo'

describe('tool SEO definitions', () => {
  it('公開中の全ツールに検索意図と固有メタデータがある', () => {
    const pageSlugs = readdirSync(resolve(process.cwd(), 'app/pages/tools'), {
      withFileTypes: true,
    })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()
    const definitions = [...toolSeoDefinitions].sort((left, right) =>
      left.slug.localeCompare(right.slug),
    )

    expect(definitions.map((item) => item.slug)).toEqual(pageSlugs)
    expect(new Set(definitions.map((item) => item.title)).size).toBe(definitions.length)
    for (const item of definitions) {
      expect(item.targetUser).not.toBe('')
      expect(item.searchIntent).not.toBe('')
      expect(item.primaryQuery).not.toBe('')
      expect(item.secondaryQueries.length).toBeGreaterThan(0)
      expect(item.title).toContain(item.h1)
      expect(item.description.length).toBeGreaterThan(20)
      expect(item.relatedTools.length).toBeGreaterThan(0)
      expect(item.relatedTools).not.toContain(item.slug)
    }
  })
})
