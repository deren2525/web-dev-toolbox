type SiteSeo = { title: string; description: string; path: string; type?: 'website' | 'article' }

export const useSiteSeo = ({ title, description, path, type = 'website' }: SiteSeo) => {
  const {
    public: { siteUrl },
  } = useRuntimeConfig()
  const canonical = `${siteUrl}${path}`
  const isTool = path.startsWith('/tools/') && path !== '/tools/'
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: `${siteUrl}/` },
    ...(isTool
      ? [{ '@type': 'ListItem', position: 2, name: 'ツール一覧', item: `${siteUrl}/tools/` }]
      : []),
    ...(path === '/'
      ? []
      : [
          {
            '@type': 'ListItem',
            position: isTool ? 3 : 2,
            name: title.split('｜')[0],
            item: canonical,
          },
        ]),
  ]
  useSeoMeta({
    title,
    description,
    robots: 'index,follow',
    ogTitle: title,
    ogDescription: description,
    ogType: type,
    ogUrl: canonical,
    ogLocale: 'ja_JP',
    ogImage: `${siteUrl}/favicon.svg`,
    twitterCard: 'summary',
  })
  useHead({
    link: [{ rel: 'canonical', href: canonical }],
    script: [
      ...(path === '/'
        ? [
            {
              type: 'application/ld+json' as const,
              innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'Web Dev Toolbox',
                url: canonical,
                inLanguage: 'ja',
              }),
            },
          ]
        : [
            {
              type: 'application/ld+json' as const,
              innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: breadcrumbItems,
              }),
            },
          ]),
      ...(isTool
        ? [
            {
              type: 'application/ld+json' as const,
              innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebApplication',
                name: title.split('｜')[0],
                url: canonical,
                description,
                applicationCategory: 'UtilitiesApplication',
                operatingSystem: 'Any',
                browserRequirements: 'JavaScript enabled',
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
              }),
            },
          ]
        : []),
    ],
  })
  return canonical
}
