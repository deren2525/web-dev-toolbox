type BrowserInfo = {
  userAgent: string
  userAgentData: string
  language: string
  cookieEnabled: string
  browserName: string
  browserVersion: string
  operatingSystem: string
  platformVersion: string
  architecture: string
  bitness: string
  formFactors: string
  mobileHint: string
  javascriptEnabled: string
  colorDepth: string
  pixelDepth: string
  devicePixelRatio: string
  hardwareConcurrency: string
  deviceMemory: string
  maxTouchPoints: string
  networkConnectionType: string
}

type EnvironmentSnapshot = {
  browserName: string
  browserVersion: string
  operatingSystem: string
  platformVersion: string
  deviceType: string
  windowSize: string
  screenSize: string
  language: string
  timezone: string
  url: string
  userAgent: string
}

type DiffItem = {
  label: string
  previous: string
  current: string
}

type UserAgentBrand = {
  brand: string
  version: string
}

type UserAgentDataValues = {
  brands?: UserAgentBrand[]
  mobile?: boolean
  platform?: string
  architecture?: string
  bitness?: string
  formFactors?: string[]
  fullVersionList?: UserAgentBrand[]
  model?: string
  platformVersion?: string
  wow64?: boolean
}

type UserAgentData = {
  brands: UserAgentBrand[]
  mobile: boolean
  platform: string
  getHighEntropyValues?: (hints: string[]) => Promise<UserAgentDataValues>
}

type ExtendedNavigator = Navigator & {
  userAgentData?: UserAgentData
  deviceMemory?: number
  connection?: { effectiveType?: string }
  mozConnection?: { effectiveType?: string }
  webkitConnection?: { effectiveType?: string }
}

export const useBrowserChecker = () => {
  const browserInfo = ref<BrowserInfo>({
    userAgent: '',
    userAgentData: '',
    language: '',
    cookieEnabled: '',
    browserName: '',
    browserVersion: '',
    operatingSystem: '',
    platformVersion: '',
    architecture: '',
    bitness: '',
    formFactors: '',
    mobileHint: '',
    javascriptEnabled: '',
    colorDepth: '',
    pixelDepth: '',
    devicePixelRatio: '',
    hardwareConcurrency: '',
    deviceMemory: '',
    maxTouchPoints: '',
    networkConnectionType: '',
  })

  const windowSize = ref({ width: 0, height: 0 })
  const screenSize = ref({ width: 0, height: 0 })
  const screenAvailSize = ref({ width: 0, height: 0 })
  const deviceTypeLabel = ref('')
  const currentUrl = ref('')
  const timezone = ref('')
  const generatedAt = ref('')
  const copyStatus = ref('')
  const previousSnapshot = ref<EnvironmentSnapshot | null>(null)

  const snapshotStorageKey = 'browser-check:last-environment'

  const browserInfoItems = computed(() => [
    { label: 'ブラウザ名', value: browserInfo.value.browserName },
    { label: 'ブラウザバージョン', value: browserInfo.value.browserVersion },
    { label: 'OS', value: browserInfo.value.operatingSystem },
    { label: 'OSバージョン', value: browserInfo.value.platformVersion },
    { label: 'CPUアーキテクチャ', value: browserInfo.value.architecture },
    { label: 'ビット数', value: browserInfo.value.bitness },
    { label: '端末種別', value: deviceTypeLabel.value },
    { label: 'フォームファクター', value: browserInfo.value.formFactors },
    { label: 'モバイル判定', value: browserInfo.value.mobileHint },
    { label: 'ユーザーエージェント', value: browserInfo.value.userAgent },
    { label: 'User-Agent Client Hints', value: browserInfo.value.userAgentData },
    { label: '言語', value: browserInfo.value.language },
    { label: 'Cookie', value: browserInfo.value.cookieEnabled },
    { label: 'JavaScript', value: browserInfo.value.javascriptEnabled },
    { label: 'デバイスピクセル比', value: browserInfo.value.devicePixelRatio },
    { label: '色深度', value: browserInfo.value.colorDepth },
    { label: 'ピクセル深度', value: browserInfo.value.pixelDepth },
    { label: '論理CPUスレッド数', value: browserInfo.value.hardwareConcurrency },
    { label: '推定メモリ', value: browserInfo.value.deviceMemory },
    { label: '最大タッチ点数', value: browserInfo.value.maxTouchPoints },
    { label: 'ネットワーク', value: browserInfo.value.networkConnectionType },
  ])

  const displayValue = (value: string, fallback = 'アクセス後に自動取得') => value || fallback
  const displayNumber = (value: number) => (value ? value.toLocaleString() : '-')
  const formatSize = (width: number, height: number) =>
    width && height
      ? `${width.toLocaleString()} x ${height.toLocaleString()} px`
      : 'アクセス後に表示'

  const currentSnapshot = computed<EnvironmentSnapshot>(() => ({
    browserName: displayValue(browserInfo.value.browserName, ''),
    browserVersion: displayValue(browserInfo.value.browserVersion, ''),
    operatingSystem: displayValue(browserInfo.value.operatingSystem, ''),
    platformVersion: displayValue(browserInfo.value.platformVersion, ''),
    deviceType: displayValue(deviceTypeLabel.value, ''),
    windowSize: formatSize(windowSize.value.width, windowSize.value.height),
    screenSize: formatSize(screenSize.value.width, screenSize.value.height),
    language: displayValue(browserInfo.value.language, ''),
    timezone: displayValue(timezone.value, ''),
    url: displayValue(currentUrl.value, ''),
    userAgent: displayValue(browserInfo.value.userAgent, ''),
  }))

  const supportReport = computed(() =>
    [
      '発生した問題:',
      '',
      '期待した動作:',
      '',
      '実際の動作:',
      '',
      '再現手順:',
      '1. ',
      '',
      'スクリーンショット:',
      '必要に応じて、このメッセージに画像を添付してください。',
      '',
      '環境情報:',
      `- 発生時刻: ${displayValue(generatedAt.value, '')}`,
      `- URL: ${displayValue(currentUrl.value, '')}`,
      `- ブラウザ: ${displayValue(browserInfo.value.browserName, '')} ${displayValue(browserInfo.value.browserVersion, '')}`.trim(),
      `- OS: ${displayValue(browserInfo.value.operatingSystem, '')} ${displayValue(browserInfo.value.platformVersion, '')}`.trim(),
      `- 端末種別: ${displayValue(deviceTypeLabel.value, '')}`,
      `- ウィンドウサイズ: ${formatSize(windowSize.value.width, windowSize.value.height)}`,
      `- 画面サイズ: ${formatSize(screenSize.value.width, screenSize.value.height)}`,
      `- 言語: ${displayValue(browserInfo.value.language, '')}`,
      `- タイムゾーン: ${displayValue(timezone.value, '')}`,
      `- Cookie: ${displayValue(browserInfo.value.cookieEnabled, '')}`,
      `- JavaScript: ${displayValue(browserInfo.value.javascriptEnabled, '')}`,
      `- デバイスピクセル比: ${displayValue(browserInfo.value.devicePixelRatio, '')}`,
      `- ネットワーク: ${displayValue(browserInfo.value.networkConnectionType, '')}`,
      `- User Agent: ${displayValue(browserInfo.value.userAgent, '')}`,
    ].join('\n'),
  )

  const diffItems = computed<DiffItem[]>(() => {
    if (!previousSnapshot.value) return []

    const labels: Record<keyof EnvironmentSnapshot, string> = {
      browserName: 'ブラウザ名',
      browserVersion: 'ブラウザバージョン',
      operatingSystem: 'OS',
      platformVersion: 'OSバージョン',
      deviceType: '端末種別',
      windowSize: 'ウィンドウサイズ',
      screenSize: '画面サイズ',
      language: '言語',
      timezone: 'タイムゾーン',
      url: 'URL',
      userAgent: 'ユーザーエージェント',
    }

    return (Object.keys(labels) as Array<keyof EnvironmentSnapshot>)
      .filter((key) => previousSnapshot.value?.[key] !== currentSnapshot.value[key])
      .map((key) => ({
        label: labels[key],
        previous: previousSnapshot.value?.[key] || '',
        current: currentSnapshot.value[key],
      }))
  })

  const getGeneratedAt = () => {
    return new Intl.DateTimeFormat('ja-JP', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(new Date())
  }

  const loadPreviousSnapshot = () => {
    try {
      const storedValue = localStorage.getItem(snapshotStorageKey)
      previousSnapshot.value = storedValue ? (JSON.parse(storedValue) as EnvironmentSnapshot) : null
    } catch {
      previousSnapshot.value = null
    }
  }

  const saveCurrentSnapshot = () => {
    try {
      localStorage.setItem(snapshotStorageKey, JSON.stringify(currentSnapshot.value))
    } catch {
      // localStorage is optional for the tool; reporting still works without it.
    }
  }

  const copyWithTextarea = (text: string) => {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.top = '-1000px'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

  const copySupportReport = async () => {
    generatedAt.value = getGeneratedAt()
    copyStatus.value = ''

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(supportReport.value)
      } else {
        copyWithTextarea(supportReport.value)
      }
      copyStatus.value = 'コピーしました'
    } catch {
      try {
        copyWithTextarea(supportReport.value)
        copyStatus.value = 'コピーしました'
      } catch {
        copyStatus.value = 'コピーできませんでした。テキストを選択してコピーしてください。'
      }
    }
  }

  const updateSizes = () => {
    windowSize.value = { width: window.innerWidth, height: window.innerHeight }
    screenSize.value = { width: window.screen.width, height: window.screen.height }
    screenAvailSize.value = { width: window.screen.availWidth, height: window.screen.availHeight }
  }

  const detectDeviceType = (ua: string, uaData?: UserAgentData) => {
    const lowerUa = ua.toLowerCase()

    if (uaData?.mobile) {
      return 'スマートフォン / タブレット'
    }

    if (
      /ipad|tablet/.test(lowerUa) ||
      (/android/.test(lowerUa) && !/mobile/.test(lowerUa)) ||
      isLikelyIPadOS()
    ) {
      return 'タブレット'
    }

    if (/iphone|ipod|android.*mobile|windows phone/.test(lowerUa)) {
      return 'スマートフォン'
    }

    return 'PC'
  }

  const isLikelyIPadOS = () => {
    return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  }

  const detectBrowser = (ua: string) => {
    const rules = [
      { name: 'Microsoft Edge', pattern: /edg\/([\d.]+)/i },
      { name: 'Opera', pattern: /opr\/([\d.]+)/i },
      { name: 'Firefox', pattern: /(?:firefox|fxios)\/([\d.]+)/i },
      { name: 'Chrome', pattern: /(?:chrome|crios)\/([\d.]+)/i },
      { name: 'Safari', pattern: /version\/([\d.]+).*safari/i },
    ]

    const matched = rules.find((rule) => rule.pattern.test(ua))
    return {
      name: matched?.name || 'Unknown',
      version: matched ? ua.match(matched.pattern)?.[1] || 'Unknown' : 'Unknown',
    }
  }

  const detectBrowserFromClientHints = (values: UserAgentDataValues) => {
    const brands = values.fullVersionList?.length ? values.fullVersionList : values.brands
    const filteredBrands = brands?.filter((item) => !/not.?a.?brand/i.test(item.brand)) || []
    const priority = ['Microsoft Edge', 'Google Chrome', 'Opera', 'Firefox', 'Safari', 'Chromium']
    const matched =
      priority.map((name) => filteredBrands.find((item) => item.brand === name)).find(Boolean) ||
      filteredBrands[0]

    return matched ? { name: matched.brand, version: matched.version } : { name: '', version: '' }
  }

  const detectOperatingSystem = (ua: string, platform: string) => {
    if (/chrome os/i.test(platform)) return 'ChromeOS'
    if (/ios|ipados/i.test(platform)) return 'iOS / iPadOS'
    if (/android/i.test(platform)) return 'Android'
    if (/windows/i.test(platform)) return 'Windows'
    if (/macos/i.test(platform)) return 'macOS'
    if (/linux/i.test(platform)) return 'Linux'
    if (/iphone|ipad|ipod/i.test(ua)) return 'iOS / iPadOS'
    if (isLikelyIPadOS()) return 'iPadOS'
    if (/android/i.test(ua)) return 'Android'
    if (/win/i.test(platform)) return 'Windows'
    if (/mac/i.test(platform)) return 'macOS'
    if (/linux/i.test(platform)) return 'Linux'
    return 'Unknown'
  }

  const detectPlatformVersionFromUserAgent = (ua: string) => {
    const iosVersion = ua.match(/(?:CPU(?: iPhone)? OS|CPU OS) ([\d_]+)/i)?.[1]
    if (iosVersion) return iosVersion.replaceAll('_', '.')

    const macVersion = ua.match(/Mac OS X ([\d_]+)/i)?.[1]
    if (macVersion) return macVersion.replaceAll('_', '.')

    const androidVersion = ua.match(/Android ([\d.]+)/i)?.[1]
    if (androidVersion) return androidVersion

    const windowsVersion = ua.match(/Windows NT ([\d.]+)/i)?.[1]
    if (windowsVersion) return windowsVersion

    return ''
  }

  const setClientHints = async (
    nav: ExtendedNavigator,
    uaFallbackBrowser: { name: string; version: string },
  ) => {
    const uaData = nav.userAgentData

    if (!uaData) {
      Object.assign(browserInfo.value, {
        browserName: uaFallbackBrowser.name,
        browserVersion: uaFallbackBrowser.version,
        operatingSystem: detectOperatingSystem(nav.userAgent, nav.platform),
        platformVersion: detectPlatformVersionFromUserAgent(nav.userAgent) || '非対応',
        architecture: '非対応',
        bitness: '非対応',
        formFactors: '非対応',
        mobileHint: '非対応',
        userAgentData: '非対応',
      })
      return
    }

    const lowEntropyValues: UserAgentDataValues = {
      brands: uaData.brands,
      mobile: uaData.mobile,
      platform: uaData.platform,
    }

    let values = lowEntropyValues

    if (uaData.getHighEntropyValues) {
      try {
        values = await uaData.getHighEntropyValues([
          'architecture',
          'bitness',
          'formFactors',
          'fullVersionList',
          'model',
          'platformVersion',
          'wow64',
        ])
      } catch {
        values = lowEntropyValues
      }
    }

    const clientHintBrowser = detectBrowserFromClientHints(values)

    Object.assign(browserInfo.value, {
      browserName: clientHintBrowser.name || uaFallbackBrowser.name,
      browserVersion: clientHintBrowser.version || uaFallbackBrowser.version,
      operatingSystem: detectOperatingSystem(nav.userAgent, values.platform || nav.platform),
      platformVersion:
        values.platformVersion || detectPlatformVersionFromUserAgent(nav.userAgent) || '非対応',
      architecture: values.architecture || '非対応',
      bitness: values.bitness || '非対応',
      formFactors: values.formFactors?.join(', ') || '非対応',
      mobileHint:
        typeof values.mobile === 'boolean' ? (values.mobile ? 'モバイル' : '非モバイル') : '',
      userAgentData: JSON.stringify({
        brands: values.brands,
        mobile: values.mobile,
        platform: values.platform,
        model: values.model,
        wow64: values.wow64,
      }),
    })
  }

  onMounted(async () => {
    const nav = window.navigator as ExtendedNavigator
    const ua = nav.userAgent
    const browser = detectBrowser(ua)
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection

    currentUrl.value = `${window.location.origin}${window.location.pathname}`
    timezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone || '取得不可'
    generatedAt.value = getGeneratedAt()
    loadPreviousSnapshot()
    updateSizes()
    window.addEventListener('resize', updateSizes)

    deviceTypeLabel.value = detectDeviceType(ua, nav.userAgentData)
    Object.assign(browserInfo.value, {
      userAgent: ua,
      language: nav.language,
      cookieEnabled: nav.cookieEnabled ? '有効' : '無効',
      javascriptEnabled: '有効',
      colorDepth: `${window.screen.colorDepth} bit`,
      pixelDepth: `${window.screen.pixelDepth} bit`,
      devicePixelRatio: window.devicePixelRatio.toString(),
      hardwareConcurrency: nav.hardwareConcurrency ? `${nav.hardwareConcurrency}` : '非対応',
      deviceMemory: nav.deviceMemory ? `${nav.deviceMemory} GB` : '非対応',
      maxTouchPoints: nav.maxTouchPoints ? `${nav.maxTouchPoints}` : '0',
      networkConnectionType: connection?.effectiveType || '非対応',
    })

    await setClientHints(nav, browser)
    saveCurrentSnapshot()
  })

  onBeforeUnmount(() => {
    saveCurrentSnapshot()
    window.removeEventListener('resize', updateSizes)
  })

  return {
    browserInfo,
    windowSize,
    screenSize,
    screenAvailSize,
    deviceTypeLabel,
    copyStatus,
    previousSnapshot,
    browserInfoItems,
    supportReport,
    diffItems,
    displayValue,
    displayNumber,
    formatSize,
    copySupportReport,
  }
}
